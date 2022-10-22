from enum import Enum
import tensorflow as tf

class Metric(str, Enum):
    # AUC
    Accuracy                      = "accuracy"
    BinaryAccuracy                = "binary_accuracy"
    BinaryCrossentropy            = "binary_crossentropy"
    #BinaryIoU   = "BinaryIoU"
    CategoricalAccuracy           = "categorical_accuracy"
    CategoricalCrossentropy       = "categorical_crossentropy"
    CategoricalHinge              = "categorical_hinge"
    FalseNegatives                = "false_negatives"
    FalsePositives                = "false_positives"
    Hinge                         = "hinge"
    #IoU = "IoU"
    KLDivergence                  = "kullback_leibler_divergence"
    LogCoshError                  = "logcosh"
    MeanAbsoluteError             = "mean_absolute_error"
    MeanAbsolutePercentageError   = "mean_absolute_percentage_error"
    #MeanIoU      = "MeanIoU"
    #MeanRelativeError             = "MeanRelativeError" required normalizer
    MeanSquaredError              = "mean_squared_error"
    MeanSquaredLogarithmicError   = "mean_squared_logarithmic_error"
    #MeanTensor
    #OneHotIoU
    #OneHotMeanIoU
    #Poisson                       = "poisson"
    Precision                     = "precision"
    #PrecisionAtRecall             = "PrecisionAtRecall" required recall
    Recall                        = "recall"
    #RecallAtPrecision             = "RecallAtPrecision" required precision
    RootMeanSquaredError          = "root_mean_squared_error"
    #SensitivityAtSpecificity      = "SensitivityAtSpecificity" required specificity
    #SparseCategoricalAccuracy     = "SparseCategoricalAccuracy"
    #SparseCategoricalCrossentropy = "SparseCategoricalCrossentropy"
    #SparseTopKCategoricalAccuracy = "SparseTopKCategoricalAccuracy"
    #SpecificityAtSensitivity      = "SpecificityAtSensitivity" required sensitivity
    SquaredHinge                  = "squared_hinge"
    #TopKCategoricalAccuracy       = "TopKCategoricalAccuracy"
    TrueNegatives                 = "true_negatives"
    TruePositives                 = "true_positives"

    def __repr__(self):
        return self.value

def map_metrics(metrics):   
    metric_switcher = {
        Metric.Accuracy                      : tf.keras.metrics.Accuracy(),
        Metric.BinaryAccuracy                : tf.keras.metrics.BinaryAccuracy(),
        Metric.BinaryCrossentropy            : tf.keras.metrics.BinaryCrossentropy(),
        #Metric.BinaryIoU   : tf.keras.metrics.BinaryIoU(),
        Metric.CategoricalAccuracy           : tf.keras.metrics.CategoricalAccuracy(),
        Metric.CategoricalCrossentropy       : tf.keras.metrics.CategoricalCrossentropy(),
        Metric.CategoricalHinge              : tf.keras.metrics.CategoricalHinge(),
        Metric.FalseNegatives                : tf.keras.metrics.FalseNegatives(),
        Metric.FalsePositives                : tf.keras.metrics.FalsePositives(),
        Metric.Hinge                         : tf.keras.metrics.Hinge(),
        #Metric.IoU : tf.keras.metrics.IoU(),
        Metric.KLDivergence                  : tf.keras.metrics.KLDivergence(),
        Metric.LogCoshError                  : tf.keras.metrics.LogCoshError(),
        Metric.MeanAbsoluteError             : tf.keras.metrics.MeanAbsoluteError(),
        Metric.MeanAbsolutePercentageError   : tf.keras.metrics.MeanAbsolutePercentageError(),
        #Metric.MeanIoU      : tf.keras.metrics.MeanIoU(),
        #Metric.MeanRelativeError             : tf.keras.metrics.MeanRelativeError(),
        Metric.MeanSquaredError              : tf.keras.metrics.MeanSquaredError(),
        Metric.MeanSquaredLogarithmicError   : tf.keras.metrics.MeanSquaredLogarithmicError(),
        #Metric.MeanTensor
        #Metric.OneHotIoU
        #Metric.OneHotMeanIoU
        #Metric.Poisson                       : tf.keras.metrics.Poisson(),
        Metric.Precision                     : tf.keras.metrics.Precision(),
        #Metric.PrecisionAtRecall             : tf.keras.metrics.PrecisionAtRecall(),
        Metric.Recall                        : tf.keras.metrics.Recall(),
        #Metric.RecallAtPrecision             : tf.keras.metrics.RecallAtPrecision(), required precision
        Metric.RootMeanSquaredError          : tf.keras.metrics.RootMeanSquaredError(),
        #Metric.SensitivityAtSpecificity      : tf.keras.metrics.SensitivityAtSpecificity(), required specificity
        #Metric.SparseCategoricalAccuracy     : tf.keras.metrics.SparseCategoricalAccuracy(),
        #Metric.SparseCategoricalCrossentropy : tf.keras.metrics.SparseCategoricalCrossentropy(),
        #Metric.SparseTopKCategoricalAccuracy : tf.keras.metrics.SparseTopKCategoricalAccuracy(),
        #Metric.SpecificityAtSensitivity      : tf.keras.metrics.SpecificityAtSensitivity(), required sensitivity
        Metric.SquaredHinge                  : tf.keras.metrics.SquaredHinge(),
        #Metric.TopKCategoricalAccuracy       : tf.keras.metrics.TopKCategoricalAccuracy(),
        Metric.TrueNegatives                 : tf.keras.metrics.TrueNegatives(),
        Metric.TruePositives                 : tf.keras.metrics.TruePositives()
    }

    mapped_metrics = []
    try:         
        for metric in metrics:
            mapped_metrics += [metric_switcher.get(metric)]

        return mapped_metrics
    except (KeyError, AttributeError):
        log(f'Key "{metric}" is not present in metric_switcher dictionary')
        raise HTTPException(status_code=400, detail=f'Metric "{metric}" is not supported')