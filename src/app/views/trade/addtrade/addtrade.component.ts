import { Component, OnInit, NgModule, VERSION, AfterViewInit} from '@angular/core';
import { IMyDpOptions, IMyDateModel, IMyDayLabels, IMyMonthLabels, IMyDate, IMyOptions} from 'mydatepicker';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { CategoryService } from '../../../services/categories/category.service';
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
import { UserSession, UserIdentity, Authentication, Trade, PageTitle, Category } from '../../../helpers/classes';

@Component({
  selector: 'app-addtrade',
  templateUrl: './addtrade.component.html',
  styleUrls: ['./addtrade.component.scss']
})
export class AddTradeComponent implements OnInit {

  private selectDate: IMyDate = { year: 0, month: 0, day: 0 };
  public addForm: FormGroup;
  public datePickerOptions: IMyOptions;
  public currentLocale: string;

  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private isRequesting: boolean = false;
  private isAuthenticated: boolean = false;

  private newTrade = new Trade();


  private categories: Category[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private tradeService: TradeApiService,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) {
  };

  ngOnInit() {
    this.getUseridentity();
    this.initialiseComponent();
    this.setupForm();

    this.getCategories();
  }



  //*****************************************************
  // GET CATEGORIES
  //*****************************************************
  public getCategories() {
    this.categoryService.getCategories()
      .subscribe((res: Category[]) => {
        this.categories = res;
      })
      , (error: Response) => this.onError(error, "Register"));
  }



  //*****************************************************
  // ADD TRADE
  //*****************************************************
  public AddTrade() {

    this.newTrade = new Trade();
    this.newTrade.tradeObjectDescription = this.addForm.controls.trading.value;  
    this.newTrade.datePublished = this.addForm.controls.publishDate.value;  

    if (this.addForm.dirty && this.addForm.valid) {
      this.tradeService.AddTrade(this.newTrade)
        .subscribe((res:Trade) => this.onAddSuccess(res))
        , (error: Response) => this.onError(error, "Login"));
    }  

  }


  //*****************************************************
  // HELPER METHODS
  //*****************************************************
  private getUseridentity() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.isAuthenticated = this.session.authentication.isAuthenticated;
        this.identity.roles = this.session.userIdentity.roles;
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }

  private initialiseComponent() {
    this.pageTitleService.emitPageTitle(new PageTitle("Add Trade"));
    this.messagesService.emitRoute("nill");
  }

  private setupForm() {
   
     this.addForm = this.formBuilder.group({   
          trading: new FormControl('', [Validators.required]),
          description: new FormControl('', [Validators.required]),
          tradingfor: new FormControl('', [Validators.required]),
          category: new FormControl('', [Validators.required]),
          publishDate: new FormControl('', [Validators.required])
    });

    this.currentLocale = 'en';
    this.datePickerOptions = {
          dateFormat: 'dd/mm/yyyy',
          firstDayOfWeek: 'mo',
          selectorWidth: '300px',
          width: '300px',
          minYear: 1900,
          maxYear: 2100,
          editableDateField: false
    };

    this.setDate();

  }

  private setDate(): void {
    // Set today date using the patchValue function
    let date = new Date();
    this.addForm.patchValue({
      publishDate: { date: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } }
    });

    this.selectDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  }

  private onDateChanged(event: IMyDateModel) {
    // Update value of selDate variable
    this.selectDate = event.date;
  }

  private clearDate(): void {
    // Clear the date using the patchValue function
    this.addForm.patchValue({ publishDate: null });
  }

  private onAddSuccess(trade: Trade) {
    //TODO trade has been added to the system
  }



  //****************************************************
  // LOGGING METHODS
  //****************************************************
  private onError(serviceError: any, operation: string) {
    let message: string = "";

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

    // PME used to pass the message 
    if (serviceError.error === undefined) {

      var data = serviceError.json();

      if (data.ModelState !== undefined) {

        for (var key in data.ModelState) {
          for (var i = 0; i < data.ModelState[key].length; i++) {

            if (message == null) { message = data.ModelState[key][i]; }
            else { message = message + data.ModelState[key][i]; }

          }
        }
      }
      this.messagesService.emitProcessMessage("PME", message);
    }
    else if (serviceError.error.ModelState !== undefined) { this.messagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }
    else if (serviceError.error !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error); }
    else { this.messagesService.emitProcessMessage("PMEUEO"); } // unexpected error

  }
}