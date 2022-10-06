import { Register } from './components/page/register/register.component';
import { VerifyEmail } from './components/page/verifyEmail/verify-email.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'verifyemail',component:VerifyEmail},
  {path:'register',component:Register},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
