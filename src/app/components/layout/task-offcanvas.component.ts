import { Component } from "@angular/core";

@Component({
    selector : 'task-offcanvas',
    template : `
        <div class='offcanvas offcanvas-end' id='task-offcanvas' >
            <div class="offcanvas-header">
                <h4 class="offcanvas-title">Task</h4>
                <button class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#task-offcanvas" ></button>
            </div>
            <div class="offcanvas-body">

            </div>
        </div>
    `
})
export class TaskOffCanvasComponent{}