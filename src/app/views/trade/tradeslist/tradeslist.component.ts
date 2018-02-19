import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';

// services
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import { CapsPipe } from '../../../helpers/pipes';
import { UserSession, UserIdentity, Authentication, Trade, PageTitle } from '../../../helpers/classes';
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
  private recordsPerSet: number = 50;
  private totalNumberOfSets: number = 0;
  private hasTrades: boolean = true;
  private hasNoTrades: boolean = false;
  private hasSets: boolean = false;
  private hasNavigation: boolean = false;

  private selectedItem: string = "Name";
  private displayRecords: number = 0;
  private totalDisplayRecords: number = 0;
  private filters: string[] =  null;

  // constructor which injects the services
  constructor(
    private route: ActivatedRoute,
    private tradeApiService: TradeApiService,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private loggerService: LoggerService) {   
  };


  // implement OnInit to get the initial list of articles
  public ngOnInit() { 
     
    this.getUseridentity();
    this.initialiseComponent();   

    this.getTrades("");
    //this.getPageOfTrades("", this.setsCounter, this.recordsPerSet, this.status);
   ;
  }



  ngAfterViewInit() {

    jQuery(document).ready(function () {

      jQuery("#collapseFilters").on("hide.bs.collapse", function () {
        jQuery(".filters").html('<span class="glyphicon glyphicon-plus"></span> Filters');
      });
      jQuery("#collapseFilters").on("show.bs.collapse", function () {
        jQuery(".filters").html('<span class="glyphicon glyphicon-minus"></span> Filters');
      });

      jQuery("#collapseCategory").on("hide.bs.collapse", function () {
        jQuery("#category").html('<span class="glyphicon glyphicon-plus"></span> Category');
      });
      jQuery("#collapseCategory").on("show.bs.collapse", function () {
        jQuery("#category").html('<span class="glyphicon glyphicon-minus"></span> Category');
      });

      jQuery("#collapsePlace").on("hide.bs.collapse", function () {
        jQuery("#places").html('<span class="glyphicon glyphicon-plus"></span> Place');
      });
      jQuery("#collapsePlace").on("show.bs.collapse", function () {
        jQuery("#places").html('<span class="glyphicon glyphicon-minus"></span> Place');
      });

    });
  }


  //*********************************************************************************************
  // GET TRADES - this will get open trades, if there are no any open trades will get all or will show message - no trades
  //*********************************************************************************************
  // gets all trades
  private getTrades(traderId:string, status:string="Open") {

    this.tradeApiService.getTradesWithStatusOrAll(traderId, status)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) {
              this.hasTrades = false;
              this.isRequesting = false;           
              if (!this.hasTrades && !this.hasNoTrades) { this.getTrades(traderId, "All"); }     // there are no open trades so get the latest closed ones
              else {
                this.hasTrades = false;
                this.hasNoTrades = true;   // if there are no records at all than show the message no trades at all
              }
        }  
        else {
            this.data = this.TransformData(returnedTrades),
            this.totalNumberOfRecords = this.data[0].total;            
            this.hasTrades = true;
            this.hasNoTrades = false;
            this.isRequesting = false,
            //this.calculateTotalNumberOfSets();
            this.onChangeTable(this.config),
            this.onPageChange(1)
        }
      },
      (res: Response) => this.onError(res, "getTrades"));

  }


  //gets page of trades 
  private getPageOfTrades(traderId: string, set: number=1, recordsPerSet: number=50, status: string="Open") {

    this.tradeApiService.getPageOfTradesWithStatusOrAll(traderId, set, recordsPerSet, status)
        .subscribe((returnedTrades: Trade[]) => {      
            if (returnedTrades.length === 0) {
                  this.hasTrades = false;
                  this.isRequesting = false;            
                   if (!this.hasTrades && !this.hasNoTrades ) { this.getPageOfTrades(traderId, set, recordsPerSet, "All"); }    // there are no open trades so get the latest closed ones
                  else {
                    this.hasTrades = false;
                    this.hasNoTrades = true;  // if there are no records at all than show the message no trades at all
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
  private isDateAsc:boolean = true;

  private sortTrader: string = 'desc';
  private sortTradeFor: string = 'desc';
  private sortCategory: string = 'desc';
  private sortName: string = 'desc';
  private sortDate: string = 'desc';

  private data: Array<any> = [];     // full data from the server
  public rows: Array<any> = [];      // rows passed to the table
  public maxSize: number = 5;
  public numPages: number = 1;
  
  private isNextButton: boolean = false;
  private isPrevButton: boolean = false;
  private lastPageOfTheCurrentSet: number = 0; 


  public columns: Array<any> =
    [    
      { title: 'Trading', name: 'name', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade object name' } },
      { title: 'For', name: 'tradeFor', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade for object name' } },
      { title: 'Category', name: 'categoryDescription', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade category' } },
      { title: 'Trader', name: 'traderFullName', sort: true, filtering: { filterString: '', placeholder: 'Filter by trader full name.' } },
      { title: 'Published', name: 'datePublished', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade date.' } }      
  ];


  public config: any = {
    id: 'pagination',
    itemsPerPage: 10,
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

    let rem = this.config.totalItems % this.config.itemsPerPage;
    let mainPart = ~~(this.config.totalItems / this.config.itemsPerPage);


    if (this.config.totalItems < this.config.itemsPerPage) { this.lastPageOfTheCurrentSet = 1; }
    else {
      if (this.config.totalItems > this.config.itemsPerPage && rem) { this.lastPageOfTheCurrentSet = mainPart + 1; }
      else { this.lastPageOfTheCurrentSet = mainPart; }
    }

    // togle the next button visibility
    if (this.lastPageOfTheCurrentSet === this.config.currentPage &&   this.setsCounter < this.totalNumberOfSets) { this.isNextButton = true; }
    else {this.isNextButton = false;}

    // toglle the prev visibility
    if (this.setsCounter > 1) { this.isPrevButton = true; }
    else { this.isPrevButton = false; }

  }


  // next page of records method
  private nextSetOfRecords() {

    this.messagesService.emitRoute("nill");
    if (this.totalNumberOfSets > this.setsCounter) {

      // increase the set counter
      this.setsCounter = this.setsCounter + 1;

      // get the next set of records
      this.getPageOfTrades("", this.setsCounter, this.recordsPerSet, this.status);

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
      this.getPageOfTrades("", this.setsCounter, this.recordsPerSet, this.status);

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

    if (this.config.totalItems < this.config.itemsPerPage) { this.displayRecords = this.config.totalItems; }
    else {
      this.displayRecords = this.config.itemsPerPage;
      this.hasNavigation = true;
    }


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








