export class Check {
  id: number;
  visible: boolean;

  constructor(id: number, visible: boolean) {
    this.id = id;
    this.visible = visible;
  }
}

export class HeaderDict {
  key: number;
  name: string;
  type?: string;

  constructor(key: number, name: string, type: string = "") {
    this.key = key;
    this.name = name;
    this.type = type;
  }
}

export class ChosenColumn{
  name:string;
  type:string;
  encoding:string;
  missing?:string;
  missingConstant?:string;

  constructor(name: string, type: string, encoding:string = "None", missing:string ="None", missingConstant:string = "") {
    this.name = name;
    this.type = type;
    this.encoding = encoding;
    this.missing = missing;
    this.missingConstant = missingConstant;
  }
}

export class EditedCell {

  row: number;
  col: number;
  value: string;

  constructor(row: number, col: number, value: string) {
    this.row = row;
    this.col = col;
    this.value = value;
  }
}

export class ModifiedData {
  edited: EditedCell[];
  deletedRows: number[];
  deletedCols:number[];

  constructor(edited: EditedCell[], deletedRows: number[],deletedCols:number[]) {
    this.edited = edited;
    this.deletedRows = deletedRows;
    this.deletedCols = deletedCols;
  }
}

export class Stats{
  categorical:{index:string[],columns:string[], data:any[]};
  continuous:{index:string[],columns:string[], data:any[]};

  constructor(categorical:{index:string[],columns:string[], data:any[]}, continuous: {index:string[],columns:string[], data:any[]}) {
    this.categorical = categorical;
    this.continuous = continuous;
  }
}

export class UndoData{
  type:undoType;
  data:any;

  constructor(type:undoType, data:any)
  {
    this.type = type;
    this.data = data;
  }
}

export enum undoType{
  EDIT,
  DELETE
}

export enum TableIndicator {
  PREVIEW,
  DATA_MANIPULATION,
  INFO,
  STATS,
  OTHER
}