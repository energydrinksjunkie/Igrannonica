from fastapi import APIRouter, UploadFile, File, Body
from typing import List, Optional
from pydantic import AnyHttpUrl

from models.models import ModifiedData, ColumnFillMethodPair
from services.shared_service import read_json_data
from services.dataprep_service import get_missing_values_for_each_column, parse_dataset, get_column_types, get_basic_info, modify_dataset, fill_missing

#################################################################

router = APIRouter(prefix="/data-preparation")

#################################################################

@router.get("/parse")
async def get_parsed_dataset(
    dataset_source : AnyHttpUrl,
    delimiter      : Optional[str] = None,
    lineterminator : Optional[str] = None,
    quotechar      : Optional[str] = None,
    escapechar     : Optional[str] = None,
    encoding       : Optional[str] = None,
    ):
    '''
    Parsira dataset koji se nalazi na prosleđenom linku **dataset_source**. 

    '''

    df, column_types   = parse_dataset(
        dataset_source,
        delimiter = delimiter, 
        lineterminator = lineterminator, 
        quotechar = '"' if quotechar == None else quotechar, 
        escapechar = escapechar, 
        encoding = encoding 
        )

    parsed_dataset = df.to_dict('split')
    basic_info = get_basic_info(df)
    missing_for_each_column = get_missing_values_for_each_column(df)

    return {'parsedDataset' : parsed_dataset, "columnTypes" : column_types, "basicInfo" : basic_info, "missingValues" : missing_for_each_column }

# # #

@router.post("/parse-file")
async def parse_dataset_file(
    dataset_source : UploadFile = File(...),
    delimiter      : Optional[str] = None,
    lineterminator : Optional[str] = None,
    quotechar      : Optional[str] = None,
    escapechar     : Optional[str] = None,
    encoding       : Optional[str] = None,
    ):
    '''
    Parsira dataset **dataset_source** koji je upload-ovan.

    '''
    df, column_types  = parse_dataset(
        dataset_source,
        delimiter = delimiter, 
        lineterminator = lineterminator, 
        quotechar = '"' if quotechar == None else quotechar, 
        escapechar = escapechar, 
        encoding = encoding 
        )

    parsed_dataset = df.to_dict('split')
    basic_info = get_basic_info(df)
    missing_for_each_column = get_missing_values_for_each_column(df)

    return {'parsedDataset' : parsed_dataset, "columnTypes" : column_types, "basicInfo" : basic_info, "missingValues" : missing_for_each_column}

# # #

@router.put("/modify")
async def modify(stored_dataset : str, modified_data : ModifiedData):
    '''
    Na osnovu liste akcija vrsi izmenu vrednosti, brisanje reda ili kolone u prosledjenom fajlu
    '''

    dataset = read_json_data(stored_dataset)
    msg = modify_dataset(dataset, modified_data)

    return msg


# # #

@router.put("/fill-missing")
async def fill_missing_values(
    stored_dataset           : str, 
    column_fill_method_pairs : List[ColumnFillMethodPair] = Body(...)
    ):
    '''
    Popunjava prazna polja u dataset-u koristeci odabrani metod
    '''
    
    dataset = read_json_data(stored_dataset)
    dataset = fill_missing(dataset, column_fill_method_pairs)

    return dataset