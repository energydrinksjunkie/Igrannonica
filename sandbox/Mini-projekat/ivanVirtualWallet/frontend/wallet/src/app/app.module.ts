import {HttpClientModule} from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { ShowCardComponent } from './card/show-card/show-card.component';
import { CardApiService } from './card-api.service';
import { AddCardComponent } from './card/add-card/add-card.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    ShowCardComponent,
    AddCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CardApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
