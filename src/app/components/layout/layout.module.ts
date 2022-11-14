import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { FormsModule  } from "@angular/forms";
import { HttpClientModule  } from "@angular/common/http";
import { AppRoutingModule } from "src/app/app-routing.module";
import { BoardComponent } from "./board.component";
import { LoadingComponent } from "./loading.component";
import { NavbarComponent } from "./navbar.component";
import { SidebarComponent } from "./sidebar.component";
import { TaskCardContainerComponent } from "./task-card-container.component";
import { TaskCardComponent } from "./task-card.component";
import { TaskOffCanvasComponent } from "./task-offcanvas.component";
import { PentaDatePipe } from "src/app/model/pipe/penta-date.pipe";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { Notifications } from "./notifications.component";
import { NotiComponent } from "./noti.component";

@NgModule({
    declarations : [
        NavbarComponent,
        SidebarComponent,
        BoardComponent,
        LoadingComponent,
        TaskCardContainerComponent,
        TaskCardComponent,
        TaskOffCanvasComponent,
        Notifications,
        PentaDatePipe,
        NotiComponent
    ],
    imports : [
        BrowserModule,
        AppRoutingModule,  
        DragDropModule,
        FormsModule,
        HttpClientModule,
        PickerModule,
        MatProgressBarModule
    ],
    exports : [
        NavbarComponent,
        SidebarComponent,
        BoardComponent,
        LoadingComponent,
        TaskCardContainerComponent,
        TaskCardComponent,
        TaskOffCanvasComponent,
        PentaDatePipe
    ]
})
export class LayoutModule{}