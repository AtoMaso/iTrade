import { Component, OnInit } from '@angular/core';
import * as enLocale from 'date-fns/locale/en';
import { Observable } from 'rxjs/Observable';
import { IMyDpOptions, IMyDateModel, IMyDayLabels, IMyMonthLabels, IMyDate} from 'mydatepicker';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

interface WriteModel {
  firstName: string;
  startDate: IMyDate;
}


@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})


export class TradeComponent implements OnInit {

  //public months: IMyMonthLabels =  { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };
  //public days: IMyDayLabels = { su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu', fr: 'Fri', sa: 'Sat' };
  private selectDate: IMyDate = { year: 0, month: 0, day: 0 };
  public myForm: FormGroup;
  public myDatePickerOptions: IMyDpOptions;
  public currentLocale: string;
  //public startDateValue$: Observable<any>;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.myForm = this.formBuilder.group({
      // Empty string or null means no initial value. Can be also specific date
      myDate: [null, Validators.required]
      // other controls are here...
    });


    this.currentLocale = 'en';

    this.myDatePickerOptions = {
    
      dateFormat: 'dd/mm/yyyy',
      firstDayOfWeek: 'mo',        
      selectorWidth: '300px',
      width: '300px',
      minYear: 1900,
      maxYear: 2100
    };


    this.setDate();

  }

  setDate(): void {
    // Set today date using the patchValue function
    let date = new Date();
    this.myForm.patchValue({
      myDate: { date: {year: date.getFullYear(),  month: date.getMonth() + 1, day: date.getDate() } }
    });

  }




  onDateChanged(event: IMyDateModel) {
    // Update value of selDate variable
    this.selectDate = event.date;
  }



  clearDate(): void {
    // Clear the date using the patchValue function
    this.myForm.patchValue({ myDate: null });
  }

}
