import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { OnInit } from '@angular/core';

@Component({
    selector : 'test',
    template : `
        <h1>Hello I am test</h1>
        <full-calendar [options]="calendarOptions" ></full-calendar>
    `
})
export class TestComponent implements OnInit {

    calendarOptions : CalendarOptions = {
        initialView : 'dayGridMonth',
        headerToolbar: {
            right : 'prev,next',
            center: 'title',
            left : ''
        },
        selectable : true,
        weekends : true,
        events : [
            { title : 'To sleep'  , start : '2022-11-01' , end : '2022-11-20' },
            { title : 'To eat'  , start : '2022-11-05' , end : '2022-11-20' }
        ]
    }

    ngOnInit(){
        console.log(this.calendarOptions.events)
    }

}