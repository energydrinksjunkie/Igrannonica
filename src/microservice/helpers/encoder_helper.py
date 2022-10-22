from enum import Enum
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder
import category_encoders as ce

class CatColEncoder(str, Enum):
    NoEncoder = "None"
    OneHot   = "OneHot"
    Ordinal  = "Ordinal"
    Binary    = "Binary" 
    
    def __repr__(self):
        return self.value

def map_catcolencoder(catcolencoder):   
    catcolencoder_switcher = {
        CatColEncoder.OneHot    : OneHotEncoder(handle_unknown='ignore', sparse=False),
        CatColEncoder.Ordinal   : OrdinalEncoder(),
        CatColEncoder.Binary    : ce.BinaryEncoder()
    }

    try:         
        return catcolencoder_switcher.get(catcolencoder)
    except (KeyError, AttributeError):
        log(f'Key "{catcolencoder}" is not present in catcolencoder_switcher dictionary')
        raise HTTPException(status_code=400, detail=f'Categorical colum encoder "{catcolencoder}" is not supported')