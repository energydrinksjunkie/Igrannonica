import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {LogsComponent} from './logs/logs.component';

const routes: Routes = [
  {path:"logs",component:LogsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
