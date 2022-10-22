
from enum import Enum
from typing import List
from pydantic import BaseModel

from helpers.activation_func_helper import ActivationFunction
from helpers.weight_init_helper import WeightInitializer
from helpers.encoder_helper import CatColEncoder

#################################################################

class Cell(BaseModel):
    row:int
    col:int
    value:str

# # #

class ModifiedData(BaseModel):
    edited: List[Cell]
    deletedRows: List[int]
    deletedCols: List[int]

# # #

class NNLayer(BaseModel):
    index: int
    units: int
    weight_initializer: WeightInitializer
    activation_function: ActivationFunction

    class Config:  
        use_enum_values = True

# # #

class Column(BaseModel):
    name: str
    encoder: CatColEncoder

    class Config:  
        use_enum_values = True

# # #

class FillMethod(str, Enum):
    NoFillMethod        = "None"
    Mean                = 'mean'
    Median              = 'median'
    MostFrequent        = 'most_freq'
    FillWithConstantNum = 'constant_num'
    FillWithConstantStr = 'constant_str'

    def __repr__(self):
        return self.value

class ColumnFillMethodPair(BaseModel):
    column_name : str
    fill_method : FillMethod
    str_value   : str
    num_value   : float

    class Config:  
        use_enum_values = True

# # #

