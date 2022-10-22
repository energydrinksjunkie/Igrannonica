import sys
import uvicorn
import logging
from fastapi import FastAPI

import config
from routers import dataprep_router, datastat_router, traning_router

#################################################################

description = """
Mikroservis za Artifical Neural Network playground web platformu

## Data Preparation

TODO

## Training

TODO
"""

tags_metadata = [
    {
        "name": "users",
        "description": "Operations with users. The **login** logic is also here.",
    }
]

app = FastAPI(#__name__, 
    title="ANN mikroservice",
    description=description
    )

#################################################################
# Routers

app.include_router(dataprep_router.router)
app.include_router(datastat_router.router)
app.include_router(traning_router.router)

#################################################################

if __name__ == "__main__":   
    if len(sys.argv) > 1 and sys.argv[1] == 'dev':
        uvicorn.run("ann_server:app", host=config.HOST_NAME, port=config.SERVER_PORT, reload=True, workers=4, debug=True)  
    else:
        logging.basicConfig(stream=sys.stdout, level=logging.NOTSET)

