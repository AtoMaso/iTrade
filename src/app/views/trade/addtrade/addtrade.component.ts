import { Component, OnInit, NgModule, VERSION, AfterViewInit} from '@angular/core';
import { IMyDpOptions, IMyDateModel, IMyDayLabels, IMyMonthLabels, IMyDate, IMyOptions} from 'mydatepicker';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
import {UserSession, UserIdentity, Authentication, Trade, PageTitle } from '../../../helpers/classes';

@Component({
  selector: 'app-addtrade',
  templateUrl: './addtrade.component.html',
  styleUrls: ['./addtrade.component.scss']
})
export class AddTradeComponent implements OnInit {

  private selectDate: IMyDate = { year: 0, month: 0, day: 0 };
  public myForm: FormGroup;
  public datePickerOptions: IMyOptions;
  public currentLocale: string;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) {
  };

  ngOnInit() {

    this.setupPage();
    this.setupForm();

  }

  private setupPage() {
    this.pageTitleService.emitPageTitle(new PageTitle("Add Trade"));
    this.messagesService.emitRoute("nill");
  }

  private setDate(): void {
    // Set today date using the patchValue function
    let date = new Date();
    this.myForm.patchValue({
      myDate: { date: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } }
    });

    this.selectDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  }

  private setupForm() {

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

  private onDateChanged(event: IMyDateModel) {
    // Update value of selDate variable
    this.selectDate = event.date;
  }

  private clearDate(): void {
    // Clear the date using the patchValue function
    this.myForm.patchValue({ myDate: null });
  }

}
