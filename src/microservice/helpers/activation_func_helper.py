from enum import Enum
import tensorflow as tf

class ActivationFunction(str, Enum):
    #NoActivationfunction = None
    Elu                  = "Elu"
    Exponential          = "Exponential"
    GeLu                 = "GeLu"
    HardSigmoid          = "HardSigmoid"
    Linear               = "Linear"
    ReLu                 = "ReLu"
    SeLu                 = "SeLu"
    Sigmoid              = "Sigmoid"
    Softmax              = "Softmax"
    Softplus             = "Softplus"
    Softsign             = "Softsign"
    Swish                = "Swish"
    Tanh                 = "Tanh"

    def __repr__(self):
        return self.value

def map_activation_function(activation_func):   
    activation_func_switcher = {
        ActivationFunction.Elu           : tf.keras.activations.elu,
        ActivationFunction.Exponential   : tf.keras.activations.exponential,
        ActivationFunction.GeLu          : tf.keras.activations.gelu,
        ActivationFunction.HardSigmoid   : tf.keras.activations.hard_sigmoid,
        ActivationFunction.Linear        : tf.keras.activations.linear,
        ActivationFunction.ReLu          : tf.keras.activations.relu,
        ActivationFunction.SeLu          : tf.keras.activations.selu,
        ActivationFunction.Sigmoid       : tf.keras.activations.sigmoid,
        ActivationFunction.Softmax       : tf.keras.activations.softmax,
        ActivationFunction.Softplus      : tf.keras.activations.softplus,
        ActivationFunction.Softsign      : tf.keras.activations.softsign,
        ActivationFunction.Swish         : tf.keras.activations.swish,
        ActivationFunction.Tanh          : tf.keras.activations.tanh
    }

    try:         
        return activation_func_switcher.get(activation_func)
    except (KeyError, AttributeError):
        log(f'Key "{activation_func}" is not present in activation_func_switcher dictionary')
        raise HTTPException(status_code=400, detail=f'Activation function "{activation_func}" is not supported')