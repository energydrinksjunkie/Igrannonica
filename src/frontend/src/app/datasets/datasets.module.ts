import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatasetsRoutingModule } from './datasets-routing.module';
import { CatalogComponent } from './components/catalog/catalog.component';


@NgModule({
  declarations: [
    CatalogComponent
  ],
  imports: [
    CommonModule,
    DatasetsRoutingModule
  ],
  exports:[
    CatalogComponent
  ]
})
export class DatasetsModule { }
