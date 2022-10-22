import { Component, OnInit } from '@angular/core';
import { DatasetService } from 'src/app/training/services/dataset.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  constructor(private datasetService:DatasetService) {}

  ngOnInit(): void {
    this.datasetService.getpublicDatasets().subscribe(this.publicDatasetsObserver);
    console.log(this.datasetService);
  }

  publicDatasets:any[]=[];

  publicDatasetsObserver:any = {
    next: (response:any) => { 
      console.log("### next@publicDatasetsObserver");
      console.log(response);
      this.publicDatasets=response;
    },
    error: (err: Error) => {
      console.log("### error@uploadObserver");
      console.log(err);
    }
  };


}
