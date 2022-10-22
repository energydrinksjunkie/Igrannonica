export class Hyperparameter
{
    name!:string;
    info?:string;
    codename!:string;
    type?:String;
}

export class Constants{

  static readonly ENCODING_CATEGORICAL: Hyperparameter[] = [ 
      {name: 'One Hot', codename: 'OneHot'},
      {name: 'Ordinal', codename: 'Ordinal'},
      {name: 'Binary',  codename: 'Binary'}
    ];

    static readonly MISSING_HANDLER_NUMERICAL: Hyperparameter[] = [ 
      {name: 'Mean',              codename: 'mean'},
      {name: 'Median',            codename: 'median'},
      {name:'Fill with constant', codename:'constant_num'}
    ];

    static readonly MISSING_HANDLER_CATEGORICAL: Hyperparameter[] = [ 
      {name: 'Most frequent',      codename:'most_freq'},
      {name: 'Fill with constant', codename:'constant_str'},
    ];

    static readonly ACTIVATION_FUNCTIONS: Hyperparameter[] = [
      {name: 'Sigmoid',     info: 'Sigmoid!',     codename: 'Sigmoid'},
      {name: 'ReLu',        info: 'ReLu!',        codename: 'ReLu'},
      {name: 'Tanh',        info: 'Tanh!',        codename: 'Tanh'},
      {name: 'Linear',      info: 'Linear!',      codename: 'Linear'},
      {name: 'SeLu',        info: 'SeLu!',        codename: 'SeLu'},
      {name: 'Softmax',     info: 'Softmax!',     codename: 'Softmax'},
      {name: 'Softplus',    info: 'Softplus!',    codename: 'Softplus'},
      {name: 'Softsign',    info: 'Softsign!',    codename: 'Softsign'},
      {name: 'Exponential', info: 'Exponential!', codename: 'Exponential'},
      {name: 'Swish',       info: 'Swish!',       codename: 'Swish'},
      {name: 'Elu',         info: 'Elu!',         codename: 'Elu'},
    ];

    static readonly OPTIMIZER_FUNCTIONS: Hyperparameter[] = [
      {name: 'Adam',     info: 'Adam!',     codename: 'Adam'},
      {name: 'Adadelta', info: 'Adadelta!', codename: 'Adadelta'},
      {name: 'Adagrad',  info: 'Adagrad!',  codename: 'Adagrad'},
      {name: 'Adamax',   info: 'Adamax!',   codename: 'Adamax'},
      {name: 'Ftrl',     info: 'Ftrl!',     codename: 'Ftrl'},
      {name: 'Nadam',    info: 'Nadam!',    codename: 'Nadam'},
      {name: 'RMSprop',  info: 'RMSprop!',  codename: 'RMSprop'},
      {name: 'SGD',      info: 'SGD!',      codename: 'SGD'},
    ];
    
    static readonly LOSS_FUNCTIONS: Hyperparameter[] = [
      {name: 'Binary Crossentropy',            info: 'BinaryCrossentropy!',          codename: 'BinaryCrossentropy',          type: 'classification'},
      {name: 'Binary Focal Crossentropy',      info: 'BinaryFocalCrossentropy!',     codename: 'BinaryFocalCrossentropy',     type: 'classification'},
      {name: 'Categorical Crossentropy',       info: 'CategoricalCrossentropy!',     codename: 'CategoricalCrossentropy',     type: 'classification'},
      {name: 'Categorical Hinge',              info: 'CategoricalHinge!',            codename: 'CategoricalHinge',            type: 'classification'},
      {name: 'Cosine Similarity',              info: 'CosineSimilarity!',            codename: 'CosineSimilarity',            type: 'classification'},
      {name: 'Hinge',                          info: 'Hinge!',                       codename: 'Hinge',                       type: 'classification'},
      {name: 'Huber',                          info: 'Huber!',                       codename: 'Huber',                       type: 'classification'},
      {name: 'Kullback-Leibler Divergence',    info: 'KLDivergence!',                codename: 'KLDivergence',                type: 'classification'},
      {name: 'Mean Absolute Error',            info: 'MeanAbsoluteError!',           codename: 'MeanAbsoluteError',           type: 'regression'},
      {name: 'Mean Absolute Percentage Error', info: 'MeanAbsolutePercentageError!', codename: 'MeanAbsolutePercentageError', type: 'regression'},
      {name: 'Mean Squared Error',             info: 'MeanSquaredError!',            codename: 'MeanSquaredError',            type: 'regression'},
      {name: 'Mean Squared Logarithmic Error', info: 'MeanSquaredLogarithmicError!', codename: 'MeanSquaredLogarithmicError', type: 'regression'},
      //{name: 'Poisson',                      info: 'Poisson!', codename: 'Poisson', type: 'regression'},
      //{name: 'Sparse Categorical Crossentropy', info: 'SparseCategoricalCrossentropy!', codename: 'SparseCategoricalCrossentropy'},
      {name: 'Squared Hinge',                  info: 'SquaredHinge!',                codename: 'SquaredHinge',                type: 'classification'},
    ];

