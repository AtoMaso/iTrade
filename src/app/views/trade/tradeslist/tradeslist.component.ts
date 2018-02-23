import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';

// services
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { CategoryService } from '../../../services/categories/category.service';
import { StatesService } from '../../../services/states/states.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import { CapsPipe } from '../../../helpers/pipes';
import { UserSession, UserIdentity, Authentication, Trade, PageTitle, Category, Subcategory, State, Place} from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-tradeslist',
  templateUrl: './tradeslist.component.html',
  styleUrls: ['./tradeslist.component.scss']
})
export class TradesListComponent implements OnInit {

  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private isRequesting: boolean = false;
  private isAuthenticated: boolean = false;
  private isAllowedToAddTrade: boolean = false;
  private isOwner: boolean = false;
  private status: string = "Open";

  private totalNumberOfRecords: number = 0;
  private setsCounter: number = 1;
  private recordsPerSet: number = 5;
  private totalNumberOfSets: number = 0;
  private hasTrades: boolean = true;
  private hasNoTrades: boolean = false;
  private hasSets: boolean = false;
  private hasNavigation: boolean = false;

  private selectedItem: string = "Name";
  private displayRecords: number = 0;
  private totalDisplayRecords: number = 0;
  private filters: string = null;
  private categories: Category[] = [];
  private states: State[] = [];

  private categoryClicked: Category = null;
  private subcategoryClicked: Subcategory = null;
  private stateClicked: State = null;
  private placeClicked: Place = null;
  private filters1: string = null;
  private filters2: string = null;

  // constructor which injects the services
  constructor(
    private route: ActivatedRoute,
    private tradeApiService: TradeApiService,
    private categoryService: CategoryService,
    private statesService: StatesService,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private loggerService: LoggerService) {   
  };


  // implement OnInit to get the initial list of articles
  public ngOnInit() { 
     
    this.getUseridentity();
    this.initialiseComponent();   

    //this.getTrades("Open");
    this.getSetOfTrades(this.setsCounter, this.recordsPerSet, this.status);
    this.getCategories();   
    this.getStates();
  
  
  }



  ngAfterViewInit() {

    jQuery(document).ready(function () {
            
      jQuery("#filters").on("hide.bs.collapse", function () {
        jQuery(".gliphfil").html(' Filters  <span class="glyphicon glyphicon-chevron-down"></span> ');
      });
      jQuery("#filters").on("show.bs.collapse", function () {
        jQuery(".gliphfil").html('Filters  <span class="glyphicon glyphicon-chevron-up"></span>');
      });
     
      jQuery("#categories").on("hide.bs.collapse", function () {
        jQuery(".gliphcat").html(' Category  <span class="glyphicon glyphicon-chevron-down"></span> ');
        });
      jQuery("#categories").on("show.bs.collapse", function () {
        jQuery(".gliphcat").html('Category  <span class="glyphicon glyphicon-chevron-up"></span>');
        });

      jQuery("#places").on("hide.bs.collapse", function () {
        jQuery(".gliphpla").html(' Places  <span class="glyphicon glyphicon-chevron-down"></span> ');
      });
      jQuery("#places").on("show.bs.collapse", function () {
        jQuery(".gliphpla").html('Place  <span class="glyphicon glyphicon-chevron-up"></span>');
      });

    });
  }


