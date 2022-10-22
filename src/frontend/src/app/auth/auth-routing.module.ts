import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { EmailVerifComponent } from './components/email-verif/email-verif.component';
import { CancelRegistrationComponent } from './components/cancel-registration/cancel-registration.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  { path: 'register', component: RegisterComponent, canActivate:[AuthGuard]},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'verifyEmail', component:EmailVerifComponent},
  { path: 'cancelRegistration', component:CancelRegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
