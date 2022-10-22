import { Injectable } from '@angular/core';
import { HeaderDict } from '../models/table_models';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {

  constructor() { }

  getDataHeader(data : Array<any>) : Array<HeaderDict>{
    
    var tempHeader;
    var newHeader = new Array<HeaderDict>();
    if (data)
    {
      for(let i=0; i<data.length; i++)
      {
        tempHeader = Object.getOwnPropertyNames(data[i]);
        if (tempHeader.length > 0) newHeader.push(new HeaderDict(i,tempHeader[0], data[i][tempHeader[0]]));
      }
    }
    
    return newHeader;
  }

  getInfoStatsHeader(data: any)
  {
    let newHeader = new Array<HeaderDict>();
    
    if (data)
    {
      let tempHeader = Object.getOwnPropertyNames(data[0]);
      
      for(let i=0; i < tempHeader.length; i++)
        newHeader.push( new HeaderDict(i, tempHeader[i]) );
    }

    return newHeader;
  }

  getStatIndicatorHeader(data: {index:Array<any>, columns:Array<any>, data:Array<any>})
  {
    let newHeader = new Array<HeaderDict>();
    let columns;

    if (data)
    {
      columns = data.columns;
      if (!columns || !columns.length) 
        return newHeader; 
    
      newHeader.push(new HeaderDict(0, 'Column name'));

      for (let i=0; i< columns.length; i++)
      {
        newHeader.push(new HeaderDict(i+1, columns[i]));
      }
    }

    return newHeader;
  }

}