  //*********************************************************************************************
  // GET TRADES - this will get open trades, if there are no any open trades will get all or will show message - no trades
  //*********************************************************************************************
  // gets all trades
  private getTrades(status: string) {

    this.tradeApiService.getTradesWithStatusOrAll("", status)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) {
              this.hasTrades = false;
              this.isRequesting = false;           
              if (!this.hasTrades && !this.hasNoTrades) { this.getTrades("All"); }     // there are no open trades so get the latest closed ones
              else {
                this.hasTrades = false;
                this.hasNoTrades = true;   // if there are no records at all than show the message no trades at all
                this.messagesService.emitProcessMessage("PMENTrs");
              }
        }  
        else {
            this.data = this.TransformData(returnedTrades),
            this.totalNumberOfRecords = this.data[0].total;            
            this.hasTrades = true;
            this.hasNoTrades = false;
            this.isRequesting = false,           
            this.onChangeTable(this.config),
            this.onPageChange(1)
        }
      },
      (res: Response) => this.onError(res, "getTrades"));

  }


  //gets page of trades 
  private getSetOfTrades(setsCounter: number, recordsPerSet: number, status: string) {

    this.tradeApiService.getSetOfTradesWithStatus(setsCounter, recordsPerSet, status)
        .subscribe((returnedTrades: Trade[]) => {      
            if (returnedTrades.length === 0) {
                  this.hasTrades = false;
                  this.isRequesting = false;            
                   if (!this.hasTrades && !this.hasNoTrades ) { this.getSetOfTrades(setsCounter, recordsPerSet, "All"); }    // there are no open trades so get the latest closed ones
                  else {
                    this.hasTrades = false;
                     this.hasNoTrades = true;  // if there are no records at all than show the message no trades at all
                     this.messagesService.emitProcessMessage("PMENTrs");
                  }
            }
            else {
                    this.data = this.TransformData(returnedTrades),
                    this.totalNumberOfRecords = this.data[0].total,
                    this.hasTrades = true;
                    this.hasNoTrades = false;
                    this.isRequesting = false,
                    this.calculateTotalNumberOfSets(),
                    this.onChangeTable(this.config),
                    this.onPageChange(1)
           }              
      }, (serviceError: Response) => this.onError(serviceError, "getPageOfTrades"));
  }


  // get trades with set filters (category and places)
  private getTradesWithSetFilters() {
    let catid: number = 0
    let subcatid: number = 0
    let plaid: number = 0
    let staid: number = 0;

    if (this.categoryClicked != null) { catid = this.categoryClicked.categoryId; }
    if (this.subcategoryClicked != null) { subcatid = this.subcategoryClicked.subcategoryId; }
    if (this.stateClicked != null) { staid = this.stateClicked.id; }
    if (this.placeClicked != null) { plaid = this.placeClicked.id; }

    this.tradeApiService.getAllTradesWithSetFilters(catid, subcatid, staid ,plaid)
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
          this.hasNoTrades = false;
          this.isRequesting = false,      
          this.onChangeTable(this.config),
          this.onPageChange(1)
        }
      },
      (res: Response) => this.onError(res, "Filter"));
  }


  // get set of trades with set filters (category and places)
  private getSetOfTradesWithSetFilters() {
    let catid: number = 0
    let subcatid: number = 0
    let plaid: number = 0
    let staid: number = 0;

    if (this.categoryClicked != null) { catid = this.categoryClicked.categoryId; }
    if (this.subcategoryClicked != null) { subcatid = this.subcategoryClicked.subcategoryId; }
    if (this.stateClicked != null) { staid = this.stateClicked.id; }
    if (this.placeClicked != null) { plaid = this.placeClicked.id; }

    // get set of records with set filters
    this.tradeApiService.getSetOfTradesWithSetFilters(this.setsCounter, this.recordsPerSet, this.status, catid, subcatid, staid, plaid)
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
          this.hasNoTrades = false;
          this.isRequesting = false,
          this.calculateTotalNumberOfSets();
          this.onChangeTable(this.config),
          this.onPageChange(1)
        }
      },
      (res: Response) => this.onError(res, "Filter"));
  }


  // initialte filtration
  private filtersSet() {
    //this.getTradesWithSetFilters();
    this.getSetOfTradesWithSetFilters();
  }


  private ClearAllFiltersAndGoBack() {
    this.categoryClicked = null;
    this.subcategoryClicked = null;
    this.stateClicked = null;
    this.placeClicked = null;

    this.filters = null;
    this.filters1 = null;
    this.filters2 = null;
    this.setupFilterString();
    //this.getTrades("Open");
    this.getSetOfTrades(this.setsCounter, this.recordsPerSet, this.status);
    this.messagesService.emitRoute("nill");
  }


  private ClearCategories() {
    this.categoryClicked = null;
    this.subcategoryClicked = null;
    this.filters1 = null;
    this.filters = null;
    this.setupFilterString();
  }


  private ClearPlaces() {
    this.placeClicked = null;
    this.stateClicked = null;
    this.filters2 = null;
    this.filters = null;
    this.setupFilterString();
  }

  //*****************************************************
  //FILTER IMPUTS
  //*****************************************************
  private CategoryClicked(category: Category) {
    this.subcategoryClicked = null;
    this.categoryClicked = category;
    this.setupFilterString(); 
  }


  private SubcategoryClicked(subcategory: Subcategory, category:Category) {
    this.subcategoryClicked = subcategory; 
    this.categoryClicked = category;
    this.setupFilterString();
  }


  private StateClicked(state: State) {
    this.placeClicked = null;
    this.stateClicked = state;
    this.setupFilterString();
  }


  private PlaceClicked(place: Place, state: State) {
    this.placeClicked = place;
    this.stateClicked = state;
    this.setupFilterString();
  }


  // sets up the filter string deiplayed on the screen and filters the datasets based on it
  private setupFilterString() {

    if (this.categoryClicked) {
      this.filters1 = " Category = " + this.categoryClicked.categoryDescription;
    }

    if (this.subcategoryClicked) {
      if (this.filters1 == null) { this.filters1 = "Category = " + this.categoryClicked.categoryDescription + " & Subcategory =" + this.subcategoryClicked.subcategoryDescription; }
      else if (this.filters1.indexOf(this.subcategoryClicked.subcategoryDescription) == -1) { this.filters1 = this.filters1 + " & Subcategory = " + this.subcategoryClicked.subcategoryDescription; }
    }

    if (this.stateClicked) {
      this.filters2 = " State = " + this.stateClicked.name;
    }

    if (this.placeClicked) {
      if (this.filters2 == null) { this.filters2 = "State = " + this.stateClicked.name + " & Place =" + this.placeClicked.name; }
      else if (this.filters2.indexOf(this.placeClicked.name) == -1) { this.filters2 = this.filters2 + " & Place = " + this.placeClicked.name; }
    }

    if (this.filters1 && this.filters2) { this.filters = this.filters1 + " & " + this.filters2; }
    if (this.filters1 && this.filters2 == null) { this.filters = this.filters1; }
    if (this.filters2 && this.filters1 == null) { this.filters = this.filters2;
  }
   
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
  // GET CATEGORIES
  //*****************************************************
  public getStates() {
    this.statesService.getStates()
      .subscribe((res: State[]) => {
        this.states = res;
      }
      , (error: Response) => this.onError(error, "getStates"));
  }

 
  //****************************************************
  // ADD TRADE
  //****************************************************
  private addTrade() {
    this.router.navigate(['/addtrade']);
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
    this.messagesService.emitRoute("nill");
    this.isRequesting = true;
    this.pageTitleService.emitPageTitle(new PageTitle("Trades"));
  }


  private TransformData(returnedTrades: Trade[]): Array<any> {

    let transformedData = new Array<Trade>();
    returnedTrades.forEach(function (value) {

      let trd = new Trade;

      trd.total = value.total;
      trd.tradeIdStr = value.tradeId.toString();
      trd.tradeId = value.tradeId;
      trd.name = value.name;
      trd.description = value.description;
      trd.datePublished = value.datePublished;
      trd.tradeFor = value.tradeFor;        
      trd.status = value.status;     

      trd.placeId = value.placeId;
      trd.place = value.place;
      trd.stateId = value.stateId;
      trd.state = value.state;
      trd.categoryId = value.categoryId;
      trd.categoryDescription = value.categoryDescription;
      trd.subcategoryId = value.subcategoryId;
      trd.subcategoryDescription = value.subcategoryDescription;

      trd.traderId = value.traderId;
      trd.traderFirstName = value.traderFirstName;
      trd.traderMiddleName = value.traderMiddleName;
      trd.traderLastName = value.traderLastName;
      trd.traderFullName = trd.traderFirstName + " " + trd.traderMiddleName + " " + trd.traderLastName;

      trd.Images = value.Images;

      transformedData.push(trd);      
    });  
    return transformedData;
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


  /**********************************************/
  //ngx-pagination section
  /***********************************************/
  private isAsc: boolean = true;
  private isTraderAsc:boolean = true;
  private isTradeForAsc:boolean = true;
  private isCategoryAsc:boolean = true;
  private isNameAsc: boolean = true;
  private isDateAsc: boolean = true;
  private isPlaceAsc: boolean = true;
  private isStateAsc: boolean = true;

  private sortTrader: string = 'desc';
  private sortTradeFor: string = 'desc';
  private sortCategory: string = 'desc';
  private sortName: string = 'desc';
  private sortDate: string = 'desc';
  private sortPlace: string = 'desc';
  private sortState: string = 'desc';

  private data: Array<any> = [];     // full data from the server
  public rows: Array<any> = [];      // rows passed to the table
  public maxSize: number = 5;
  public numPages: number = 1;
  
  private isNextButton: boolean = false;
  private isPrevButton: boolean = false;
  private lastPageOfTheCurrentSet: number = 0; 

  private fromNumber: number = 0;
  private toNumber: number = 0;

  public columns: Array<any> =
    [    
      { title: 'Trading', name: 'name', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade name' } },
      { title: 'For', name: 'tradeFor', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade for name' } },
      { title: 'Category', name: 'categoryDescription', sort: true, filtering: { filterString: '', placeholder: 'Filter by  category' } },
      { title: 'Trader', name: 'traderFullName', sort: true, filtering: { filterString: '', placeholder: 'Filter by trader full name.' } },
      { title: 'Published', name: 'datePublished', sort: true, filtering: { filterString: '', placeholder: 'Filter by date.' } } ,    
      { title: 'Place', name: 'place', sort: true, filtering: { filterString: '', placeholder: 'Filter by place.' } },
      { title: 'State', name: 'state', sort: true, filtering: { filterString: '', placeholder: 'Filter by state.' } }     
  ];


  public config: any = {
    id: 'pagination',
    itemsPerPage: 3,
    currentPage: 1,
    totalItems: 0,
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  private calculateTotalNumberOfSets() {
    this.hasSets = true;
    let rem = this.totalNumberOfRecords % this.recordsPerSet;
    let mainpart = ~~(this.totalNumberOfRecords / this.recordsPerSet);

    if (this.totalNumberOfRecords < this.recordsPerSet) { this.totalNumberOfSets = 1; }
    else {
      if (this.totalNumberOfRecords > this.recordsPerSet && rem) { this.totalNumberOfSets = mainpart + 1; }
      else { this.totalNumberOfSets = mainpart; }
    }

  }


  private onPageChange(passedpage: number) {

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


  // next page of records method
  private nextSetOfRecords() {

    this.messagesService.emitRoute("nill");
    if (this.totalNumberOfSets > this.setsCounter) {

      // increase the set counter
      this.setsCounter = this.setsCounter + 1;

      // get the next set of records
      if (this.filters) { this.getSetOfTradesWithSetFilters(); }
      else { this.getSetOfTrades(this.setsCounter, this.recordsPerSet, this.status); }

      // set the current page to 1
      this.config.currentPage = 1;
  
    }
    else { this.messagesService.emitProcessMessage("PME", "There no more sets of records."); }
  }


  // previous page of records method
  private previousSetOfRecords() {

    this.messagesService.emitRoute("nill");

    if (this.setsCounter > 1) {

      // decreasethe set counter
      this.setsCounter = this.setsCounter - 1;

      // get the previous set of records
      if (this.filters) { this.getSetOfTradesWithSetFilters(); }
      else { this.getSetOfTrades(this.setsCounter, this.recordsPerSet, this.status); }

      // set the current page to 1
      this.config.currentPage = 1;
    }
    else { this.messagesService.emitProcessMessage("PME", "This is the first set of records."); }
  }


  private onChangeTable(config: any, page: any = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.config.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.config.sorting, config.sorting);
    }
  
    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = sortedData;  
    this.config.totalItems = sortedData.length;

 
    if (this.config.totalItems > this.config.itemsPerPage) { this.hasNavigation = true;  }
    
  }


  private sortTable(column: string) {
    // reset the array of columns
    this.config.sorting.columns = [];
    switch (column) {
      case 'name':
        this.selectedItem = "Name";
        this.config.sorting.columns = [{ name: 'name', sort: this.sortName }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isNameAsc;
        this.isNameAsc = !this.isNameAsc;
        this.sortName = this.isNameAsc ? 'desc' : 'asc';
        break;

      case 'tradeFor':
        this.selectedItem = "Trading For";
        this.config.sorting.columns = [{ name: 'tradeFor', sort: this.sortTradeFor }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isTradeForAsc;
        this.isTradeForAsc = !this.isTradeForAsc;
        this.sortTradeFor = this.isTradeForAsc ? 'desc' : 'asc';
        break;

      case 'categoryDescription':
        this.selectedItem = "Category";
        this.config.sorting.columns = [{ name: 'categoryDescription', sort: this.sortCategory }];
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

      case 'place':
        this.selectedItem = "Place";
        this.config.sorting.columns = [{ name: 'place', sort: this.sortPlace }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isPlaceAsc;
        this.isPlaceAsc = !this.isPlaceAsc;
        this.sortPlace = this.isPlaceAsc ? 'desc' : 'asc';
        break;

      case 'state':
        this.selectedItem = "State";
        this.config.sorting.columns = [{ name: 'state', sort: this.sortState }];
        this.onChangeTable(this.config);
        this.isAsc = !this.isStateAsc;
        this.isStateAsc = !this.isStateAsc;
        this.sortState = this.isStateAsc ? 'desc' : 'asc';
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
                    if (item[column.name].toString().match(this.config.filtering.filterString)) { flag = true; }
          });
          if (flag) { tempArray.push(item); }
    });

    filteredData = tempArray;

    return filteredData;
  }


  private changeSort(data: any, config: any) {
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








