import {RegisterComponent } from './components/page/register/register.component';
import { VerifyEmailComponent } from './components/page/verifyEmail/verify-email.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  LoginComponent } from './components/page/login/login.component';
import { HomeComponent } from './components/page/home/home.component';
import { CreateBoardComponent } from './components/page/board/create-board.component';
import { MyTaskComponent } from './components/page/mytasks/my-tasks.componet';
import { BoardMarkComponent } from './components/page/bookmarks/bookmarks.component';
import { NotificationsComponent } from './components/page/notifications/notifications.component';
import { ReportingComponent } from './components/page/reporting/reporting.component';
import { MyBoardsComponent } from './components/page/board/my-boards.component';
import { BoardComponent } from './components/page/board/board.component';

const routes: Routes = [
  {
    path : '',
    redirectTo : '/login',
    pathMatch : 'full'
  },
  {
    path :'home',
    component : HomeComponent
  },
  {
    path : 'verify-email',
    component : VerifyEmailComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'login' , 
    component:LoginComponent
  },
  {
    path : 'create-board',
    component : CreateBoardComponent
  },
  {
    path : 'my-tasks',
    component : MyTaskComponent
  },
  {
    path : 'bookmarks',
    component : BoardMarkComponent
  },
  {
    path : 'notifications',
    component : NotificationsComponent
  },
  {
    path :'reporting',
    component : ReportingComponent
  },
  {
    path : 'my-boards',
    component : MyBoardsComponent
  },
  {
    path : 'boards/:id',
    component : BoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
