import numpy as np
import pandas as pd
import tensorflow as tf

from tensorflow import keras
from fastapi import HTTPException
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.model_selection import train_test_split

import config
from constants import ProblemType
from models.models import NNLayer, Column
from services.shared_service import log, send_msg, run_async
from services.datastat_service import get_stat_indicators
from helpers.weight_init_helper import map_weight_init
from helpers.metric_helper import map_metrics, Metric
from helpers.optimizer_helper import map_optimizer, Optimizer
from helpers.activation_func_helper import map_activation_function, ActivationFunction
from helpers.loss_func_helper import map_loss_function, LossFunction
from helpers.encoder_helper import map_catcolencoder, CatColEncoder

#################################################################

VERBOSE = 0

if config.ENVIRONMENT == 'development':
    VERBOSE = 1

#################################################################

# Makes dictionary with information about colums should be encoded with given encoder
def make_encoder_col_dict(features: Column, labels: Column, cont_cols: dict):
    encoders = {'features': {}, 'labels': {}}

    for group_name, col_group in [ ('features', features), ('labels', labels) ]:
        for col in col_group:
            if not col.name in cont_cols[group_name]:
                if not col.encoder in encoders[group_name]:
                    encoders[group_name][col.encoder] = [col.name]
                else:
                    encoders[group_name][col.encoder] += [col.name]

    return encoders

# # #

def encode_and_scale(cont_cols: dict, encoders_cols_dict: {str}, X, y):
    col_transformers = {}
    log(encoders_cols_dict, 'encoders_cols_dict')

    for i in ['features', 'labels']:
        if not 'OneHot' in encoders_cols_dict[i]:
            encoders_cols_dict[i]['OneHot'] = []
            
        if not 'Ordinal' in encoders_cols_dict[i]:
            encoders_cols_dict[i]['Ordinal'] = []
            
        if not 'Binary' in encoders_cols_dict[i]:
            encoders_cols_dict[i]['Binary'] = []

        log(i)
        log(encoders_cols_dict[i]['OneHot'])
        log(encoders_cols_dict[i]['Ordinal'])
        log(encoders_cols_dict[i]['Binary'])

        col_transformers[i] = ColumnTransformer([
            ("scaler", MinMaxScaler(), cont_cols[i]),
            ("OneHot", map_catcolencoder(CatColEncoder.OneHot), encoders_cols_dict[i]['OneHot']),
            ("Ordinal", map_catcolencoder(CatColEncoder.Ordinal), encoders_cols_dict[i]['Ordinal']),
            ("Binary", map_catcolencoder(CatColEncoder.Binary), encoders_cols_dict[i]['Binary'])
        ])

    X_preprocessed = col_transformers['features'].fit_transform(X)
    log(X_preprocessed, "X_preprocessed")
    
    y_preprocessed = col_transformers['labels'].fit_transform(y)
    log(y_preprocessed, "y_preprocessed")

    return X_preprocessed, y_preprocessed, col_transformers

# # #

def create_layer_array(nnlayers: NNLayer, problem_type: str, features: [str], num_of_classes: int, target_encoding: str):
    layers = []

    nnlayers.sort(key=lambda nn_layer: nn_layer.index)

    # Add feature layer and hidden layers #

    for layer in nnlayers:
        if layer.units <= 0:
            raise HTTPException(status_code=400, 
                detail=f"Invalid propery value for layer ({layer.index}). Number of units has to be greater then 0")
        
        layers.append(
            keras.layers.Dense(
            units=layer.units, 
            activation=map_activation_function(layer.activation_function), 
            kernel_initializer=map_weight_init(layer.weight_initializer)
            ))

    # Add output layer # TODO

    output_layer_activation_func = ActivationFunction.Linear
    output_units = 1
    
    if problem_type == ProblemType.CLASSIFICATION:
        output_units = num_of_classes
        
        if num_of_classes == 2 and target_encoding != 'Label':
            output_layer_activation_func = ActivationFunction.Sigmoid
        else:
            output_layer_activation_func = ActivationFunction.Softmax


    log(f'Output layer: af={output_layer_activation_func}; unites: {output_units};')

    layers.append(
        keras.layers.Dense(
            units=output_units, 
            activation=map_activation_function(output_layer_activation_func), 
            kernel_initializer=map_weight_init(layer.weight_initializer)
            ))

    return layers

#################################################################
# Main code

