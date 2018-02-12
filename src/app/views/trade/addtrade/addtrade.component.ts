import { Component, OnInit, NgModule, VERSION, AfterViewInit} from '@angular/core';
import { IMyDpOptions, IMyDateModel, IMyDayLabels, IMyMonthLabels, IMyDate, IMyOptions} from 'mydatepicker';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Response } from '@angular/http';
import { FileSelectDirective, FileDropDirective, FileUploader, FileUploadModule, FileItem} from 'ng2-file-upload';
import { CONFIG } from '../../../config';

import { CategoryService } from '../../../services/categories/category.service';
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
import { UserSession, UserIdentity, Authentication, Trade,PostTrade, PageTitle, Category, Image } from '../../../helpers/classes';


let uploadsUrl = CONFIG.baseUrls.uploads;
let uploadsAttachUrl = CONFIG.baseUrls.uploadsattach;
let uploadPhysical = CONFIG.baseUrls.uploadsphysical;

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
  private newTrade = new PostTrade();

  private isSubmitted: boolean = false; 
  private isVisible: boolean = false;
  private isMessageVisible: boolean = false;
  private isFileAllowed: boolean = true;
  private fileErrorMessage: string = "";

  private categories: Category[] = [];
  private uploader: FileUploader;  
  private hasBaseDropZoneOver: boolean;
  private hasAnotherDropZoneOver: boolean;
  private response: string;
  private allowedMimeType: string[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private tradeService: TradeApiService,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) {
   

    this.uploader = new FileUploader({
      maxFileSize: 1024 * 1024,    
      url: uploadsUrl,         
      allowedMimeType: ['image/png', 'image/gif', 'image/jpeg', 'image/tif', 'image/psd', 'image/png', 'image/bmp'],     
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,    
      formatDataFunction: async (item) => {
        return new Promise((resolve, reject) => {
          resolve({
                  name: item._file.name,
                  length: item._file.size,
                  contentType: item._file.type,
                  date: new Date()
            });
        });
      }
    });
    this.uploader.options.allowedFileType = ['png', 'gif', 'jpeg', 'tif', 'psd', 'png', 'bmp'];
    this.uploader.options.queueLimit = 3;
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe(res => this.response = res);

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
      }
      , (error: Response) => this.onError(error, "getCategories"));
  }


  //*****************************************************
  // ADD TRADE
  //*****************************************************
  public AddTrade(passedTrade: PostTrade) {

      this.tradeService.AddTrade(passedTrade)
        .subscribe((res: Trade) => { this.onAddSuccess(res); }
        , (error: Response) => this.onError(error, "Login"));
  }

  private fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  private fileOverAnother(e: any) {
    this.hasAnotherDropZoneOver = e;
  }

  private onChange(event: any) {    
    let m:number = 0; 
    let fileItems: FileItem[] = this.uploader.queue;
    for (m = 0; m < fileItems.length; m++) {
      fileItems[m].isReady = true;
    }  
  }

  // called when remove file button is clicked
  private removeFile(item: any) {
    this.isMessageVisible = false;
    item.remove();

  }

  // called when remove all files button is clicked
  private removeAllFiles() {
    this.isMessageVisible = false;
    this.uploader.clearQueue();
  }

  private saveTrade() {

    if (this.addForm.dirty && this.addForm.valid) {

      this.isMessageVisible = false;
      this.isRequesting = true;

      this.newTrade = new PostTrade();
      this.newTrade.name = this.addForm.controls.trading.value;
      this.newTrade.description = this.addForm.controls.description.value;
      this.newTrade.categoryId = this.addForm.controls.category.value;
      this.newTrade.tradeFor = this.addForm.controls.tradingfor.value;
      this.newTrade.datePublished = this.addForm.controls.publishDate.value.jsdate;
      this.newTrade.status = "Open";
      this.newTrade.traderId = this.identity.userId;

      // upload files if any and get result first
      if (this.uploader.queue.length > 0) {
        this.uploader.queue.forEach(x => this.uploadSingleFile(x))
      }
      this.AddTrade(this.newTrade);   
    }   
  }

  private uploadSingleFile(item: any) {

    let originalFileName: string = item.file.name;
    item.withCredentials = false;
    // we are making the name unique evenif the file is the same 
    // and does exist on the server upload side
    item.file.name = item.file.name;
    item.upload();

    // set the image array here
    // the imageid and real url will be created 
    // on the web api side when the tradeId is taken
    let image = new Image();
    image.imageTitle = item.file.name;
    image.imageUrl = uploadPhysical;   
    this.newTrade.Images.push(image);
  }

 
  //*****************************************************
  // HELPER METHODS
  //*****************************************************
  private getUseridentity() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.isAuthenticated = this.session.authentication.isAuthenticated;
        this.identity = this.session.userIdentity;
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
    this.isFileAllowed = false;
    this.isRequesting = false;
  }

  private setupForm() {
   
     this.addForm = this.formBuilder.group({   
          trading: new FormControl('', [Validators.required]),
          description: new FormControl('', [Validators.required]),
          tradingfor: new FormControl('', [Validators.required]),
          category: new FormControl('', [Validators.required]),
          publishDate: new FormControl('', [Validators.required]),
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
    let trades: Trade[] = [];
    trades.push(trade);
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