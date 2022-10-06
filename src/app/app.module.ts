import { Register } from './components/page/register/register.component';
import { VerifyEmail } from './components/page/verifyEmail/verify-email.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './components/layout/layout.module';
import { Login } from './components/page/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    VerifyEmail,
    Register,
    Login
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
