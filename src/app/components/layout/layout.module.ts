import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DragDropModule } from '@angular/cdk/drag-drop'
import { AppRoutingModule } from "src/app/app-routing.module";
import { BoardComponent } from "./board.component";
import { LoadingComponent } from "./loading.component";
import { NavbarComponent } from "./navbar.component";
import { SidebarComponent } from "./sidebar.component";
import { TaskCardContainerComponent } from "./task-card-container.component";
import { TaskCardComponent } from "./task-card.component";

@NgModule({
    declarations : [
        NavbarComponent,
        SidebarComponent,
        BoardComponent,
        LoadingComponent,
        TaskCardContainerComponent,
        TaskCardComponent
    ],
    imports : [
        BrowserModule,
        AppRoutingModule,  
        DragDropModule
    ],
    exports : [
        NavbarComponent,
        SidebarComponent,
        BoardComponent,
        LoadingComponent,
        TaskCardContainerComponent,
        TaskCardComponent
    ]
})
export class LayoutModule{}