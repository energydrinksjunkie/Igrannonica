import json
from fastapi import HTTPException
import numpy as np
import pandas as pd

from pydantic import AnyHttpUrl
from typing import List
from starlette.datastructures import UploadFile

from models import models
from models.models import FillMethod, ModifiedData, ColumnFillMethodPair
from services.shared_service import log

#################################################################

QUOTE_NONNUMERIC = 2

#################################################################

def parse_dataset(
    dataset_source, 
    delimiter=None, 
    lineterminator=None, 
    quotechar='"', 
    escapechar=None, 
    encoding=None
    ):
    
    df = None
    
    is_url = isinstance(dataset_source, AnyHttpUrl)
    is_file = isinstance(dataset_source, UploadFile)

    # assume datasource is a link
    fname = dataset_source

    if is_file:
        fname = dataset_source.filename

    fname = fname.lower()

    if( fname.endswith('.csv') ):
        log("Given dataset appears to be .csv file")

        if is_file:
            dataset_source = dataset_source.file

        df = pd.read_csv(
            dataset_source, 
            delimiter        = delimiter, 
            lineterminator   = lineterminator, 
            quotechar        = quotechar,
            escapechar       = escapechar, 
            encoding         = encoding,
            index_col        = None, 
            on_bad_lines     = 'warn',
            skipinitialspace = True
            )
            
        colTypesList = get_column_types(df)

        #df = df.fillna(np.NaN) # TODO proveriti
        df = df.replace(np.nan, None)

        log('Parsing completed.')

    return df, colTypesList

# # #

def get_basic_info(df):
    missingValuesEntireDF = int(df.isnull().sum().sum()) #df.value_counts()["NaN"]
    nrows, ncols = df.shape

    return { "row count" : nrows, "column count" : ncols, "missing values count" : missingValuesEntireDF }

# # #

def get_missing_values_for_each_column(df):
    missing = {}
    for column in df.columns:
        missing[column] = int(df[column].isna().sum())
    
    return missing

# # #

def get_column_types(df):
    return [ {name : str(dtype) } for name, dtype in df.dtypes.iteritems() ]

# # #

def modify_dataset(dataset, modified_data:ModifiedData):
    data = dataset['parsedDataset']
    types = dataset['columnTypes']
    data['index_names'] = [None]
    data['column_names'] = [None]
    
    df = pd.DataFrame.from_dict(data, orient='tight')

    try:
        for editRow in modified_data.edited:
            dtype = next(iter(types[editRow.col].values()))
            if (editRow.value == ""):
                df.iloc[editRow.row, editRow.col] = np.nan
            elif (dtype == "int64"):
                df.iloc[editRow.row, editRow.col] = int(editRow.value)
            elif (dtype == "float64"):
                df.iloc[editRow.row, editRow.col] = float(editRow.value)
            else:
                df.iloc[editRow.row, editRow.col] = editRow.value
            
        df.drop(modified_data.deletedRows, inplace=True)
        df.drop(df.columns[modified_data.deletedCols],axis=1,inplace=True)

    except:
        raise HTTPException(status_code=400, detail="Error on modifying data")
    

    dataset['parsedDataset'] = json.loads(df.to_json(orient="split"))  # TODO proveriti da li moze da se odradi jednostavnije
    dataset['basicInfo'] = get_basic_info(df)
    dataset['missingValues'] = get_missing_values_for_each_column(df)

    return dataset

# # #

def fill_missing(
    dataset,
    column_fill_method_pairs : List[ColumnFillMethodPair]
    ):

    data = dataset['parsedDataset']
    data['index_names'] = [None]
    data['column_names'] = [None]
    
    df = pd.DataFrame.from_dict(data, orient='tight')

    for column_fill_method in column_fill_method_pairs:
        
        column_name = column_fill_method.column_name
        fill_method = column_fill_method.fill_method

        # Skip columns with 0 missing values
        if df[column_name].isnull().sum() == 0:
            continue
       
        fill_value = None

        if fill_method == FillMethod.Mean:
            fill_value = df[column_name].mean()
            pass
        elif fill_method == FillMethod.Median:
            fill_value = df[column_name].median()
            pass
        elif fill_method == FillMethod.MostFrequent:
            fill_value = df[column_name].mode().iloc[0]
            pass
        elif fill_method == FillMethod.FillWithConstantNum:
            if 'float' in str(df[column_name].dtype):
                fill_value = column_fill_method.num_value
            else:
                fill_value = int(column_fill_method.num_value)
            pass
        elif fill_method == FillMethod.FillWithConstantStr:
            fill_value = column_fill_method.str_value
            pass
        else:
            raise HTTPException(status_code=400, detail=f"Unknown fill method for handling missing value: {fill_method}")

        df[column_name].fillna(fill_value, inplace = True)
            
    dataset['parsedDataset'] = json.loads(df.to_json(orient="split"))  # TODO proveriti da li moze da se odradi jednostavnije   
    dataset['basicInfo'] = get_basic_info(df)
    dataset['missingValues'] = get_missing_values_for_each_column(df)

    return dataset    
            