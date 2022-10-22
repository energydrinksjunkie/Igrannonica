import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  @Input() title:string;
  @Input() message:string;
  @Input() input:boolean;
  @Input() input_type:string;
  input_value:string = '';
  warning:string = "";
  warningVisibility:string = 'hidden';

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data : {title: string, message:string, input:boolean, input_type?:string} ) // input type - num || str
  {
    this.title = data.title;
    this.message = data.message;
    this.input = data.input;
    if (data.input_type)
      this.input_type = data.input_type;
    else 
      this.input_type = 'any';
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
  onAddClick(){
    if (this.input_value == "")
    {
      this.warning ="Please fill out the field below."
      this.warningVisibility = 'visible';
      setTimeout(() => {
        this.warningVisibility = 'hidden';
      }, 3000);
    }
    else if(this.input_type == 'num' && isNaN(parseFloat(this.input_value)))
    {
      this.warning ="You cannot input categorical value in field for numerical value";
      this.warningVisibility = 'visible';
      setTimeout(() => {
        this.warningVisibility = 'hidden';
      }, 3000);
    }
    else{
      this.dialogRef.close(this.input_value);
    }
  }
}
