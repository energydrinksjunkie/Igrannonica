import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TrainingModule } from './training/training.module';
import { DatasetsModule } from './datasets/datasets.module';

import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailVerifComponent } from './auth/components/email-verif/email-verif.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxNumberSpinnerModule } from 'ngx-number-spinner';
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgChartsModule } from 'ng2-charts';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    AdminPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AuthModule,
    TrainingModule,
    DatasetsModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    NgxNumberSpinnerModule,
    MatSelectModule,
    BrowserAnimationsModule,
    NgxSliderModule,
    NgxMatSelectSearchModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
