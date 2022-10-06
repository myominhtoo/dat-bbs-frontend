import { Component } from  "@angular/core";

@Component({
    selector : 'navbar',
    template : `
         <header class="sticky-top w-100 bg-pale-dark d-flex px-5 align-items-center justify-content-around gap-1" id="header">
            <div id="header-left" class="gap-2 align-items-center px-2 w-25 d-flex justify-content-start gap-3">
                <i class="fa-solid fa-bars pale-snow" id="menu-icon" style="font-size:20px;transform: translateX(-100%);"></i>
                <img src="/assets/icon.png" style="width:65px;" alt="icon">
            </div>
    
            <div id="header-center" class="gap-2 text-center px-2 w-50">
                <i class="fa-solid fa-magnifying-glass" id="search-icon"></i>
                <input type="search" id="search" placeholder="Search" />
            </div>
    
            <div id="header-right" class="gap-2 px-2 w-25 d-flex justify-content-end gap-2">
                <div class="bg-thm" id="profile">
    
                </div>
            </div>
        </header>
    `
})
export class NavbarComponent{

}