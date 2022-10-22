from enum import Enum
import tensorflow as tf

class WeightInitializer(str, Enum):
    Constant        = "Constant",
    GlorotNormal    = "GlorotNormal",
    GlorotUniform   = "GlorotUniform",
    HeNormal        = "HeNormal",
    HeUniform       = "HeUniform",
    Identity        = "Identity",
    LecunNormal     = "LecunNormal",
    LecunUniform    = "LecunUniform",
    Ones            = "Ones",
    Orthogonal      = "Orthogonal",
    RandomNormal    = "RandomNormal",
    RandomUniform   = "RandomUniform",
    TruncatedNormal = "TruncatedNormal",
    Zeros           = "Zeros"

    def __repr__(self):
        return self.value

def map_weight_init(weight_init):   
    weight_init_switcher = {
        WeightInitializer.Constant           : tf.keras.initializers.Constant,
        WeightInitializer.GlorotNormal       : tf.keras.initializers.GlorotNormal,
        WeightInitializer.GlorotUniform      : tf.keras.initializers.GlorotUniform,
        WeightInitializer.HeNormal           : tf.keras.initializers.HeNormal,
        WeightInitializer.HeUniform          : tf.keras.initializers.HeUniform,
        WeightInitializer.Identity           : tf.keras.initializers.Identity,
        WeightInitializer.LecunNormal        : tf.keras.initializers.LecunNormal,
        WeightInitializer.LecunUniform       : tf.keras.initializers.LecunUniform,
        WeightInitializer.Ones               : tf.keras.initializers.Ones,
        WeightInitializer.Orthogonal         : tf.keras.initializers.Orthogonal,
        WeightInitializer.RandomNormal       : tf.keras.initializers.RandomNormal,
        WeightInitializer.RandomUniform      : tf.keras.initializers.RandomUniform,
        WeightInitializer.TruncatedNormal    : tf.keras.initializers.TruncatedNormal,
        WeightInitializer.Zeros              : tf.keras.initializers.Zeros
    }

    try:         
        return weight_init_switcher.get(weight_init)
    except (KeyError, AttributeError):
        log(f'Key "{weight_init}" is not present in weight_init_switcher dictionary')
        raise HTTPException(status_code=400, detail=f'Optimizer "{weight_init}" is not supported')