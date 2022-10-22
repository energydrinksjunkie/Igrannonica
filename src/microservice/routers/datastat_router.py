import pandas as pd
from fastapi import APIRouter
from pydantic import AnyUrl, AnyHttpUrl

from services.datastat_service import get_corr_matrix, get_stat_indicators
from services.shared_service import read_json_data, log


#################################################################

router = APIRouter(prefix="/dataset")

#################################################################

@router.get("/stat-indicators")
async def get_statistical_indicators(stored_dataset : str):
    dataset = read_json_data(stored_dataset)['parsedDataset']
    dataset['index_names'] = [None]
    dataset['column_names'] = [None]
    df = pd.DataFrame.from_dict(dataset, orient='tight')

    return get_stat_indicators(df)

# # #

@router.get("/corr-matrix")
async def get_correlation_matrix(stored_dataset : str):
    dataset = read_json_data(stored_dataset)['parsedDataset']
    dataset['index_names'] = [None]
    dataset['column_names'] = [None]
    df = pd.DataFrame.from_dict(dataset, orient='tight')

    return get_corr_matrix(df)
    