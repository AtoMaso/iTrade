import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, FormsModule } from '@angular/forms';

// services
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { CategoryService } from '../../../services/categories/category.service';
import { GeoDataService } from '../../../services/geodata/geodata.service';
import { PersonalDetailsService } from '../../../services/personaldetails/personaldetails.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
//import { CapsPipe } from '../../../helpers/pipes';
import { UserSession, UserIdentity, Authentication, Trade, PageTitle, Category, Subcategory, GeoData, PersonalDetails} from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-tradeslist',
  templateUrl: './tradeslist.component.html',
  styleUrls: ['./tradeslist.component.scss']
})
export class TradesListComponent implements OnInit {

  //Mirko
  public session: UserSession;
  public identity: UserIdentity = new UserIdentity;
  public isRequesting: boolean = false;
  public isAuthenticated: boolean = false;
  public isAllowedToAddTrade: boolean = false;
  public status: string = "Open";

  public totalNumberOfRecords: number = 0; 
  public totalNumberOfSets: number = 0;
  public setsCounter: number = 1;
  public recordsPerSet: number = 100;
  public hasTrades: boolean = true;
  public selectedItem: string = "Published";
 
  public categories: Category[] = [];
  public subcategories: Subcategory[] = [];
  public states: GeoData[] = [];
  public places: GeoData[] = [];
  public postcodes: GeoData[] = [];
  public suburbs: GeoData[] = [];

  public selectedCategory: string = null;
  public selectedSubcategory: string = null;
  public selectedState: string = null;
  public selectedPlace: string = null;
  public selectedPostcode: string = null;
  public selectedSuburb: string = null;

  public selectedCategoryId: number = 0;
  public selectedSubcategoryId: number = 0;
  public selectedStateId: number = 0;
  public selectedPlaceId: number = 0;
  public selectedPostcodeId: number = 0;
  public selectedSuburbId: number = 0;

  public tempFilters: string = null;
  public filters: string = null;
  public filters1: string = null;
  public filters2: string = null;
  public isNewLoad: boolean = false;
  public checked: boolean = false;

  public hasPersonal: boolean = false;

  // constructor which injects the services
  constructor(
    private route: ActivatedRoute,
    private tradeApiService: TradeApiService,
    private categoryService: CategoryService,
    private geodataService: GeoDataService,
    private personalService: PersonalDetailsService,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private loggerService: LoggerService) {   
  };


  // implement OnInit to get the initial list of articles
  public ngOnInit() { 
     
    this.getUseridentity();
    this.initialiseComponent();     
  
    this.getCategories();
    this.getStates();   
    this.getSetOfTradesWithStatus(this.setsCounter, this.recordsPerSet, this.status);
    //this.getTradesWithSetFilters();
    if (this.isAuthenticated) { this.getPersonalDetails(this.session.userIdentity.userId); }
  }


  public ngAfterViewInit() {


    jQuery(document).ready(function () {

      // toggling the chevrons up and down    
      jQuery("#filters").on("hide.bs.collapse", function () {
        jQuery(".gliphfil").html(' Filters  <span class="glyphicon glyphicon-chevron-down"></span> ');
      });
      jQuery("#filters").on("show.bs.collapse", function () {
        jQuery(".gliphfil").html('Filters  <span class="glyphicon glyphicon-chevron-up"></span>');
      });

      //TODO find a sulution to stop the scrolling when the viewport is small
      //// scrolling of the filter block
      var element = jQuery('#follow-scroll'), originalY = element.offset().top;

      // Space between element and top of screen (when scrolling)
      var topMargin = 60;

      // Should probably be set in CSS;
      element.css('position', 'relative');

      jQuery(window).on('scroll', function (event) {
          var scrollTop = jQuery(window).scrollTop();

          element.stop(false, false).animate({
            top: scrollTop < originalY ? 0 : scrollTop - originalY + topMargin,
          }, 50);
      });

    }); // end of document function


  }
  public PostTrade() {
    this.router.navigate(["/addtrade"]);
  }

