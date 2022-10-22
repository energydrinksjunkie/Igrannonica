import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CancelRegistrationComponent } from './auth/components/cancel-registration/cancel-registration.component';
import { EmailVerifComponent } from './auth/components/email-verif/email-verif.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { AuthGuard, AuthGuardAdmin } from './core/guards/auth.guard';
import { DashboardGuard } from './core/guards/dashboard.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CatalogComponent } from './datasets/components/catalog/catalog.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TrainingViewComponent } from './training/_training-view/training-view.component';

const routes: Routes = [
  { path: '', redirectTo:'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate:[AuthGuard]},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'verifyEmail', component:EmailVerifComponent},
  { path: 'cancelRegistration', component:CancelRegistrationComponent},
  { path: 'admin-panel', component:AdminPanelComponent, canActivate:[AuthGuardAdmin] },
  { path: 'datasets', component:CatalogComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'training', component: TrainingViewComponent, canActivate: [DashboardGuard] },
  { path: 'not-found', component: PageNotFoundComponent},
  { path: '**', redirectTo:'not-found'}
  
  // Kostur da ako bude bilo potrebe postavimo lazy-loading
  /*
  {
    path: 'datasets',
    loadChildren: () => import('./datasets/datasets.module').then(m => m.DatasetsModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'trening',
    loadChildren: () => import('./training/training.module').then(m => m.TrainingModule)
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
