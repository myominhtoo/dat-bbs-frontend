import { Register } from './components/page/register/register.component';
import { VerifyEmail } from './components/page/verifyEmail/verify-email.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/page/login/login.component';

const routes: Routes = [
  {path:'verify-email',component:VerifyEmail},
  {path:'register',component:Register},
  {path:'login',component:Login},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
