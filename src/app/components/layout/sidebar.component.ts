import { Component } from "@angular/core";

@Component({
    selector : 'sidebar',
    template : `
        <nav id="sidebar" class="p-0 m-0">
                <p class="h6 py-2 px-2 m-3" id="create-btn"><i class="fa-solid fa-plus mx-1"></i>Create</p>
                <ul class="w-100 p-0 m-0 snow">
                    <p class="item"><i class="fa-solid fa-house mx-2"></i>Home</p>
                    <p class="item"><i class="fa-solid fa-bars-progress mx-2"></i>My Tasks</p>
                    <p class="item"><i class="fa-solid fa-bookmark mx-2"></i>Bookmarks</p>
                    <p class="item"><i class="fa-solid fa-bell mx-2"></i>Notifications</p>
                    <p class="item"><i class="fa-solid fa-chart-line mx-2"></i>Reporting</p>
                </ul>
        </nav>

    `
})
export class SidebarComponent {}