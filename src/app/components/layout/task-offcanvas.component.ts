import { Component, Input } from "@angular/core";
import { TaskCard } from "src/app/model/bean/taskCard";

@Component({
    selector : 'task-offcanvas',
    template : `
        <div class='offcanvas offcanvas-end' id='task-offcanvas' >
            <div class="offcanvas-header shadow-sm p-1 px-3">
                <input type="text" class="form-control fs-4 fw-bold w-75 outline-none text-capitalize text-muted py-1"  placeholder="Enter task name"  [value]="task.taskName"/>
                <!-- <button class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#task-offcanvas" ></button> -->
                <div id="comment-btn" class="d-flex justify-content-center gap-3 text-muted align-items-center">
                    <!-- <p class="fa-regular fa-comment text-center text-muted p-0 m-0"></p> -->
                    <span>Activities</span>
                    <span class="d-flex align-items-center">Comments</span>
                </div>
            </div>
            <div class=" offcanvas-body overflow-scroll">
                <div class="container">

                   <ul class="list-group list-unstyled text-muted p-3 gap-4">
                      <li class="list-item d-flex ">
                        <h6 class="h6 w-25 fs-6">Assign To</h6>
                        <div class="w-75">
                           <input type="text" id="input" class="form-control" placeholder="Assign Members"/>
                        </div>
                      </li>
                      <li class="list-item d-flex">
                        <h6 class="h6 w-25 fs-6">Date</h6>
                        <div class="w-75 d-flex gap-2">
                           <div class="w-25">
                                <small>Start Date</small>
                                <input type="date" class="form-control w-100" />
                           </div>
                            <div class="w-25">
                                <small>Due Date</small>
                                <input type="date" class="form-control w-100">
                            </div>
                        </div>
                      </li>
                      <li class="list-item d-flex">
                        <h6 class="h6 w-25 fs-6">Description</h6>
                        <div class="w-75">
                            <textarea id="input" class="form-control" cols="30" rows="5" placeholder="Enter description about task card "></textarea>
                        </div>
                      </li>
                   </ul>

                    <!-- activites -->
                    <div class="list-group d-flex flex-column list-unstyled text-muted p-2 gap-3 my-2">

                        <div class="w-100 position-relative d-flex gap-1 ">
                            <input type="checkbox" name="" id="" />
                            <input id="activity" class="text-muted" value="Hello" />
                            <div class=" position-absolute d-flex gap-2" style="right:30px;top:10px;">
                                <i class="fa-solid fa-eye"></i>
                                <i class="fa-solid fa-calendar-days"></i>
                                <input type="file" id="attachment" class="d-none">
                                <label for="attachment" class="fa-solid fa-paperclip"></label>
                            </div>
                        </div>

                        <div class="w-100 position-relative d-flex gap-1 ">
                            <input type="checkbox" name="" id="" />
                            <input id="activity" class="text-muted" value="Hello" />
                            <div class=" position-absolute d-flex gap-2" style="right:30px;top:10px;">
                                <i class="fa-solid fa-eye"></i>
                                <i class="fa-solid fa-calendar-days"></i>
                                <input type="file" id="attachment" class="d-none">
                                <label for="attachment" class="fa-solid fa-paperclip"></label>
                            </div>
                        </div>

                        <div class="w-100 position-relative d-flex gap-1 ">
                            <input type="checkbox" name="" id="" />
                            <input id="activity" class="text-muted" value="Hello" />
                            <div class=" position-absolute d-flex gap-2" style="right:30px;top:10px;">
                                <i class="fa-solid fa-eye"></i>
                                <i class="fa-solid fa-calendar-days"></i>
                                <input type="file" id="attachment" class="d-none">
                                <label for="attachment" class="fa-solid fa-paperclip"></label>
                            </div>
                        </div>

                        <div class="w-100 position-relative d-flex gap-1 ">
                            <input type="checkbox" name="" id="" />
                            <input id="activity" class="text-muted" value="Hello" />
                            <div class=" position-absolute d-flex gap-2" style="right:30px;top:10px;">
                                <i class="fa-solid fa-eye"></i>
                                <i class="fa-solid fa-calendar-days"></i>
                                <input type="file" id="attachment" class="d-none">
                                <label for="attachment" class="fa-solid fa-paperclip"></label>
                            </div>
                        </div>

                        <div class="w-100 position-relative d-flex gap-1 ">
                            <input type="checkbox" name="" id="" />
                            <input id="activity" class="text-muted" value="Hello" />
                            <div class=" position-absolute d-flex gap-2" style="right:30px;top:10px;">
                                <i class="fa-solid fa-eye"></i>
                                <i class="fa-solid fa-calendar-days"></i>
                                <input type="file" id="attachment" class="d-none">
                                <label for="attachment" class="fa-solid fa-paperclip"></label>
                            </div>
                        </div>

                    </div>

                    <button class="btn btn-sm btn-secondary"><i class="fa-solid fa-plus mx-1"></i>Add Activity</button>
                </div>
            </div>
        </div>
    `
})
export class TaskOffCanvasComponent {
    
    @Input('task') task : TaskCard = new TaskCard();

}