import time #
import pandas as pd
from fastapi import APIRouter, HTTPException, Body
from typing import Optional, List
from pydantic import AnyHttpUrl

from constants import ProblemType
from models.models import NNLayer, Column
from services.training_service import train_model
from services.dataprep_service import get_missing_values_for_each_column
from services.shared_service import log, read_json_data
from helpers.metric_helper import Metric
from helpers.optimizer_helper import Optimizer
from helpers.loss_func_helper import LossFunction

#################################################################

router = APIRouter(prefix="/training")

REGRESSION_METRICS = [
    Metric.LogCoshError, Metric.MeanAbsoluteError, Metric.MeanAbsolutePercentageError, Metric.MeanSquaredError, 
    Metric.MeanSquaredLogarithmicError, 
    #Metric.Poisson, 
    Metric.RootMeanSquaredError
    ]
    
REGRESSION_LOSS_FUNCS = [
    LossFunction.MeanAbsoluteError, LossFunction.MeanAbsolutePercentageError, LossFunction.MeanSquaredError, 
    LossFunction.MeanSquaredLogarithmicError
    ]

#################################################################

@router.post("")
async def begin_training(
    client_conn_id   : str = Body(...),
    stored_dataset   : str = Body("http://localhost:7220/Datasets/0/129/weight-height.json"),
    problem_type     : str = Body(ProblemType.REGRESSION),
    layers           : List[NNLayer] = Body(...),
    features         : List[Column] = Body(...),
    labels           : List[Column] = Body(...),
    metrics          : List[Metric] = Body([Metric.MeanAbsoluteError]),
    loss_function    : LossFunction = Body(LossFunction.MeanAbsoluteError),
    test_size        : float = Body(0.25),
    validation_size  : float = Body(0.2),
    epochs           : int = Body(100),
    optimizer        : Optimizer = Body(Optimizer.Adam),
    learning_rate    : float = Body(0.1)
    ):

    if True:
        start = time.time()

        log(f"Feature list={features};\n Label list={labels};\n Metric list={metrics};\n Layer list: {layers}")
        log(f"Loss function={loss_function};\n Optimizer={optimizer};\n Problem type: {problem_type}")

        problem_is_regression = problem_type == ProblemType.REGRESSION
        problem_is_classification = problem_type == ProblemType.CLASSIFICATION

        # Read data #

        dataset = read_json_data(stored_dataset)['parsedDataset']
        dataset['index_names'] = [None]
        dataset['column_names'] = [None]
        df = pd.DataFrame.from_dict(dataset, orient='tight')
        
        cont_cols_set = set(df.select_dtypes(include='number').columns.values)
        cat_cols_set = set(df.select_dtypes(exclude='number').columns.values)

        dataset_headers = list(cont_cols_set | cat_cols_set)

        # Check if features or labels have missing values #

        chosen_cols = [ col.name for col in features ]
        chosen_cols += [ col.name for col in labels ]

        missing_data = get_missing_values_for_each_column(df)
        has_missing_values = False
        chosen_cols_with_missing = []

        for column_name in chosen_cols:
            if missing_data[column_name] != 0:
                has_missing_values = True
                chosen_cols_with_missing = column_name

        if has_missing_values:
            raise HTTPException(status_code=400, detail=f"Chosen columns cannot have missing values. Columns with missing values: {chosen_cols_with_missing}")

        # Validate problem type #

        if problem_type not in [ProblemType.CLASSIFICATION, ProblemType.REGRESSION]:
            raise HTTPException(status_code=400, detail=f"Invalid problem type: {problem_type}")

        # Validate feature and label lists #

        for feature in features:
            if feature.name not in dataset_headers:
                raise HTTPException(status_code=400, detail=f"Invalid feature: {feature.name}")
        
        for label in labels:
            if label.name not in dataset_headers:
                raise HTTPException(status_code=400, detail=f"Invalid label: {label.name}")

        # Validate metric list #

        invalid_choices = []

        for metric in metrics:
            if problem_is_regression:
                if not metric in REGRESSION_METRICS:
                    invalid_choices.append(metric)
            elif metric in REGRESSION_METRICS:
                invalid_choices.append(metric)

        if len(invalid_choices) > 0:
            raise HTTPException(status_code=400,
                detail=f"One or more metric does not match it's problem type (problem type:'{problem_type}'). Invalid metrics:{invalid_choices}")

         # Validate loss function #

        invalid_choice = False

        if problem_is_regression:
            if not loss_function in REGRESSION_LOSS_FUNCS:
                invalid_choice = True
        elif loss_function in REGRESSION_LOSS_FUNCS:
            invalid_choice = True

        if invalid_choice:
            raise HTTPException(status_code=400,
                detail=f"Loss function '{loss_function}' does not match it's problem type (problem type:'{problem_type}').")        

        # Validate layer list #

        if len(layers) < 2:
            raise HTTPException(status_code=400, detail=f"Neural network must have at least 2 layers, input and output layer")

        # begin training #
        
        metrics_on_testing_set = train_model(
        #true, pred = train_model(
            df=df,
            problem_type=problem_type,
            features=features,
            labels=labels,
            layers=layers,
            metrics=metrics,
            learning_rate=learning_rate,
            loss_function=loss_function,
            test_size=test_size,
            validation_size=validation_size,
            epochs=epochs,
            optimizer=optimizer,
            dataset_headers=dataset_headers,
            cont_cols_set=cont_cols_set,
            cat_cols_set=cat_cols_set,
            client_conn_id=client_conn_id
            )

        end = time.time()

        log("Elapsed time: {:.4f}s".format(end-start))

        return {'test_metrics' : metrics_on_testing_set} # { "true-pred" : [f"{left} | {right}" for left,right in zip(true,pred) ] }
