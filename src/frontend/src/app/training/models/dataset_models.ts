export class Dataset
{
    public:boolean;
    userID:number;
    description:string;
    name:string;
    datasetSource:string;
 
    constructor(is_public:boolean, userID:number, description:string,name:string,datasetSource:string = "")
    {
        this.public = is_public;
        this.userID = userID;
        this.description = description;
        this.name = name;
        this.datasetSource = datasetSource;
    }
}

export class ColumnFillMethodPair
{
    column_name: string;
    fill_method: string;
    str_value:  string;
    num_value:  number;
 
    constructor(column_name: string, fill_method: string, str_value:  string, num_value:  number)
    {
        this.column_name = column_name;
        this.fill_method = fill_method;
        this.str_value = str_value;
        this.num_value = num_value;
    }
}

