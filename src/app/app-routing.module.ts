import { BoardChatComponent } from './components/page/chatbox/board-chat.component';
import {RegisterComponent } from './components/page/register/register.component';
import { VerifyEmailComponent } from './components/page/verifyEmail/verify-email.component';
import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  LoginComponent } from './components/page/login/login.component';
import { HomeComponent } from './components/page/home/home.component';
import { CreateBoardComponent } from './components/page/board/create-board.component';
import { MyTaskComponent } from './components/page/mytasks/my-tasks.component';
import { BoardMarkComponent } from './components/page/bookmarks/bookmarks.component';
import { ReportingComponent } from './components/page/reporting/reporting.component';
import { WorkspaceComponent } from './components/page/board/workspace.component';
import { MyBoardComponent } from './components/page/board/my-board.component';
import { ProfileComponent } from './components/page/profile/profile.component';
import { NotFoundComponent } from './components/page/404/not-found.component';
import { MemberviewComponent } from './components/page/memberView/memberview.component';
import { ArchiveBoardComponent } from './components/page/board/archive-board.component';
import { ForgetPasswordComponent } from './components/page/forgetPassword/forget-password.component';
import { BoardBookmarkComponent } from './components/layout/boardBookmark.component';

import { AuthGuard } from './model/service/guard/auth.guard';
import { CloseTaskComponent } from './components/page/mytasks/close-task.component';
import { TestComponent } from './components/page/test.component';
import { BoardTasksCalendarComponent } from './components/page/board/board-tasks-calendar.component';
import { StageTasksChartComponent } from './components/page/mytasks/stage-tasks-chart.component';



const routes: Routes = [
  {
    path : '',
    redirectTo : '/login',
    pathMatch : 'full'
  },
  {
    path :'home',
    component : HomeComponent,
    canActivate : [ AuthGuard ]
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
    component:ProfileComponent,
    canActivate : [ AuthGuard ]
  },
  {
    path : 'create-board',
    component : CreateBoardComponent,
    canActivate : [ AuthGuard ]
  },
  {
    path : 'my-tasks',
    component : MyTaskComponent,
    canActivate :[ AuthGuard ]
  },
  {
    path : 'bookmarks',
    component : BoardMarkComponent,
    canActivate : [ AuthGuard ]
  },
  {
    path :'reporting',
    component : ReportingComponent,
    canActivate : [ AuthGuard ]
  },
  {
    path : 'boards',
    component : WorkspaceComponent,
    canActivate : [ AuthGuard ]
  },
  {
    path : 'boards/:id',
    component : MyBoardComponent,
    canActivate : [ AuthGuard  ]
  },
  {
    path : 'users/:id/profile',
    component : MemberviewComponent,
    canActivate : [ AuthGuard ]
  },

  {
    path : 'archive-boards',
    component : ArchiveBoardComponent,
    pathMatch : 'full',
    canActivate : [ AuthGuard ]
  },
  {
    path : 'forget-password',
    component : ForgetPasswordComponent,
    pathMatch : 'full'
  },
  {
    path : 'boardBookmark',
    component : BoardBookmarkComponent,
    pathMatch : 'full',
    canActivate : [ AuthGuard ]
  },
  {
    path:"boards/:id/chat",
    component : BoardChatComponent,
    canActivate : [ AuthGuard ]
  },
  {
    path : 'boards/:id/close-task',
    component : CloseTaskComponent,
    pathMatch :'full',
    canActivate : [ AuthGuard ]

  },
  {
    path : 'boards/:id/tasks-calendar',
    component : BoardTasksCalendarComponent,
    pathMatch : 'full',
    canActivate : [ AuthGuard ]
  },
  {
    path : 'boards/:id/tasks-chart',
    component : StageTasksChartComponent,
    pathMatch : 'full',
    canActivate : [ AuthGuard ]
  },
  {
    path : '**',
    component : NotFoundComponent,
    pathMatch : 'full',
    canActivate : [ AuthGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
