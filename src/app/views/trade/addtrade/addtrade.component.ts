import { Component, OnInit, NgModule, VERSION, AfterViewInit} from '@angular/core';
import { IMyDpOptions, IMyDateModel, IMyDayLabels, IMyMonthLabels, IMyDate, IMyOptions} from 'mydatepicker';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationExtras } from '@angular/router';
import { Response } from '@angular/http';
import { FileSelectDirective, FileDropDirective, FileUploader, FileUploadModule, FileItem} from 'ng2-file-upload';
import { CONFIG } from '../../../config';
import { MatDatepickerModule } from '@angular/material/datepicker';


import { CategoryService } from '../../../services/categories/category.service';
import { SubcategoriesService } from '../../../services/subcategories/subcategories.service';
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { PlacesService } from '../../../services/places/places.service';
import { StatesService } from '../../../services/states/states.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';

import { UserSession, UserIdentity, Authentication, Trade,PostTrade, PageTitle, Category, Subcategory, Image, State, Place, Postcode } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';

let uploadFileUrl = CONFIG.baseUrls.uploadFileUrl;
let imagesPathUrl = CONFIG.baseUrls.imagesPathUrl;

@Component({
  selector: 'app-addtrade',
  templateUrl: './addtrade.component.html',
  styleUrls: ['./addtrade.component.scss']
})

export class AddTradeComponent implements OnInit {

  private selectDate: IMyDate = { year: 0, month: 0, day: 0 };
  private addForm: FormGroup;
  private datePickerOptions: IMyOptions;
  private currentLocale: string = "en";
  private uploader: FileUploader;
  private hasBaseDropZoneOver: boolean;
  private hasAnotherDropZoneOver: boolean;

  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private isRequesting: boolean = false;
  private isAuthenticated: boolean = false;

  private isSubmitted: boolean = false; 
  private isMessageVisible: boolean = false;

  private categories: Category[] = [];
  private subcategories: Subcategory[] = [];
  private states: State[] = [];
  private places: Place[] = [];
  private postcodes: Postcode[] = [];
  
