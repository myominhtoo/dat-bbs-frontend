import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "src/app/app-routing.module";
import { BoardComponent } from "./board.component";
import { NavbarComponent } from "./navbar.component";
import { SidebarComponent } from "./sidebar.component";

@NgModule({
    declarations : [
        NavbarComponent,
        SidebarComponent,
        BoardComponent
    ],
    imports : [
        BrowserModule,
        AppRoutingModule,        
    ],
    exports : [
        NavbarComponent,
        SidebarComponent,
        BoardComponent
    ]
})
export class LayoutModule{}