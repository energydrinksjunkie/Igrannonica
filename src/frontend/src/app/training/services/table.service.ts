import { Injectable } from '@angular/core';
import { CellValueChangedEvent, ColumnApi, GridApi } from 'ag-grid-community';
import { HeaderDict } from '../models/table_models';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() { }

  onCellValueChanged(gridApi: GridApi, params:CellValueChangedEvent, data:any, headers:HeaderDict[])
  {
    var colId = parseInt(params.column.getColId());
    var rowId = params.rowIndex!;
    var newValue = params.newValue;

    if(headers[colId].type == "int64" || headers[colId].type == "float64")
    {
      if (newValue == "") //uneo je praznu vrednost
      {
        data[headers[colId].name] = undefined;
        gridApi.applyTransaction({ update: [data] });

        return null;
      }
      if (isNaN(parseInt(newValue))) //postavio string za int ili float, ponistavanje izmene
      {

        data[headers[colId].name] = params.oldValue;
        gridApi.applyTransaction({ update: [data] });

        return;

      }
      if (headers[colId].type == "float64")
      {
        newValue = parseFloat(newValue);
        data[headers[colId].name] = newValue;
        gridApi.applyTransaction({ update: [data] });
      } 
      if (headers[colId].type == "int64") 
      {
        if (parseFloat(newValue)%1 != 0)  //postavio float za int
        {
          newValue = Math.round(parseFloat(newValue)); //postavi zaokruzenu vrednost
          data[headers[colId].name] = newValue;
          
          gridApi.applyTransaction({ update: [data] });
        }
        else
        {
          newValue = parseInt(newValue);
          data[headers[colId].name] = newValue;
          gridApi.applyTransaction({ update: [data] });
        } 

      }
    }
    
    return newValue;
  }
  
  resetVisibility(columnApi: ColumnApi, colIds : string[])
  {
    if(columnApi)
      columnApi.setColumnsVisible(colIds,true);
  }

}