  private response: string;
  private hasImages: boolean = false;
  private newTrade = new PostTrade();
  private addedTrade: PostTrade = new PostTrade();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private subcategoriesService: SubcategoriesService,
    private tradeService: TradeApiService,
    private statesService: StatesService,
    private placesService: PlacesService,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) {
   

    this.uploader = new FileUploader({
      maxFileSize: 1024 * 1024,    
      url: uploadFileUrl,         
      allowedMimeType: ['image/png', 'image/gif', 'image/jpeg', 'image/tif', 'image/bmp'],   
    });

    this.uploader.options.allowedFileType = ['png', 'gif', 'jpeg', 'tif', 'bmp'];
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
    this.getStates();    
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


  public getStates() {
    this.statesService.getStates()
      .subscribe((res: State[]) => {
        this.states = res;
      }
      , (error: Response) => this.onError(error, "getStates"));
  }


  public getSubcategoriesByCategoryId(categoryId: number) {    
    let m: number = 0;
    for (m = 0; m < this.categories.length; m++) {
      if (this.categories[m].categoryId == categoryId) {
        this.subcategories = this.categories[m].subcategories;
      }
    }
  }


  public getPlacesByStateId(stateid:number) {  
    let m: number = 0;
    for (m = 0; m < this.states.length; m++) {
      if (this.states[m].id == stateid) {
        this.places = this.states[m].places;
      }
    }   
  }


  public getPostcodeByPlaceId(placeid: number) {
    let m: number = 0;
    for (m = 0; m < this.places.length; m++) {
      if (this.places[m].id == placeid) {
        this.postcodes = this.places[m].postcodes;
      }
    }
  }



  //*****************************************************
  // SCREEN SELECTION 
  //*****************************************************
  private onCategoryChange(item: any) {
    this.getSubcategoriesByCategoryId(item);
  }

  private onStateChange(item: any) {
    this.getPlacesByStateId(item);
  }

  private onPlaceChange(item: any) {
    this.getPostcodeByPlaceId(item);
  }


  //*****************************************************
  // ADD TRADE
  //*****************************************************
  private saveTrade() {

    // remove previous error messages
    this.messagesService.emitRoute("nill");
     
    let dt = new Date();
    let today = new Date(dt.getFullYear(), dt.getMonth(), dt.getDay());
        
    if (this.addForm.dirty && this.addForm.valid) {

      this.isMessageVisible = false;
      this.isRequesting = true;

      this.newTrade = new PostTrade();
      this.newTrade.name = this.addForm.controls.trading.value;
      this.newTrade.description = this.addForm.controls.description.value;
      this.newTrade.tradeFor = this.addForm.controls.tradingfor.value;
      this.newTrade.datePublished = this.addForm.controls.publishDate.value.jsdate;
      // TODO check what is the published date, if today then status will be OPEN
      // is not than should shat"NOT PUBLISHED"
      if (today < this.newTrade.datePublished) { this.newTrade.status = "Not Published"; }
      else { this.newTrade.status = "Open";}
     
      this.newTrade.categoryId = this.addForm.controls.category.value;
      this.newTrade.subcategoryId = this.addForm.controls.subcategory.value;
      this.newTrade.placeId = this.addForm.controls.place.value;
      this.newTrade.stateId = this.addForm.controls.state.value;       
      this.newTrade.postcodeId = this.addForm.controls.postcode.value;
      this.newTrade.traderId = this.identity.userId;

      // set the image array here, the imageid and real url will be created 
      // on the web api side when the tradeId is taken
      if (this.uploader.queue.length > 0) {
        let image = new Image();
        let m: number = 0;

        for (m = 0; m < this.uploader.queue.length; m++) {
          image.imageTitle = this.uploader.queue[0].file.name;
          image.imageUrl = imagesPathUrl;
          this.newTrade.Images.push(image);
        }     
      }
      this.AddTrade(this.newTrade);     
    }
  }


 // calling the service
  public AddTrade(passedTrade: PostTrade) {
      let trades: PostTrade[] = [];

      this.tradeService.AddTrade(passedTrade)
        .subscribe(trade => this.onAddTradeSuccess(trade)
            , (error: Response) => this.onError(error, "addTrade"));
  }


  // on success to the following
  private onAddTradeSuccess(trade: PostTrade) {

    this.addedTrade = trade;
    let m: number = 0;
    if (this.uploader.queue.length > 0) {
      for (m = 0; m < this.uploader.queue.length; m++) {
        this.uploader.queue[m].file.name = trade.Images[m].imageTitle;        
        this.uploadSingleFile(this.uploader.queue[m]);
      }
    
      // is no point of changing of isRequested as we go to another page here
      this.isSubmitted = true;     
      this.router.navigate(['/tradedetails'], { queryParams: { id: trade.tradeId, flagnew: true }});          
    }      
  }


  // upload each file- maybe we should go with mutliple
  private uploadSingleFile(item: any) {
    item.withCredentials = false;
    // we are making the name unique even if the file is the same and does exist on the server upload side
    item.upload();
  }


  // when files selected change the status
  private onChange(event: any) {
    let m: number = 0;
    let fileItems: FileItem[] = this.uploader.queue;
    for (m = 0; m < fileItems.length; m++) {
      fileItems[m].isReady = true;
      this.hasImages = true;
    }
  }


  private fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }


  private fileOverAnother(e: any) {
    this.hasAnotherDropZoneOver = e;
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
    this.pageTitleService.emitPageTitle(new PageTitle("Post Trade"));
    this.messagesService.emitRoute("nill");   
    this.isRequesting = false;
  }


  private setupForm() {
   
     this.addForm = this.formBuilder.group({   
       trading: new FormControl('', [Validators.required, ValidationService.tradeNameValidator]),
       description: new FormControl('', [Validators.required, ValidationService.tradeDescriptionValidator]),          
       category: new FormControl('', [Validators.required, ValidationService.categoryValidator]),
       subcategory: new FormControl('', [Validators.required, ValidationService.subcategoryValidator]),    
       state: new FormControl('', [Validators.required, ValidationService.stateValidator]),
       place: new FormControl('', [Validators.required, ValidationService.placeValidator]),
       postcode: new FormControl('', [Validators.required, ValidationService.postcodeValidator]),
       tradingfor: new FormControl('', [Validators.required, ValidationService.tradeForValidator]),  
       publishDate: new FormControl('', [Validators.required, ValidationService.publishDateValidator]),
    });

    this.currentLocale = 'eu';
    this.datePickerOptions = {
          dateFormat: 'dd/mm/yyyy',
          firstDayOfWeek: 'mo',
          selectorWidth: 'auto',
          width: 'auto',
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
      publishDate: { date: { year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate() } }
    });

    this.selectDate = {
      year: date.getFullYear(),
      month: date.getMonth(),
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



  //****************************************************
  // LOGGING METHODS
  //****************************************************
  private onError(serviceError: any, operation: string) {

    this.isRequesting = false;

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