import os
import sys
import json
import time
import asyncio
import warnings
import http.client

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
   
import config
from services.shared_service import log

########################################################################

ANN_URL = f"{config.HOST_NAME}:{config.SERVER_PORT}"

warnings.filterwarnings("ignore", category=DeprecationWarning) 

client = http.client.HTTPConnection(ANN_URL)
client.set_debuglevel(5)

headers = {'Content-type' : 'application/json'}

########################################################################

encoders = [ "None", "OneHot", "Ordinal", "Binary" ]

activation_funcs = [ 
    "Elu", "Exponential", "GeLu", "HardSigmoid", "Linear", "ReLu", "SeLu", "Sigmoid", "Softmax", "Softplus", "Softsign", "Swish", "Tanh"
     ]

regression_loss_funcs = [
  "MeanAbsoluteError", "MeanAbsolutePercentageError", "MeanSquaredError", "MeanSquaredLogarithmicError"
  ] 

classification_loss_funcs = [ 
    "BinaryCrossentropy", "BinaryFocalCrossentropy", "CategoricalCrossentropy", "CategoricalHinge", "CosineSimilarity", "Hinge", "Huber",
    "KLDivergence",  
    #"Poisson", 
    "SquaredHinge"
     ]

regression_metrics = [
    "logcosh", "mean_absolute_error", "mean_absolute_percentage_error", "mean_squared_error", 
    "mean_squared_logarithmic_error", 
    #"poisson", 
    "root_mean_squared_error"
    ]

classification_metrics = [ 
    "accuracy", "binary_accuracy", "binary_crossentropy", "categorical_accuracy", "categorical_crossentropy", "categorical_hinge", "false_negatives", 
    "false_positives", "hinge", "kullback_leibler_divergence", "precision", "recall", "squared_hinge", "true_negatives", "true_positives" 
    ]

optimizers = [ 
    "Adam", "Adadelta", "Adagrad", "Adamax", "Ftrl", "Nadam", "RMSprop", "SGD"
     ]

weight_initializers = [ 
    "Constant", "GlorotNormal", "GlorotUniform", "HeNormal", "HeUniform", "Identity", "LecunNormal", "LecunUniform", "Ones", "Orthogonal", 
    "RandomNormal", "RandomUniform", "TruncatedNormal", "Zeros" 
    ] 

problem_types = [ 'regression', 'classification' ]

# # #

# Default objects #

layers_default_value = [
  {
    "index" : 0,
    "units" : 16,
    "weight_initializer" : "HeNormal",
    "activation_function" : "ReLu"
  },
  {
    "index" : 0,
    "units" : 8,
    "weight_initializer" : "HeNormal",
    "activation_function" : "ReLu"
  }
]

features_default_value = [
  {
    "name" : "string",
    "encoder": "None"
  }
]

labels_default_value = [
  {
    "name" : "string",
    "encoder": "None"
  }
]

metrics_default_value = regression_metrics

loss_function_default_value = 'MeanAbsoluteError'

###################################################################################################################################

def test_training_request(
  client_conn_id  = 1, 
  stored_dataset  = "http://localhost:7220/Datasets/1/181/weight-height.json",
  problem_type    = "regression",
  layers          = layers_default_value,
  features        = features_default_value,
  labels          = labels_default_value,
  metrics         = metrics_default_value,
  loss_function   = loss_function_default_value,
  test_size       = 0.2,
  validation_size = 0.2,
  epochs          = 30,
  optimizer       = 'Adam',
  learning_rate   = 0.1
  ):

  payload = {}
  payload["client_conn_id"] = client_conn_id
  payload["stored_dataset"] = stored_dataset
  payload["problem_type"] = problem_type
  payload["layers"] = layers
  payload["features"] = features
  payload["labels"] = labels
  payload["metrics"] = metrics
  payload["loss_function"] = loss_function
  payload["test_size"] = test_size
  payload["validation_size"] = validation_size
  payload["epochs"] = epochs
  payload["optimizer"] = optimizer
  payload["learning_rate"] = learning_rate

  json_data = json.dumps(payload)

  client.request('POST', '/training', json_data, headers)

  log(f'Test ID: {client_conn_id}; Testing dataset: {stored_dataset}')
  response = client.getresponse()

  with open(f"test_begin_training_{client_conn_id}_http.txt", 'a') as output_file:
        
        output_file.write(f"{30*'#'} \nRequest ID: {client_conn_id} \n{30*'#'} \n\n")
        
        output_file.write(f"Status and reason: {response.status} {response.reason} \n\n")

        response_headers = response.getheaders()

        if len(response_headers):
          output_file.write(f"Headers: \n")

          output_file.write(f'{response_headers[0][0]} = {response_headers[0][1]}')
          del response_headers[0]

          for header_key, header_value in response_headers:
            output_file.write(f'\n{header_key} = {header_value}')

        output_file.write(f'\n\n\nParameters: {json.dumps(payload, indent = 4, allow_nan = True)} \n\n')
  
        output_file.write('Body:\n')

        output_file.write(response.read().decode())    

  log(response.read().decode())

# # #

# loss x optimizer
def test_begin_training_api(stored_dataset, label_name, features, problem_type):
  id = 0

  label = {
    'name' : label_name,
    'encoder' : 'None'
  }

  loss_funcs = regression_loss_funcs
  metrics = regression_metrics

  if problem_type == 'classification':
    label['encoder'] = 'OneHot'
    loss_funcs = classification_loss_funcs
    metrics = classification_metrics
    

  for loss_func in loss_funcs:
    for optimizer in optimizers:
      id += 1
      test_training_request(
        client_conn_id = id,
        stored_dataset = stored_dataset,
        labels = [label],
        features = features,
        loss_function = loss_func,
        optimizer = optimizer,
        problem_type = problem_type,
        metrics = metrics
      )

# # #


#########################################################################

# diamonds.csv
dataset = 'http://localhost:7220/Datasets/1/546/titanic.json' # TODO umesto hardcoded str staviti input()

 # TODO umesto hardcoded feature-a staviti input() u while-u
features = [{
  'name'    : 'Fare',
  'encoder' : 'None'
}]

label_name = 'Sex'  # TODO umesto hardcoded str staviti input()

log(f'API URL: {ANN_URL}', use_print = True)
log(f"Testing 'begin_training' API...", use_print = True)

num_of_attempts = 0
MAX_ATTEMPTS = 10


def test():
    test_begin_training_api(
      stored_dataset = dataset,
      label_name = label_name,
      features = features,
      problem_type = 'classification' # TODO umesto hardcoded str staviti input()
    )

try:
  test()
  log("Testing of 'training/begin_training' endpoint was completed", use_print = True)
except ConnectionRefusedError:
  if num_of_attempts <= MAX_ATTEMPTS:
    num_of_attempts += 1
    time.sleep(2)
    test()
