import {RegisterComponent } from './components/page/register/register.component';
import { VerifyEmailComponent } from './components/page/verifyEmail/verify-email.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  LoginComponent } from './components/page/login/login.component';
import { HomeComponent } from './components/page/home/home.component';
import { CreateBoardComponent } from './components/page/board/create-board.component';
import { MyTaskComponent } from './components/page/mytasks/my-tasks.component';
import { BoardMarkComponent } from './components/page/bookmarks/bookmarks.component';
import { NotificationsComponent } from './components/page/notifications/notifications.component';
import { ReportingComponent } from './components/page/reporting/reporting.component';
import { WorkspaceComponent } from './components/page/board/workspace.component';
import { MyBoardComponent } from './components/page/board/my-board.component';
import { CreateTaskCardComponent } from './components/page/mytasks/create-taskCard.component';
import { ProfileComponent } from './components/page/profile/profile.component';
import { NotFoundComponent } from './components/page/404/not-found.component';
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
    path:'profile' , 
    component:ProfileComponent
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
    path : 'boards',
    component : WorkspaceComponent
  },
  {
    path : 'boards/:id',
    component : MyBoardComponent,
  },
  {
    path : 'create-taskCard',
    component : CreateTaskCardComponent
  },
  {
    path : '**',
    component : NotFoundComponent,
    pathMatch : 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
