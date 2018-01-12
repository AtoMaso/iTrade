import { Component, OnInit, NgModule, VERSION, AfterViewInit} from '@angular/core';
import { IMyDpOptions, IMyDateModel, IMyDayLabels, IMyMonthLabels, IMyDate, IMyOptions} from 'mydatepicker';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})


export class TradeComponent implements OnInit {

  private selectDate: IMyDate = { year: 0, month: 0, day: 0 };
  public myForm: FormGroup;
  public datePickerOptions: IMyOptions;
  public currentLocale: string;


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.myForm = this.formBuilder.group({
      // Empty string or null means no initial value. Can be also specific date
      myDate: [null, Validators.required]
      // other controls are here...
    });


    this.currentLocale = 'en';
    this.datePickerOptions = {    
      dateFormat: 'dd/mm/yyyy',
      firstDayOfWeek: 'mo',        
      selectorWidth: '300px',
      width: '300px',
      minYear: 1900,
      maxYear: 2100, 
      editableDateField: false,
      
    };

    this.setDate();

  }

  setDate(): void {
    // Set today date using the patchValue function
    let date = new Date();
    this.myForm.patchValue({
      myDate: { date: {year: date.getFullYear(),  month: date.getMonth() + 1, day: date.getDate() } }
    });

    this.selectDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    } 

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
