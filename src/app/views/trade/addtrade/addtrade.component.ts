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
import { GeoDataService } from '../../../services/geodata/geodata.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';

import {
  UserSession, UserIdentity, Authentication, Trade, PostTrade, PageTitle, Category,
  Subcategory, Image, GeoData} from '../../../helpers/classes';   // State, Place, Postcode, Suburb
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
  private currentLocale: string = "en";  
  private datePickerOptions: IMyOptions;
  private addForm: FormGroup;
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
  private geostates: GeoData[] = [];    
  private geoplaces: GeoData[] = [];    
  private geopostcodes: GeoData[] = [];    
  private geosuburbs: GeoData[] = [];    
 
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
    private geodataService: GeoDataService,
    private tradeService: TradeApiService,  
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) {
   

    this.uploader = new FileUploader({
      maxFileSize: 1024 * 1024*10,    
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

    this.geodataService.getStates()
      .subscribe((res: GeoData[]) => {
        this.geostates = res;
      }
      , (error: Response) => this.onError(error, "getStates"));
  }


  public getPlacesByStateCode(statecode: string) {

    this.geodataService.getPlacesByStateCode(statecode)
      .subscribe((res: GeoData[]) => {
        this.geoplaces = res;
      }
      , (error: Response) => this.onError(error, "getGeoPlacesByStateCode"));
  }


  public getPostcodesByPlaceNameAndStateCode(placename: string, statecode: string) {

    this.geodataService.getPostcodesByPlaceNameAndStateCode(placename, statecode)
      .subscribe((res: GeoData[]) => {
        this.geopostcodes = res;
      }
      , (error: Response) => this.onError(error, "getGeoPlacesByStateCode"));
  }



  public getSuburbssByPostcodeNumberAndPlaceName(postcodenumber: string, placename: string) {

    this.geodataService.getSuburbssByPostcodeNumberAndPlaceName(postcodenumber, placename)
      .subscribe((res: GeoData[]) => {
        this.geosuburbs = res;
      }
      , (error: Response) => this.onError(error, "getSuburbssByPostcodeNumberAndPlaceName"));
  }

  //*****************************************************
  // SCREEN CHANGE SELECTION 
  //*****************************************************
  private onCategoryChange(category: Category) {        
    this.subcategories = category.subcategories;
  }

  private onStateChange(geodata: GeoData) {  
    this.geoplaces = null;
    this.geosuburbs = null;
    this.geopostcodes = null;
    this.getPlacesByStateCode(geodata.state);

  }

  private onPlaceChange(geodata: GeoData) { 
    this.geopostcodes = null;
    this.geosuburbs = null;
    this.getPostcodesByPlaceNameAndStateCode(geodata.place, geodata.state);

  }

  private onPostcodeChange(geodata: GeoData) {
    this.geosuburbs = null;    
    this.getSuburbssByPostcodeNumberAndPlaceName(geodata.postcode, geodata.place);

  }



  //*****************************************************
  // ADD TRADE
  //*****************************************************
  private saveTrade() {

    // remove previous error messages
    this.messagesService.emitRoute("nill");
     
    let dt = new Date();
    if (this.addForm.dirty && this.addForm.valid) {

      this.isMessageVisible = false;
      this.isRequesting = true;

      this.newTrade = new PostTrade();
      this.newTrade.name = this.addForm.controls.trading.value;
      this.newTrade.description = this.addForm.controls.description.value;
      this.newTrade.tradeFor = this.addForm.controls.tradingfor.value;
      this.newTrade.datePublished = this.addForm.controls.publishDate.value.jsdate;     
       
      if (dt < this.newTrade.datePublished) { this.newTrade.status = "Not Published"; }
      else { this.newTrade.status = "Open";}
     
      this.newTrade.category = this.addForm.controls.category.value.category;
      this.newTrade.subcategory = this.addForm.controls.subcategory.value.subcategory;
      this.newTrade.state = this.addForm.controls.state.value.state;       
      this.newTrade.place = this.addForm.controls.place.value.place;   
      this.newTrade.postcode = this.addForm.controls.postcode.value.postcode;
      this.newTrade.suburb = this.addForm.controls.suburb.value.suburb;
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

      // wait for a while untill the images are uploaded
      this.wait(trade);
     // this.router.navigate(['/tradedetails'], { queryParams: { id: trade.tradeId, flagnew: true }});          
    }      
  }


  // upload each file- maybe we should go with mutliple
  private uploadSingleFile(item: any) {
    item.withCredentials = false;
    // we are making the name unique even if the file is the same and does exist on the server upload side
    item.upload();
  }

  // 
private async wait(trade:PostTrade) {   
    await this.delay(500);         
  this.router.navigate(['/tradedetails'], { queryParams: { id: trade.tradeId, isNewTrade: true } });   
}

private  delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
       trading: new FormControl('', [Validators.required, ValidationService.tradeNameTradeValidator]),
       description: new FormControl('', [Validators.required, ValidationService.tradeDescriptionTradeValidator]),          
       category: new FormControl('', [Validators.required, ValidationService.categoryTradeValidator]),
       subcategory: new FormControl('', [Validators.required, ValidationService.subcategoryTradeValidator]),    
       state: new FormControl('', [Validators.required, ValidationService.stateTradeValidator]),
       place: new FormControl('', [Validators.required, ValidationService.placeTradeValidator]),
       postcode: new FormControl('', [Validators.required, ValidationService.postcodeTradeValidator]),
       suburb: new FormControl('', [Validators.required, ValidationService.suburbTradeValidator]),
       tradingfor: new FormControl('', [Validators.required, ValidationService.tradeForTradeValidator]),  
       publishDate: new FormControl('', [Validators.required, ValidationService.publishDateTradeValidator]),
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
    else if (serviceError.error !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error.Message); }
    else { this.messagesService.emitProcessMessage("PMEUEO"); } // unexpected error

  }

}