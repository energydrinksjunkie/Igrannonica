import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TodolistComponent } from './todolist/todolist.component';
import { ShowListComponent } from './todolist/show-list/show-list.component';
import { AddEditListComponent } from './todolist/add-edit-list/add-edit-list.component';

import { ListApiService } from './list-api.service';
@NgModule({
  declarations: [
    AppComponent,
    TodolistComponent,
    ShowListComponent,
    AddEditListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ListApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
