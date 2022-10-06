import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "src/app/app-routing.module";
import { NavbarComponent } from "./navbar.component";
import { SidebarComponent } from "./sidebar.component";

@NgModule({
    declarations : [
        NavbarComponent,
        SidebarComponent
    ],
    imports : [
        BrowserModule,
        AppRoutingModule
    ],
    exports : [
        NavbarComponent,
        SidebarComponent
    ]
})
export class LayoutModule{}