    static readonly METRICS : Hyperparameter[] = [
      {name: 'Accuracy',                       info: 'Accuracy!',                    codename: 'accuracy',                       type: 'classification'},
      {name: 'Binary Accuracy',                info: 'BinaryAccuracy!',              codename: 'binary_accuracy',                type: 'classification'},
      {name: 'Binary Crossentropy',            info: 'BinaryCrossentropy!',          codename: 'binary_crossentropy',            type: 'classification'},
      {name: 'Categorical Accuracy',           info: 'CategoricalAccuracy!',         codename: 'categorical_accuracy',           type: 'classification'},
      {name: 'Categorical Crossentropy',       info: 'CategoricalCrossentropy!',     codename: 'categorical_crossentropy',       type: 'classification'},
      {name: 'Categorical Hinge',              info: 'CategoricalHinge!',            codename: 'categorical_hinge',              type: 'classification'},
      {name: 'False Negatives',                info: 'FalseNegatives!',              codename: 'false_negatives',                type: 'classification'},
      {name: 'False Positives',                info: 'FalsePositives!',              codename: 'false_positives',                type: 'classification'},
      {name: 'Hinge',                          info: 'Hinge!',                       codename: 'hinge',                          type: 'classification'},
      {name: 'Kullback-Leibler Divergence',    info: 'KLDivergence!',                codename: 'kullback_leibler_divergence',    type: 'classification'},

      {name: 'Log Cosh Error',                 info: 'LogCoshError!',                codename: 'logcosh',                        type: 'regression'},
      {name: 'Mean Absolute Error',            info: 'MeanAbsoluteError!',           codename: 'mean_absolute_error',            type: 'regression'},
      {name: 'Mean Absolute Percentage Error', info: 'MeanAbsolutePercentageError!', codename: 'mean_absolute_percentage_error', type: 'regression'},
      {name: 'Mean Squared Error',             info: 'MeanSquaredError!',            codename: 'mean_squared_error',             type: 'regression'},
      {name: 'Mean Squared Logarithmic Error', info: 'MeanSquaredLogarithmicError!', codename: 'mean_squared_logarithmic_error', type: 'regression'},

      //{name: 'Poisson',                        info: 'Poisson!',                     codename: 'poisson',                        type: 'regression'},
      {name: 'Precision',                      info: 'Precision!',                   codename: 'precision',                      type: 'classification'},
      {name: 'Recall',                         info: 'Recall!',                      codename: 'recall',                         type: 'classification'},
      
      {name: 'Root Mean Squared Error',        info: 'RootMeanSquaredError!',        codename: 'root_mean_squared_error',        type: 'regression'},
      
      {name: 'Squared Hinge',                  info: 'SquaredHinge!',                codename: 'squared_hinge',                  type: 'classification'},
      {name: 'True Negatives',                 info: 'TrueNegatives!',               codename: 'true_negatives',                 type: 'classification'},
      {name: 'True Positives',                 info: 'TruePositives!',               codename: 'true_positives',                 type: 'classification'},
    ];

    static readonly WEIGHT_INITIALIZERS: Hyperparameter[] = [
      {name: 'Constant',          info: 'Constant!',        codename: 'Constant'},
      {name: 'Glorot Normal',     info: 'GlorotNormal!',    codename: 'GlorotNormal'},
      {name: 'Glorot Uniform',    info: 'GlorotUniform!',   codename: 'GlorotUniform'},
      {name: 'HeNormal',          info: 'HeNormal!',        codename: 'HeNormal'},
      {name: 'HeUniform',         info: 'HeUniform!',       codename: 'HeUniform'},
      {name: 'Identity',          info: 'Identity!',        codename: 'Identity'},
      {name: 'Lecun Normal',      info: 'LecunNormal!',     codename: 'LecunNormal'},
      {name: 'Lecun Uniform',     info: 'LecunUniform!',    codename: 'LecunUniform'},
      {name: 'Ones',              info: 'Ones!',            codename: 'Ones'},
      {name: 'Orthogonal',        info: 'Orthogonal!',      codename: 'Orthogonal'},
      {name: 'Random Normal',     info: 'RandomNormal!',    codename: 'RandomNormal'},
      {name: 'Random Uniform',    info: 'RandomUniform!',   codename: 'RandomUniform'},
      {name: 'Truncated Normall', info: 'TruncatedNormal!', codename: 'TruncatedNormal'},
      {name: 'Zeros',             info: 'Zeros!',           codename: 'Zeros'},
    ];
}

export class Column {
  name: string;
  encoder: string;
  // type: string;

  constructor(name: string, encoder: string) {
    this.name = name;
    this.encoder = encoder;
  }
}