def train_model(
    df              : pd.DataFrame,
    problem_type    : str,
    features        : [Column],
    labels          : [Column],
    layers          : [NNLayer],
    metrics         : [Metric],
    learning_rate   : float,
    loss_function   : LossFunction,
    test_size       : float,
    validation_size : float,
    epochs          : int,
    optimizer       : Optimizer,
    dataset_headers : [str],
    cont_cols_set   : set, 
    cat_cols_set    : set,
    client_conn_id  : str
    ):
    
    log(features, 'features: ')
    log(labels, "labels")

    cont_cols = {}
    cont_cols['features'] = list(set([feature.name for feature in features ]) & cont_cols_set)
    cont_cols['labels'] = list(set([label.name for label in labels ]) & cont_cols_set)

    log(cont_cols, "cont_cols = ")

    if labels[0].name in cont_cols['labels']:
        target_encoder = 'None'
    else:    
        target_encoder = labels[0].encoder

    log(target_encoder, "target_encoder: ")

    # Get dict with list of cols to encode with specific encoder
    encoders_cols_dict = make_encoder_col_dict(features, labels, cont_cols)
    log(encoders_cols_dict, 'encoders_cols_dict')

    # Make a list of strings from Column lists #
    
    features = [ feature.name for feature in features ]
    labels   = [ label.name for label in labels ]

    # Get number of classes #

    unique_vals = -1 # skip counting if it is numerical
    num_of_classes = -1

    if problem_type == ProblemType.CLASSIFICATION:
        unique_vals = df.nunique()

        # current implementation allowes only one output variable
        num_of_classes = unique_vals[labels[0]]
        log(f"num_of_classes for column {labels[0]} is {num_of_classes}")

    # Separate labels from features
    X = df[features].copy()
    y = df[labels].copy()
    
    log(X, 'X')
    log(y, 'y')

    # Scale (normalize) numerical and encode categorical data
    X_preprocessed, y_preprocessed, cts = encode_and_scale(cont_cols, encoders_cols_dict, X, y)

    log(X_preprocessed, 'X_preprocessed')
    log(X_preprocessed[0].shape)

    log(y_preprocessed, 'y_preprocessed')

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X_preprocessed, y_preprocessed, test_size=test_size)

    log(X_train, 'X_train')
    log(y_train, 'y_train')
    log(X_test, 'X_test')
    log(y_test, 'y_test')
    
    # Make a model #
    
    layers = create_layer_array(layers, problem_type, features, num_of_classes, target_encoder)
    model = tf.keras.Sequential(layers)

    #model.summary()

    # Map optimizer key-code to actual tf optimizer     
    optimizer = map_optimizer(optimizer, learning_rate)

    # Map loss function key-code to actual tf loss function     
    loss_function = map_loss_function(loss_function)

    # Map metric key-code list to actual tf merics
    tf_metrics = map_metrics(metrics)

    # Configure the model 
    model.compile(
        optimizer=optimizer,
        loss=loss_function,
        metrics=tf_metrics
    )

    callback = CustomCallback()
    callback.init(client_conn_id)

    # Train the model
    history = model.fit(
        X_train,
        y_train,
        epochs=epochs,
        verbose=VERBOSE,
        # Calculate validation results on x% of the training data.
        validation_split=validation_size,
        callbacks=[callback]
    )

    y_pred = model.predict(X_train)

    log(y_pred, 'y_pred')

    # Evaluate model #

    testing_set_metrics = model.evaluate(
        X_test,
        y_test,
        verbose=VERBOSE,
        return_dict = True
    )

    # Inverse scaler or encoder transformation #

    # input_actual_values = None 
    # pred_actual_values  = None

    # log(CatColEncoder.NoEncoder.value, "CatColEncoder.NoEncoder.value: ")

    # if target_encoder == CatColEncoder.NoEncoder.value:
    #     used_scaler = cts['labels'].named_transformers_['scaler']
        
    #     input_actual_values = used_scaler.inverse_transform(y_test)
    #     pred_actual_values  = used_scaler.inverse_transform(y_pred)
    # else:
    #     used_encoder = cts['labels'].named_transformers_[target_encoder]

    #     input_actual_values = used_encoder.inverse_transform(y_test)
    #     pred_actual_values  = used_encoder.inverse_transform(y_pred)


    # Testing set metrics

    log(testing_set_metrics, 'Testing score: ')

    return testing_set_metrics
    #return input_actual_values.ravel(), pred_actual_values.ravel()


#################################################################
### Callbacks

# u ovom callback-u ce se vrsiti komunikacija preko socket-a
class CustomCallback(keras.callbacks.Callback):

    def init(self, client_conn_id):
        self.client_conn_id = client_conn_id

    def on_epoch_end(self, epoch, logs=None):
        epoch += 1 # increase for 1 because it is 0-based
        keys = list(logs.keys())

        epoch_report = {"epoch" : epoch}
        new_key = None
        for key in keys:
            if 'true_positives' in key:
                new_key = 'true_positives'
            elif 'true_negatives' in key:
                new_key = 'true_negatives'
            elif 'false_negatives' in key:
                new_key = 'false_negatives'
            elif 'false_positives' in key:
                new_key = 'false_positives'
            elif 'precision' in key:
                new_key = 'precision'
            elif 'recall' in key:
                new_key = 'recall'
            else:
                new_key = key

            epoch_report[new_key] = logs[key]
            
        run_async(send_msg, self.client_conn_id, epoch_report)