  //*********************************************************************************************
  // GET TRADES - this will get open trades, if there are no any open trades will get all or will show message - no trades
  //*********************************************************************************************
  //gets set of trades 
  public getSetOfTradesWithStatus(setsCounter: number, recordsPerSet: number, status: string) {

    this.tradeApiService.getSetOfTradesWithStatus(setsCounter, recordsPerSet, status)
        .subscribe((returnedTrades: Trade[]) => {      
            if (returnedTrades.length === 0) {
                  this.hasTrades = false;
                  this.isRequesting = false;            
                  if (!this.hasTrades) { this.getSetOfTradesWithStatusClosed(setsCounter, recordsPerSet, "All"); }    // there are no open trades so get the latest closed ones           
            }
            else {
                    this.data = this.TransformData(returnedTrades),
                    this.totalNumberOfRecords = this.data[0].total,
                    this.hasTrades = true;               
                    this.isRequesting = false,
                    this.isNewLoad = true;
                    this.calculateTotalNumberOfSets(),
                    this.onChangeTable(this.config),
                    this.onPageChange(1)
           }              
      }, (serviceError: Response) => this.onError(serviceError, "getSetOfTrades"));
  }


  public getSetOfTradesWithStatusClosed(setsCounter:number, recordsPerSet:number, status: string) {

    this.tradeApiService.getSetOfTradesWithStatus(setsCounter, recordsPerSet, status)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) {
          this.hasTrades = false;
          this.isRequesting = false;
          this.messagesService.emitProcessMessage("PMENTrs");
        }
        else {
             this.data = this.TransformData(returnedTrades),
             this.totalNumberOfRecords = this.data[0].total,
             this.hasTrades = true;
             this.isRequesting = false,
             this.isNewLoad = true;
             this.calculateTotalNumberOfSets(),
             this.onChangeTable(this.config),
             this.onPageChange(1)
        }
      }, (serviceError: Response) => this.onError(serviceError, "getSetOfTradesWithStatusClosed"));

  }


  // get set of trades with set filters
  public getSetOfTradesWithSetFilters() {

    let cat: string = null;
    let subcat: string = null;
    let pla: string = null;
    let sta: string = null;;
    let pc: string = null;
    let sub: string = null;

    if (this.selectedCategory != null) { cat = this.selectedCategory; }
    if (this.selectedSubcategory != null) { subcat = this.selectedSubcategory; }
    if (this.selectedState != null) { sta = this.selectedState; }
    if (this.selectedPlace != null) { pla = this.selectedPlace; }
    if (this.selectedPostcode != null) { pc = this.selectedPostcode; }
    if (this.selectedSuburb != null) { sub = this.selectedSuburb; }

    // get set of records with set filters
    this.tradeApiService.getSetOfTradesWithSetFilters(this.setsCounter, this.recordsPerSet, this.status, cat, subcat, sta, pla, pc, sub)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) {
          this.hasTrades = false;
          this.isRequesting = false;
          this.data = returnedTrades;          // pass zero records  
          this.onChangeTable(this.config),   // show 0 from 0 on the top        
          this.messagesService.emitProcessMessage("PMENTrs");
        }
        else {
          this.messagesService.emitRoute("nill");
          this.data = this.TransformData(returnedTrades),
          this.totalNumberOfRecords = this.data[0].total;
          this.hasTrades = true;       
          this.isRequesting = false,
          this.isNewLoad = true;   
          this.calculateTotalNumberOfSets();
          this.onChangeTable(this.config),
          this.onPageChange(1)
        }
      },
      (res: Response) => this.onError(res, "getSetOfTradesWithSetFilter"));
  }


  // get all trades - not in use
  public getTrades(status: string) {

    this.tradeApiService.getTradesWithStatusOrAll("", status)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) {
          this.hasTrades = false;
          this.isRequesting = false;
          if (!this.hasTrades) { this.getTrades("All"); }     // there are no open trades so get the latest closed ones
          else {
            this.hasTrades = false;
            // if there are no records at all than show the message no trades at all
            this.messagesService.emitProcessMessage("PMENTrs");
          }
        }
        else {
          this.data = this.TransformData(returnedTrades),
            this.totalNumberOfRecords = this.data[0].total;
          this.hasTrades = true;
          this.isRequesting = false;
          this.isNewLoad = true;;
          this.onChangeTable(this.config),
            this.onPageChange(1)
        }
      },
      (res: Response) => this.onError(res, "getTrades"));

  }


  // get trades with set filters  - not in use
  public getTradesWithSetFilters() {
    let cat: string = null;;
    let subcat: string = null;
    let pla: string = null;
    let sta: string = null;;
    let pc: string = null;
    let sub: string = null;

    if (this.selectedCategory != null) { cat = this.selectedCategory; }
    if (this.selectedSubcategory != null) { subcat = this.selectedSubcategory; }
    if (this.selectedState != null) { sta = this.selectedState; }
    if (this.selectedPlace != null) { pla = this.selectedPlace; }
    if (this.selectedPostcode != null) { pc = this.selectedPostcode; }
    if (this.selectedSuburb != null) { sub = this.selectedSuburb; }

    this.tradeApiService.getAllTradesWithSetFilters(cat, subcat, sta, pla, pc, sub)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) {
          this.hasTrades = false;
          this.isRequesting = false;
          this.data = returnedTrades;          // pass zero records  
          this.onChangeTable(this.config),   // show 0 from 0 on the top        
          this.messagesService.emitProcessMessage("PMENTrs");
        }
        else {
          this.messagesService.emitRoute("nill");
          this.data = this.TransformData(returnedTrades),
            this.totalNumberOfRecords = this.data[0].total;
          this.hasTrades = true;
          this.isRequesting = false,
            this.isNewLoad = true;;
          this.onChangeTable(this.config),
            this.onPageChange(1)
        }
      },
      (res: Response) => this.onError(res, "getTradesWithSetFilters"));
  }

  //*****************************************************
  // GET PERSONAL DETAILS
  //*****************************************************
  public getPersonalDetails(traderId) {
    this.isRequesting = true;

    this.personalService.getPersonalDetailsByTraderId(traderId)
      .subscribe((returnedPersonalDetails: PersonalDetails) => {
        this.isRequesting = false;
        if (returnedPersonalDetails.id === 0) { this.hasPersonal = false; }
        else { this.hasPersonal = true; }
      },
      (res: Response) => this.onError(res, "getPersonalDetails"));
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
  // GET STATES
  //*****************************************************
  public getStates() {
    this.geodataService.getStates()
      .subscribe((res: GeoData[]) => {
        this.states = res;
      }
      , (error: Response) => this.onError(error, "getStates"));
  }


  public getPlacesByStateCode(statecode: string) {
    this.geodataService.getPlacesByStateCode(statecode)
      .subscribe((res: GeoData[]) => {
        this.places = res;

      }
      , (error: Response) => this.onError(error, "getGeoPlacesByStateCode"));
  }


  public getPostcodesByPlaceNameAndStateCode(placename: string, statecode:string) {

    this.geodataService.getPostcodesByPlaceNameAndStateCode(placename, statecode)
      .subscribe((res: GeoData[]) => {
        this.postcodes = res;
      }
      , (error: Response) => this.onError(error, "getGeoPlacesByStateCode"));
  }


  public getSuburbsByPostcodeNumberAndPlaceName(postcodenumber: string, placename: string) {
    this.geodataService.getSuburbssByPostcodeNumberAndPlaceName(postcodenumber, placename)
      .subscribe((res: GeoData[]) => {
        this.suburbs = res;
      }
      , (error: Response) => this.onError(error, "getSuburbssByPostcodeNumberAndPlaceName"));
  }

  //*****************************************************
  //CLEANING SCREEN
  //*****************************************************
  public ClearAllFiltersAndGoBack() {
    this.selectedCategory = null;
    this.selectedSubcategory = null;
    this.selectedState = null;
    this.selectedPlace = null;
    this.selectedPostcode = null;
    this.selectedSuburb = null;

    this.categories = null;
    this.subcategories = null;
    this.states = null;
    this.places = null;
    this.postcodes = null;
    this.suburbs = null;

    this.filters = null;
    this.filters1 = null;
    this.filters2 = null;
    this.setupFilterString();

    //this.getTrades("Open");
    this.getSetOfTradesWithStatus(this.setsCounter, this.recordsPerSet, this.status);
    this.getCategories();
    this.getStates();
    this.messagesService.emitRoute("nill");
  }


  //*****************************************************
  //FILTER INPUTS
  //*****************************************************
  public CategoryClicked(event: any) {     
    this.messagesService.emitRoute("nill");

    this.selectedCategory = event.target.value;
    this.selectedSubcategory = null;   
    this.getCategoryId(event.target.value);  
    this.setupFilterString();
  }

  public SubcategoryClicked(event:any) {    
    this.selectedSubcategory = event.target.value;
    this.getSubcategoryId(event.target.value);
    this.setupFilterString();
  }
 
  public StateClicked(event: any) { 
    this.messagesService.emitRoute("nill");

    this.selectedState = event.target.value;
    this.selectedPlace = null;  
    this.selectedPostcode = null;  
    this.selectedSuburb = null;
  
    if (this.selectedState != null) {
      this.getPlacesByStateCode(this.selectedState);
      this.postcodes = null;
      this.suburbs = null;
    }
    else {
      this.selectedState = null;
      this.places = null;
      this.postcodes = null;
      this.suburbs = null;
      this.filters2 = null;
    }
    this.setupFilterString();
  }

  public PlaceClicked(event: any) {   
    this.messagesService.emitRoute("nill");

    this.selectedPlace = event.target.value;    
    this.selectedPostcode = null;    
    this.selectedSuburb = null; 
    if (this.selectedPlace != null) {
      this.getPostcodesByPlaceNameAndStateCode(this.selectedPlace, this.selectedState);   
      this.suburbs = null;
    }
    else {
      this.selectedPlace = null;    
      this.postcodes = null;
      this.suburbs = null;
    }
    this.setupFilterString();
  }

  public PostcodeClicked(event: any) {
    this.messagesService.emitRoute("nill");

    this.selectedPostcode = event.target.value;  
    this.selectedSuburb = null; 

    if (this.selectedPostcode != null) {
      this.getSuburbsByPostcodeNumberAndPlaceName(this.selectedPostcode, this.selectedPlace);    
      this.suburbs = null;
    }
    else {
      this.selectedPostcode = null;
      this.postcodes = null;
      this.suburbs = null;
    }
    this.setupFilterString();
  }

  public SuburbClicked(event: any) {
    this.messagesService.emitRoute("nill");

    this.selectedSuburb = event.target.value;
    if (this.selectedSuburb === null) {
      this.suburbs = null;
    }
    this.setupFilterString();
  }


  //*****************************************************
  //GET THE INPUT IDS
  //*****************************************************
  public getCategoryId(categoryname: string) {
    if (categoryname != "") {
      let m: number = 0;
      for (m = 0; m < this.categories.length; m++) {
        if (this.categories[m].category == categoryname) {
          this.selectedCategoryId = this.categories[m].categoryId;
          this.subcategories = this.categories[m].subcategories;
        }
      }
    }
    else {
      this.selectedCategory = null;
      this.subcategories = null;      
      this.filters1 = null;
    }
  }

  public getSubcategoryId(subcategoryname: string) {
    if (subcategoryname != "") {
      let m: number = 0;
      for (m = 0; m < this.subcategories.length; m++) {
        if (this.subcategories[m].subcategory == subcategoryname) {
          this.selectedSubcategoryId = this.subcategories[m].subcategoryId;
        }
      }
    }
    else {
      this.selectedSubcategory = null;      
    }
  }

 
  //*****************************************************
  //SETUP FILTER STRING
  //*****************************************************
  public setupFilterString() {
   
      if (this.selectedCategory) {     
        this.filters1 = " Category = " + this.selectedCategory;
    }
   
    if (this.selectedSubcategory) {
      if (this.filters1 == null) { this.filters1 = "Category = " + this.selectedCategory + " & Subcategory = " + this.selectedSubcategory; }
      else if (this.filters1.indexOf(this.selectedSubcategory) == -1) { this.filters1 = this.filters1 + " & Subcategory = " + this.selectedSubcategory; }
    }
   
    if (this.selectedState) {    
      this.filters2 = " State = " + this.selectedState;
    }
  
    if (this.selectedPlace) {   
      if (this.filters2 == null) { this.filters2 = "State = " + this.selectedState + " & Place =" + this.selectedPlace; }     
      else if (this.filters2.indexOf(this.selectedPlace) == -1) { this.filters2 = this.filters2 + " & Place = " + this.selectedPlace; }
    }

    if (this.selectedPostcode) {
      if (this.filters2 == null) { this.filters2 = "State = " + this.selectedState + " & Place =" + this.selectedPlace + " & Postcode = " + this.selectedPostcode; }
      else if (this.filters2.indexOf(this.selectedPostcode) == -1 ) { this.filters2 = this.filters2 + " & Postcode = " + this.selectedPostcode; }
    }

    if (this.selectedSuburb) {
      if (this.filters2 == null) { this.filters2 = "State = " + this.selectedState + " & Place =" + this.selectedPlace + " & Postcode = " + this.selectedPostcode + " & Suburb = " + this.selectedSuburb; }
      else { this.filters2 = this.filters2 + " & Suburb = " + this.selectedSuburb; }
    }

    if (this.filters1 && this.filters2) { this.filters = this.filters1 + " & " + this.filters2; }
    else if (this.filters1 && this.filters2 == null) { this.filters = this.filters1; }
    else if (this.filters2 && this.filters1 == null) { this.filters = this.filters2;}
    else { this.filters = null;}

    this.setsCounter = 1;

    if (this.tempFilters == null) { this.tempFilters = this.filters;}
    else {
      this.getSetOfTradesWithStatus(this.setsCounter, this.recordsPerSet, this.status);   
      this.messagesService.emitRoute("nill");
    }
  }


  //*****************************************************
  // HELPER METHODS
  //*****************************************************
  public getUseridentity() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.isAuthenticated = this.session.authentication.isAuthenticated;                  
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  public initialiseComponent() {
    this.messagesService.emitRoute("nill");
    this.isRequesting = true;
    this.pageTitleService.emitPageTitle(new PageTitle("Trades"));
  }


  public TransformData(returnedTrades: Trade[]): Array<any> {

    let counter: number = 1;

    let transformedData = new Array<Trade>();
    returnedTrades.forEach(function (value) {
      counter + counter + 1;    
      let trd = new Trade;    

      if (counter % 5 == 0) { trd.addsflag = true; }
      else { trd.addsflag = false; }

      trd.total = value.total;
      trd.tradeIdStr = value.tradeId.toString();
      trd.tradeId = value.tradeId;
      trd.name = value.name;
      trd.description = value.description;
      trd.datePublished = value.datePublished;
      trd.tradeFor = value.tradeFor;        
      trd.status = value.status;     

    
      trd.place = value.place;
    
      trd.state = value.state;
      trd.postcode = value.postcode;      
      trd.suburb = value.suburb;     
      trd.category = value.category;
      trd.subcategory = value.subcategory;     

      trd.traderId = value.traderId;
      trd.traderFirstName = value.traderFirstName;
      trd.traderMiddleName = value.traderMiddleName;
      trd.traderLastName = value.traderLastName;
      trd.traderFullName = trd.traderFirstName + " " + trd.traderMiddleName + " " + trd.traderLastName;

      //trd.Images = value.Images;   
      transformedData.push(trd);      
    });  
    return transformedData;
  }



  //****************************************************
  // LOGGING METHODS
  //****************************************************
  public onError(serviceError: any, operation: string) {

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


  // an event from the child carousel component saying that encountered an error
  public ChangeIsRequesting(bool) { this.isRequesting = false; }

  /**********************************************/
  //ngx-pagination section
  /***********************************************/
  public isAsc: boolean = true;
  public isTraderAsc:boolean = true;
  public isTradeForAsc:boolean = true;
  public isCategoryAsc:boolean = true;
  public isNameAsc: boolean = true;
  public isDateAsc: boolean = true;
  public isStateAsc: boolean = true;
  public isPlaceAsc: boolean = true;
  public isPlostcodeAsc: boolean = true;
  public isSuburbAsc: boolean = true;

  public sortTrader: string = 'desc';
  public sortTradeFor: string = 'desc';
  public sortCategory: string = 'desc';
  public sortName: string = 'desc';
  public sortDate: string = 'desc';
  public sortState: string = 'desc';
  public sortPlace: string = 'desc';
  public sortPostcode: string = 'desc';
  public sortSuburb: string = 'desc';

  public data: Array<any> = [];     // full data from the server
  public rows: Array<any> = [];      // rows passed to the table
  public maxSize: number = 5;        // number of pages in the navigation
  public numPages: number = 1;     
  
  public isNextButton: boolean = false;
  public isPrevButton: boolean = false;
  public lastPageOfTheCurrentSet: number = 0; 

  public fromNumber: number = 0;
  public toNumber: number = 0;

  public columns: Array<any> =
    [    
      { title: 'Trading', name: 'name', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade name' } },
      { title: 'For', name: 'tradeFor', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade for name' } },
      { title: 'Category', name: 'category', sort: true, filtering: { filterString: '', placeholder: 'Filter by  category' } },
      { title: 'Trader', name: 'traderFullName', sort: true, filtering: { filterString: '', placeholder: 'Filter by trader full name.' } },
      { title: 'Published', name: 'datePublished', sort: true, filtering: { filterString: '', placeholder: 'Filter by date.' } },    
      { title: 'State', name: 'state', sort: true, filtering: { filterString: '', placeholder: 'Filter by state.' } } ,   
      { title: 'Place', name: 'place', sort: true, filtering: { filterString: '', placeholder: 'Filter by place.' } },
      { title: 'Postcode', name: 'postcode', sort: true, filtering: { filterString: '', placeholder: 'Filter by postcode number.' } },
      { title: 'Suburb', name: 'suburb', sort: true, filtering: { filterString: '', placeholder: 'Filter by suburb.' } }         
  ];


  public config: any = {
    id: 'pagination',
    itemsPerPage: 15,
    currentPage: 1,
    totalItems: 0,
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  public calculateTotalNumberOfSets() {
   
    let rem = this.totalNumberOfRecords % this.recordsPerSet;
    let mainpart = ~~(this.totalNumberOfRecords / this.recordsPerSet);

    if (this.totalNumberOfRecords < this.recordsPerSet) { this.totalNumberOfSets = 1; }
    else {
      if (this.totalNumberOfRecords > this.recordsPerSet && rem) { this.totalNumberOfSets = mainpart + 1; }
      else { this.totalNumberOfSets = mainpart; }
    }

  }


  public onPageChange(passedpage: number) {

    this.config.currentPage = passedpage;

    // calculate number of pages
    let rem = this.config.totalItems % this.config.itemsPerPage;
    let mainPart = ~~(this.config.totalItems / this.config.itemsPerPage);

    // calculate the the last oage of the current set
    if (this.config.totalItems < this.config.itemsPerPage) { this.lastPageOfTheCurrentSet = 1; }
    else {
      if (this.config.totalItems > this.config.itemsPerPage && rem) { this.lastPageOfTheCurrentSet = mainPart + 1; }
      else { this.lastPageOfTheCurrentSet = mainPart; }
    }

    // togle the next button visibility
    if (this.lastPageOfTheCurrentSet === this.config.currentPage &&   this.setsCounter < this.totalNumberOfSets) { this.isNextButton = true; }
    else {this.isNextButton = false;}
  
    // toglle the prev button visibility
    if (this.setsCounter > 1) { this.isPrevButton = true; }
    else { this.isPrevButton = false; }

    // records shown on the screen
    // from number
    this.fromNumber =(((this.config.itemsPerPage * (this.config.currentPage-1)+1) + (this.recordsPerSet * (this.setsCounter - 1))));
    if (this.fromNumber >= this.totalNumberOfRecords) { this.fromNumber = this.totalNumberOfRecords; }

    // to number
    this.toNumber = (this.fromNumber + this.config.itemsPerPage - 1);
    if (this.toNumber >= this.totalNumberOfRecords) {
      this.toNumber = this.recordsPerSet * this.setsCounter;
      if (this.recordsPerSet * this.setsCounter > this.totalNumberOfRecords) { this.toNumber = this.totalNumberOfRecords }
    }
    else {
      if (this.toNumber >= this.recordsPerSet * this.setsCounter) { this.toNumber = this.recordsPerSet * this.setsCounter;}
    }
  }


  public nextSetOfRecords() {

    this.messagesService.emitRoute("nill");
    if (this.totalNumberOfSets > this.setsCounter) {

      // increase the set counter
      this.setsCounter = this.setsCounter + 1;

      // get the next set of records
      if (this.filters) { this.getSetOfTradesWithSetFilters(); }
      else { this.getSetOfTradesWithStatus(this.setsCounter, this.recordsPerSet, this.status); }

      // set the current page to 1
      this.config.currentPage = 1;
  
    }
    else { this.messagesService.emitProcessMessage("PME", "There no more sets of records."); }
  }


  public previousSetOfRecords() {

    this.messagesService.emitRoute("nill");

    if (this.setsCounter > 1) {

      // decreasethe set counter
      this.setsCounter = this.setsCounter - 1;

      // get the previous set of records
      if (this.filters) { this.getSetOfTradesWithSetFilters(); }
      else { this.getSetOfTradesWithStatus(this.setsCounter, this.recordsPerSet, this.status); }

      // set the current page to 1
      this.config.currentPage = 1;
    }
    else { this.messagesService.emitProcessMessage("PME", "This is the first set of records."); }
  }


  public onChangeTable(config: any, page: any = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.config.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.config.sorting, config.sorting);
    }

    if (!this.isNewLoad) {
      let filteredData = this.changeFilter(this.data, this.config);
      let sortedData = this.changeSort(filteredData, this.config);
      this.rows = sortedData;
      this.config.totalItems = sortedData.length;
    } else {
      this.rows = this.data;
      this.config.totalItems = this.data.length;
      this.isNewLoad = false;
    }
    
  }


  public sortTable(column: string) {
    // reset the array of columns
    this.config.sorting.columns = [];
    switch (column) {
      case 'name':
        this.selectedItem = "Name";
        this.config.sorting.columns = [{ name: 'name', sort: this.sortName }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isNameAsc;
        this.isNameAsc = !this.isAsc;
        this.sortName = this.isNameAsc ? 'desc' : 'asc';
        break;

      case 'tradeFor':
        this.selectedItem = "Trade For";
        this.config.sorting.columns = [{ name: 'tradeFor', sort: this.sortTradeFor }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isTradeForAsc;
        this.isTradeForAsc = !this.isTradeForAsc;
        this.sortTradeFor = this.isTradeForAsc ? 'desc' : 'asc';
        break;

      case 'category':
        this.selectedItem = "Category";
        this.config.sorting.columns = [{ name: 'category', sort: this.sortCategory }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isCategoryAsc;
        this.isCategoryAsc = !this.isCategoryAsc;
        this.sortCategory = this.isCategoryAsc ? 'desc' : 'asc';
        break;

      case 'traderFullName':
        this.selectedItem = "Trader";
        this.config.sorting.columns = [{ name: 'traderFullName', sort: this.sortTrader }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isTraderAsc;
        this.isTraderAsc = !this.isTraderAsc;
        this.sortTrader = this.isTraderAsc ? 'desc' : 'asc';
        break;

      case 'datePublished':
        this.selectedItem = "Published";
        this.config.sorting.columns = [{ name: 'datePublished', sort: this.sortDate }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isDateAsc;
        this.isDateAsc = !this.isDateAsc;
        this.sortDate = this.isDateAsc ? 'desc' : 'asc';
        break;

      case 'state':
        this.selectedItem = "State";
        this.config.sorting.columns = [{ name: 'state', sort: this.sortState }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isStateAsc;
        this.isStateAsc = !this.isStateAsc;
        this.sortState = this.isStateAsc ? 'desc' : 'asc';
        break;

      case 'place':
        this.selectedItem = "Place";
        this.config.sorting.columns = [{ name: 'place', sort: this.sortPlace }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isPlaceAsc;
        this.isPlaceAsc = !this.isPlaceAsc;
        this.sortPlace = this.isPlaceAsc ? 'desc' : 'asc';
        break;

      case 'postcode':
        this.selectedItem = "Postcode";
        this.config.sorting.columns = [{ name: 'postcode', sort: this.sortPostcode }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isPlostcodeAsc;
        this.isPlostcodeAsc = !this.isPlostcodeAsc;
        this.sortPostcode = this.isPlostcodeAsc ? 'desc' : 'asc';
        break;

      case 'suburb':
        this.selectedItem = "Suburb";
        this.config.sorting.columns = [{ name: 'suburb', sort: this.sortSuburb }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isSuburbAsc;
        this.isSuburbAsc = !this.isSuburbAsc;
        this.sortSuburb = this.isSuburbAsc ? 'desc' : 'asc';
        break;
      default:
    }
  }


  public changeFilter(data: any, config: any): any {

    let filteredData: Array<any> = data;
    this.columns.forEach((column: any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => { return item[column.name].match(column.filtering.filterString);  });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.config.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
          // find the string in each coloumn
          let flag = false;
          this.columns.forEach((column: any) => {
            if (item[column.name].toString().toLowerCase().match(this.config.filtering.filterString.toLowerCase())) { flag = true; }
          });
          if (flag) { tempArray.push(item); }
    });

    filteredData = tempArray;

    return filteredData;
  }


  public changeSort(data: any, config: any) {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = null;
    let sort: string = null;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort != '') {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }
    if (!columnName) {
      return data;
    }

    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

}

