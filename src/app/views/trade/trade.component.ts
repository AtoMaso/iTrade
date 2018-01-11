import { Component, OnInit } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';


@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})


export class TradeComponent implements OnInit {

  constructor() {
    this.date = new Date();
  }

  date: Date;

  options: DatepickerOptions = {
   
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    firstCalendarDay: 1, // 0 - Sunday, 1 - Monday
    locale: enLocale,
    minDate: new Date(Date.now()), // Minimal selectable date
    maxDate: new Date(Date.now())  // Maximal selectable date
  };


  ngOnInit() {
  }

}
