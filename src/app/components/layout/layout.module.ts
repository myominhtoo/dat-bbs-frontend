import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
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

@NgModule({
    declarations : [
        NavbarComponent,
        SidebarComponent,
        BoardComponent,
        LoadingComponent,
        TaskCardContainerComponent,
        TaskCardComponent,
        TaskOffCanvasComponent,
        PentaDatePipe
    ],
    imports : [
        BrowserModule,
        AppRoutingModule,  
        DragDropModule,
        FormsModule,
        HttpClientModule,
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