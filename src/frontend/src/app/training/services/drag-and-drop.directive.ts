import { Directive,EventEmitter,Output,HostListener, HostBinding, } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

  @Output() fileDropped = new EventEmitter<any>();

  // Dragover Event
  @HostListener('dragover', ['$event']) dragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();

  }
  // Dragleave Event
  @HostListener('dragleave', ['$event']) public dragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Drop Event
  @HostListener('drop', ['$event']) public drop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files.length > 0) 
    {
      var file = files[0];
      var fileName = file.name;
      var fileExtension = fileName.split('.').pop(); 

      if (fileExtension == "csv") 
      {
        this.fileDropped.emit(file);
      }
    }
  }

}
