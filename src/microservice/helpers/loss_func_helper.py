from enum import Enum
import tensorflow as tf

class LossFunction(str, Enum):
    BinaryCrossentropy            = "BinaryCrossentropy"
    BinaryFocalCrossentropy       = "BinaryFocalCrossentropy"
    CategoricalCrossentropy       = "CategoricalCrossentropy"
    CategoricalHinge              = "CategoricalHinge"
    CosineSimilarity              = "CosineSimilarity"
    Hinge                         = "Hinge"
    Huber                         = "Huber"
    KLDivergence                  = "KLDivergence"
    MeanAbsoluteError             = "MeanAbsoluteError"
    MeanAbsolutePercentageError   = "MeanAbsolutePercentageError"
    MeanSquaredError              = "MeanSquaredError"
    MeanSquaredLogarithmicError   = "MeanSquaredLogarithmicError"
    #Poisson                       = "Poisson"
    #SparseCategoricalCrossentropy = "SparseCategoricalCrossentropy"
    SquaredHinge                  = "SquaredHinge"

    def __repr__(self):
        return self.value

def map_loss_function(loss_func):   
    loss_func_switcher = {
        LossFunction.BinaryCrossentropy            : tf.keras.losses.BinaryCrossentropy(),
        LossFunction.BinaryFocalCrossentropy       : tf.keras.losses.BinaryFocalCrossentropy(),
        LossFunction.CategoricalCrossentropy       : tf.keras.losses.CategoricalCrossentropy(),
        LossFunction.CategoricalHinge              : tf.keras.losses.CategoricalHinge(),
        LossFunction.CosineSimilarity              : tf.keras.losses.CosineSimilarity(),
        LossFunction.Hinge                         : tf.keras.losses.Hinge(),
        LossFunction.Huber                         : tf.keras.losses.Huber(),
        LossFunction.KLDivergence                  : tf.keras.losses.KLDivergence(),
        LossFunction.MeanAbsoluteError             : tf.keras.losses.MeanAbsoluteError(),
        LossFunction.MeanAbsolutePercentageError   : tf.keras.losses.MeanAbsolutePercentageError(),
        LossFunction.MeanSquaredError              : tf.keras.losses.MeanSquaredError(),
        LossFunction.MeanSquaredLogarithmicError   : tf.keras.losses.MeanSquaredLogarithmicError(),
        #LossFunction.Poisson                       : tf.keras.losses.Poisson(),
        #LossFunction.SparseCategoricalCrossentropy : tf.keras.losses.SparseCategoricalCrossentropy(),
        LossFunction.SquaredHinge                  : tf.keras.losses.SquaredHinge()
    }

    try:         
        return loss_func_switcher.get(loss_func)
    except (KeyError, AttributeError):
        log(f'Key "{loss_func}" is not present in loss_func_switcher dictionary')
        raise HTTPException(status_code=400, detail=f'Loss function "{loss_func}" is not supported')