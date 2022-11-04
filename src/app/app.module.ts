import {  RegisterComponent } from './components/page/register/register.component';
import {  VerifyEmailComponent } from './components/page/verifyEmail/verify-email.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
import { WorkspaceComponent } from './components/page/board/workspace.component';
import { MyBoardComponent } from './components/page/board/my-board.component';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  MatButtonModule } from '@angular/material/button';
import { CreateTaskCardComponent } from './components/page/mytasks/create-taskCard.component';
import { ProfileComponent } from './components/page/profile/profile.component';
import { NotFoundComponent } from './components/page/404/not-found.component';
import { MemberviewComponent } from './components/page/memberView/memberview.component';

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
    WorkspaceComponent,
    MyBoardComponent,
    CreateTaskCardComponent,
    ProfileComponent,
    NotFoundComponent,
    MemberviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    BrowserAnimationsModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
