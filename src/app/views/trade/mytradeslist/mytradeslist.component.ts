import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';

// services
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { TradeHistoryService } from '../../../services/tradehistory/trade-history.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import { CapsPipe } from '../../../helpers/pipes';
import {UserSession, UserIdentity, Authentication, Trade, TradeHistory, PageTitle } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-mytradeslist',
  templateUrl: './mytradeslist.component.html',
  styleUrls: ['./mytradeslist.component.scss']
})
export class MyTradesListComponent implements OnInit {

  private traderId: string;
  private removedTradeId: number;
  private tradeIdToBeRemoved: number;
  private tradeIdToBeClosed: number;
  private tradeToRemove: Trade;
  private tradeToClose: Trade;
  private isOwner: boolean = false;

  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private isRequesting: boolean = false;
  private isAuthenticated: boolean = false;

  private totalNumberOfRecords: number = 0;
  private setsCounter: number = 1;
  private recordsPerSet: number = 50;
  private totalNumberOfSets: number = 0;
  private status: string = "All";
  private hasTrades: boolean = true;
  private hasNoTrades: boolean = false;
  private isFirstLoad: boolean = false;

  // constructor which injects the services
  constructor(
    private route: ActivatedRoute,
    private tradeApiService: TradeApiService,
    private tradeHistoryService: TradeHistoryService,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private loggerService: LoggerService) {
  };


  // implement OnInit to get the initiale list of tades
  public ngOnInit() {
    this.getUseridentity();
    this.initialiseComponent();
    //this.getTrades(this.traderId); 
    this.getSetOfTrades(this.traderId, this.setsCounter, this.recordsPerSet, this.status);
  }

