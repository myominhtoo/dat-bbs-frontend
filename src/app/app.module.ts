import {  RegisterComponent } from './components/page/register/register.component';
import {  VerifyEmailComponent } from './components/page/verifyEmail/verify-email.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './components/layout/layout.module';
import { LoginComponent } from './components/page/login/login.component';
import { VerifypassComponent } from './components/page/verifyEmail/verifypass.component';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/page/home/home.component';
import { CreateBoardComponent } from './components/page/board/create-board.component';
import { MyTaskComponent } from './components/page/mytasks/my-tasks.component';
import { BoardMarkComponent } from './components/page/bookmarks/bookmarks.component';
import { NotificationsComponent } from './components/page/notifications/notifications.component';
import { ReportingComponent } from './components/page/reporting/reporting.component';
import { MyBoardsComponent } from './components/page/board/my-boards.component';
import { BoardComponent } from './components/page/board/board.component';

@NgModule({
  declarations: [
    AppComponent,
    VerifyEmailComponent,
    VerifypassComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    CreateBoardComponent,
    MyTaskComponent,
    BoardMarkComponent,
    NotificationsComponent,
    ReportingComponent,
    MyBoardsComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
