import { Component } from '@angular/core';

@Component({
  selector: 'task-card-container',
  template: `
    <div class="task-card-container mx-2 d-inline-block rounded-1 ">
      <!-- start task-card-header -->
      <div class="w-100 bg-transparent task-card-header p-2">
        <div class="d-flex justify-content-between">
          <!-- task-card-title -->
          <div class="text-justify">
            <h5 class="stage-title h5 text-muted m-0 fw-bold">To do</h5>
          </div>
          <!-- task-card-title -->
          <!-- task-card-icon -->
          <div class="d-flex justify-content-between align-items-center">
            <div class="stage-icon">
              <i class="fas fa-solid fa-plus"></i>
            </div>
            <div class="stage-icon">
              <i class="fas fa-solid fa-ellipsis"></i>
            </div>
          </div>
          <!-- task-card-icon -->
        </div>
      </div>
      <!-- end task-card-header -->
      <div class="container-fluid task-card-scroll ">
        <div class="w-100  d-flex flex-column">
          <div
            class="task-cards my-1  px-2 py-3"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasWithBothOptions"
          >
            <h5 class="h6 text-muted">Task Card</h5>

            <div
              class="offcanvas offcanvas-end"
              data-bs-scroll="true"
              tabindex="-1"
              id="offcanvasWithBothOptions"
            >
              <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">
                  Backdrop with scrolling
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div class="offcanvas-body">
                <p>
                  Try scrolling the rest of the page to see this option in
                  action.
                </p>
              </div>
            </div>
          </div>

          <div class="task-cards my-1  px-2 py-3 text-muted">
            <h5 class="text-muted h6">Task Card</h5>
          </div>

        </div>
      </div>
    </div>
  `,
})
export class TaskCardContainerComponent {}