  //*********************************************************************************************
  // GET TRADES - this will get open trades, if there are no any open trades will get all or will show message - no trades
  //*********************************************************************************************
  private getTrades(traderId: string, status: string) {

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
            this.isRequesting = false;     
            this.isFirstLoad;    
            this.calculateTotalNumberOfSets();
            this.onChangeTable(this.config),
            this.onPageChange(1)
        }
      },
      (res: Response) => this.onError(res, "getTrades"));

  }


  //gets page of trades 
  private getSetOfTrades(traderId: string, setCounter: number, recordsPerSet: number, status:string) {

    this.tradeApiService.getSetOfTradesWithStatusForTrader(traderId, setCounter, recordsPerSet, status)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) {
            this.hasTrades = false;
            this.isRequesting = false;
            if (!this.hasTrades && !this.hasNoTrades) { this.getSetOfTrades(traderId, setCounter, recordsPerSet, "All"); }     // there are no open trades so get the latest closed ones
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
            this.isRequesting = false;
            this.isFirstLoad = true;
            this.calculateTotalNumberOfSets();
            this.onChangeTable(this.config),
            this.onPageChange(1)
        }
      }, (serviceError: Response) => this.onError(serviceError, "getPageOfTrades"));
  }


  //****************************************************
  // ADD TRADE
  //****************************************************
  // navigate to the AddTrade view
  private addTrade() {
    this.router.navigate(['/addtrade']);
  }


  //****************************************************
  // REMOVE TRADE
  //****************************************************
  private deleteTrade(tradeId: number) {
    this.tradeApiService.DeleteTrade(tradeId)
      .subscribe((removedTrade: Trade) => this.onSuccessRemoveTrade(removedTrade)
      , error => this.onError(error, "removeArticle"));
  }


  //****************************************************
  // CLOSE TRADE
  //****************************************************
  private closeTrade(trade:Trade) {
    // create trade history to be written
    let trhis: TradeHistory = new TradeHistory();
    let dt: Date = new Date();
    trhis.createdDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    trhis.status = "Closed";
    trhis.tradeId = trade.tradeId;

    // add new history record
    this.tradeHistoryService.addTradeHistory(trhis)
       .subscribe((returnedHistory: TradeHistory) => {
        // update the trade now
        trade.status = "Closed";      
        this.tradeApiService.UpdateTrade(trade)
              .subscribe((returnedTrade: Trade) => {
                    // if successfull get the trades now
                     this.getSetOfTrades(this.traderId, this.setsCounter, this.recordsPerSet, this.status);

              }, (serviceError: Response) => this.onError(serviceError, "closeTrade"))                           
      }, (serviceError: Response) => this.onError(serviceError, "closeTrade"));
  }


  //*****************************************************
  // HELPER METHODS 
  //*****************************************************
  // this one should be the authentication service
  private getUseridentity() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.isAuthenticated = this.session.authentication.isAuthenticated;
        this.identity.roles = this.session.userIdentity.roles;
        this.traderId = this.session.userIdentity.userId;
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  // initialise componanet method
  private initialiseComponent() {
    this.messagesService.emitRoute("nill");
    this.isRequesting = true;
    this.pageTitleService.emitPageTitle(new PageTitle("My Trades"));
  }


  // tansformation of the data in fromat we need
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
      trd.status = value.status;
      trd.tradeFor = value.tradeFor;   

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

      transformedData.push(trd);

    });
    return transformedData;
  }


  // passing data to the modal form
  private passToModal(trade: Trade) {

      if (trade.traderId === this.session.userIdentity.userId) {
        this.isOwner = true;
        this.tradeIdToBeRemoved = trade.tradeId;
        this.tradeIdToBeClosed = trade.tradeId;
        this.tradeToClose = trade;
        this.tradeToRemove = trade;
      }
      else {
        this.isOwner = false;
        this.tradeIdToBeRemoved = null;
        this.tradeIdToBeClosed = null;
        this.tradeToClose = null;
        this.tradeToRemove = null;
      }
  }


  // when removing of the trade is successful
  private onSuccessRemoveTrade(trade: Trade) {
    if (trade) {
      this.removedTradeId = trade.tradeId;
      this.onChangeTable(this.config);
      this.onPageChange(1);

      // reset the removed trade after the data has been updated so it is ready for the next filtering or sorting of the list
      this.removedTradeId = null;

      this.messagesService.emitProcessMessage("PMSDT");
    }
    else {
      this.messagesService.emitProcessMessage("PMEDT");
    }
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
  private isIdAsc = true;
  private isStatusAsc = true;
  private isNameAsc = true;
  private isForAsc = true;
  private isCategoryAsc = true;
  private isPublishedAsc = true;

  private sortId: string = 'desc';
  private sortStatus: string = 'des'
  private sortName: string = 'desc';
  private sortFor: string = 'desc';
  private sortCategory: string = 'desc';
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
    { title: 'Id', name: 'tradeIdStr', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade id.' } },
    { title: 'Status', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade status' } },
    { title: 'Trading',    name: 'name',              sort: true,   filtering: { filterString: '', placeholder: 'Filter by trade object name' } },
    { title: 'For', name: 'tradeFor',                 sort: true,   filtering: { filterString: '', placeholder:  'Filter by trade for object name' } },
    { title: 'Category',  name: 'categoryDescription', sort: true,  filtering: { filterString: '', placeholder:  'Filter by trade category' }},   
    { title: 'Published', name: 'datePublished',                   sort: true,   filtering: { filterString: '', placeholder:  'Filter by trade date.' }} 
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
    // is this the last page of the current set and is this the last set of records
    if (this.lastPageOfTheCurrentSet === this.config.currentPage && this.setsCounter < this.totalNumberOfSets) { this.isNextButton = true; }
    else { this.isNextButton = false; }

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
      this.getSetOfTrades(this.traderId, this.setsCounter, this.recordsPerSet, this.status);

      // set the current page to 1
      this.config.currentPage = 1;
    }
    else { this.messagesService.emitProcessMessage("PME", "There no more sets of records."); }
  }


  // previous page of records method
  private previousSetOfRecords() {

    this.messagesService.emitRoute("nill");

    if (this.setsCounter > 1) {

      // decrease the set counter
      this.setsCounter = this.setsCounter - 1;

      // get the previous set of records
      this.getSetOfTrades(this.traderId, this.setsCounter, this.recordsPerSet, this.status);

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

    if (!this.isFirstLoad) {
      let removeData = this.changeRemove(this.data, this.config);
      let filteredData = this.changeFilter(removeData, this.config);
      let sortedData = this.changeSort(filteredData, this.config);
      this.rows = sortedData;
      this.config.totalItems = sortedData.length;
    } else {
      this.rows = this.data;
      this.config.totalItems = this.data.length;
      this.isFirstLoad = false;
    }    
  }


  private sortTable(column: string) {
    // reset the array of columns
    this.config.sorting.columns = [];
    switch (column) {

      case 'tradeIdStr':
        this.config.sorting.columns = [{ name: 'tradeIdStr', sort: this.sortId }];
        this.onChangeTable(this.config);
        this.isIdAsc = !this.isIdAsc;
        this.sortId = this.isIdAsc ? 'desc' : 'asc';
        break;

      case 'status':
        this.config.sorting.columns = [{ name: 'status', sort: this.sortStatus }];
        this.onChangeTable(this.config);
        this.isStatusAsc = !this.isStatusAsc;
        this.sortStatus = this.isStatusAsc ? 'desc' : 'asc';
        break;

        case 'name':
        this.config.sorting.columns = [{ name: 'name', sort: this.sortName }];
        this.onChangeTable(this.config);
        this.isNameAsc = !this.isNameAsc;
        this.sortName = this.isNameAsc ? 'desc' : 'asc';
        break;

        case 'tradeFor':
        this.config.sorting.columns = [{ name: 'tradeFor', sort: this.sortFor }];
        this.onChangeTable(this.config);
        this.isForAsc = !this.isForAsc;
        this.sortFor = this.isForAsc ? 'desc' : 'asc';
        break;

        case 'categoryDescription':
          this.config.sorting.columns = [{ name: 'categoryDescription', sort: this.sortCategory }];
          this.onChangeTable(this.config);
          this.isCategoryAsc = !this.isCategoryAsc;
          this.sortCategory = this.isCategoryAsc ? 'desc' : 'asc';
        break;   

        case 'datePublished':
          this.config.sorting.columns = [{ name: 'datePublished', sort: this.sortDate }];
          this.onChangeTable(this.config);
          this.isPublishedAsc = !this.isPublishedAsc;
          this.sortDate = this.isPublishedAsc ? 'desc' : 'asc';
          break;
        default:
    }
  }


  private changeRemove(data: any, config: any): any {
    if (this.removedTradeId == null) { return data; }

    let removedData: Array<any> = data.filter((item: Trade) => item.tradeId !== this.removedTradeId);
    this.data = null;
    this.data = removedData;
    return this.data;
  }


  public changeFilter(data: any, config: any): any {

    let filteredData: Array<any> = data;

    this.columns.forEach((column: any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => {
          return item[column.name].match(column.filtering.filterString);
        });
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
      let flag = false;
      this.columns.forEach((column: any) => {
        if (item[column.name].toString().match(this.config.filtering.filterString)) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
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


