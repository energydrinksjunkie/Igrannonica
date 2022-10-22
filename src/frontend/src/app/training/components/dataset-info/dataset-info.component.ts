import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dataset-info',
  templateUrl: './dataset-info.component.html',
  styleUrls: ['./dataset-info.component.css']
})
export class DatasetInfoComponent implements OnInit {

  @Input() filenameFromParent: string | undefined  = '';
  @Output() changeNameEvent = new EventEmitter<string>();
  @Output() changeDescriptionEvent = new EventEmitter<string>();

  fileName?:string;

  constructor() { }

  ngOnInit(): void {
  }


  changeName(event:any)
  {
    this.changeNameEvent.emit(event.value);
  }

  changeDescription(event:any)
  {
    this.changeDescriptionEvent.emit(event.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filenameFromParent'] 
    && changes['filenameFromParent']?.previousValue != changes['filenameFromParent']?.currentValue) {
        let text = this.filenameFromParent;
        // remove extension
        text = text!.replace(/\.[^/.]+$/, '');

        // capitalize first letter
        text = text.charAt(0).toUpperCase() + text.slice(1);

        this.fileName = text;
        
    }
  }
}
