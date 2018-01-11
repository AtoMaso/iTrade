import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import {  NgClass, NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';
// third party
import { NG_TABLE_DIRECTIVES, NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from 'ng2-table';
import { PaginationInstance, PaginatePipe, PaginationControlsDirective  } from 'ngx-pagination';
//import { PaginationModule, PaginationConfig, PaginationComponent } from 'ngx-bootstrap';

// services
import { TradeApiService } from '../../services/tradeapi/tradeapi.service';
import { LoggerService } from '../../services/logger/logger.service';
import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';
// components
import { CapsPipe } from '../../helpers/pipes';
import {UserSession, UserIdentity, Authentication, Trade, PageTitle } from '../../helpers/classes';
import { SpinnerOneComponent } from '../controls/spinner/spinnerone.component';



import { TableData } from './table-data';


@Component({
  selector: 'app-tradeslist',
  templateUrl: './tradeslist.component.html',
  styleUrls: ['./tradeslist.component.scss']
})
export class TradeslistComponent implements OnInit {

  private traderId: number;
  private removedTradeId: number;
  private tradeIdToBeRemoved: number;
  private tradeToRemove: Trade;

  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;

  private isRequesting: boolean = false;
  private isAuthenticated: boolean = false;
  private isAllowedToAddTrade: boolean = false;
  private isAllowedToRemoveTrade: boolean = false;
  private isOwner: boolean = false;

  // constructor which injects the services
  constructor(
    private route: ActivatedRoute,
    private tradeApiService: TradeApiService,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private loggerService: LoggerService) {
    this.length = this.data.length;
  };

  // implement OnInit to get the initial list of articles
  public ngOnInit() {

    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.isAuthenticated = this.session.authentication.isAuthenticated;
        this.identity.roles = this.session.userIdentity.roles;
        this.IsAllowedToAddTrade();
        this.IsAllowedToRemoveTrade();
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
    this.messagesService.emitRoute("nill");
    this.isRequesting = true;
    this.traderId = +this.route.snapshot.paramMap.get('id');  // TODO check this 

    // set proper title depending of what we displaying
    if (this.traderId) {
      this.pageTitleService.emitPageTitle(new PageTitle("Trader's Trades"));
    }
    else {
      this.pageTitleService.emitPageTitle(new PageTitle("All Trades"));
    }
    // get all or author's articles
    this.getTrades(this.traderId);

     //this.ChangeTable(this.config);

  }


  public ngAfterViewInit() {
    //// ONE WAY OF PASSING VALUES TO MODAL    TODO find out how to replace this
    ////triggered when modal is about to be shown
    //$('#removeAllowed').on('show.bs.modal', function (event) {
    //  //get data-articleid attribute of the clicked element
    //  var artId = $(event.relatedTarget).data('tradeId');
    //  var modal = $(this)
    //  //populate the textbox
    //  modal.find('input[name="tradeId"]').val(artId);
    //  //modal.find('.modal-body input').val(artId);
    //});
  }


  private passToModal(trade: Trade) {
    if (trade.traderId === +this.session.userIdentity.userId) {
      this.isOwner = true;
      this.tradeIdToBeRemoved = trade.tradeId;
    }
    else {
      this.isOwner = false;
      this.tradeIdToBeRemoved = null;
    }
  }


  private IsAllowedToAddTrade() {
    // in TYPESCRIPT call to class methods containing call to "this" have to be created
    // and relevant parameters passed (roles in thsi case) and then method called on
    // that instance of the class, in this instance "identity" object. The reason for this is
    // the "this" keyword is the one of the object calling the method
    if (this.isAuthenticated) {
      this.isAllowedToAddTrade = true;
    }
  }


  private IsAllowedToRemoveTrade() {
    // in TYPESCRIPT call to class methods containing call to "this" have to be created
    // and relevant parameters passed (roles in thsi case) and then method called on
    // that instance of the class, in this instance "identity" object. The reason for this is
    // the "this" keyword is the one of the object calling the method
    if (this.isAuthenticated) {
      this.isAllowedToRemoveTrade = true;
    }
  }


  //*****************************************************
  // GET TRADES
  //*****************************************************
  private getTrades(id: number) {

    this.tradeApiService.getTradesApi(id)
      .subscribe((returnedTrades: any) => {
        if (returnedTrades.length === 0) { this.messagesService.emitProcessMessage("PMNOAs"); } // TODO change the process message code to reflect the trades
            this.data = returnedTrades,
            this.isRequesting = false,
            this.onChangeTable(this.config)
      }, (res: Response) => this.onError(res, "getTrades"));
  }


  //get set of records of articles service method
  private getPageOfTrades(id: number, page: number, total: number) {

    this.tradeApiService.getPageOfTrades(id, page, total)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) { this.messagesService.emitProcessMessage("PMNOAs"); } // TODO change the process message code to reflect the trades
          this.data = returnedTrades,
          this.isRequesting = false,
          this.onChangeTable(this.config);
      }, (res: Response) => this.onError(res, "getPageOfTradesArticles"));
  }


  //****************************************************
  // ADD TRADE
  //****************************************************
  private addTrade() {
    this.router.navigate(['AddTrade']);
  }


  //****************************************************
  // REMOVE TRADE
  //****************************************************
  //private removeTrade(tradeId: string) {
  //  this.tradeApiService.removeTrade(tradeId)
  //    .subscribe((removedTrade: Trade) => this.onSuccessRemoveTrade(removedTrade)
  //    , error => this.onError(error, "removeArticle"));
  //}

  //*****************************************************
  // PRIVATE METHODS ARTICLES
  //*****************************************************
  private onSuccessRemoveTrade(trade: Trade) {
    if (trade) {
      this.removedTradeId = trade.tradeId;
      this.onChangeTable(this.config);
      // reset the removed article after the data has been updated
      // so it is ready for the next filtering or sorting of the list
      this.removedTradeId = null;

      this.messagesService.emitProcessMessage("PMRAS"); // TODO change the process message code to reflect the trades
    }
    else {
      this.messagesService.emitProcessMessage("PMRA"); // TODO change the process message code to reflect the trades
    }
  }


  // an error has occured
  private onError(err: any, type: string) {
    // stop the spinner
    this.isRequesting = false;
    let message: string = "";

    // we will log the error in the server side by calling the logger, or that is already 
    // done on the server side if the error has been caught
    this.loggerService.addError(err, "article list page");

    // we will display a fiendly process message using the process message service   
    if (err.status !== 200 || err.status !== 300) {
      let data = err.json();

      if (data.ModelState) {
        for (var key in data.ModelState) {
          for (var i = 0; i < data.ModelState[key].length; i++) {
            //errors.push(data.modelState[key][i]);
            if (message == null) { message = data.ModelState[key][i]; }
            else { message = message + data.ModelState[key][i]; } // end if else
          }// end for
        } // end for
        this.messagesService.emitProcessMessage("PME", message);   // TODO change the process message code to reflect the trades
      } // end if
      else {
        // we will display a fiendly process message using the process message service    
        switch (type) {
          case "removeTrade":
            this.messagesService.emitProcessMessage("PMRA");  // TODO change the process message code to reflect the trades
            break;
          case "getTrades":
            this.messagesService.emitProcessMessage("PMGAs"); // TODO change the process message code to reflect the trades
            break;
          default:
            this.messagesService.emitProcessMessage("PMG"); // TODO change the process message code to reflect the trades
        }
      }
    } //end if              
  }



  /**********************************************/
  //ngx-pagination methods
  /***********************************************/
  private isTitleAsc = true;
  private isCategoryAsc = true;
  private isNameAsc = true;
  private isPublishedAsc = true;
  private sortTitle: string = 'desc';
  private sortCategory: string = 'desc';
  private sortName: string = 'desc';
  private sortDate: string = 'desc';
  private data: Array<any> = [];     // full data from the server
  public rows: Array<any> = [];      // rows passed to the table
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;
  public page: number = 1;

 
  public columns: Array<any> = [
    { title: 'Title', name: 'title', sort: true, filtering: { filterString: '', placeholder: 'Filter by title' }},
    { title: 'Category', name: 'categoryType', sort: true, filtering: { filterString: '', placeholder: 'Filter by category' }},
    { title: 'Trader', name: 'traderName', sort: true, filtering: { filterString: '', placeholder: 'Filter by trader name.' }},
    { title: 'Published', name: 'datePublished', sort: true, filtering: { filterString: '', placeholder: 'Filter by trader date.' }} 
   ];

  public config: any = {
    id: 'pagination',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.length,
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  private onPageChange(passedpage: number) {
    this.config.currentPage = passedpage;
  }
 

  private onChangeTable(config: any, page: any = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.config.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.config.sorting, config.sorting);
    }

    let removedData = this.changeRemove(this.data, this.config);
    let filteredData = this.changeFilter(removedData, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = sortedData; 
    this.length = sortedData.length; 
    this.config.totalItems = this.length;
  }


  private sortTable(column: string) {
    // reset the array of columns
    this.config.sorting.columns = [];
    switch (column) {
      case 'title':
        this.config.sorting.columns = [{ name: 'title', sort: this.sortTitle }];
        this.onChangeTable(this.config);
        this.isTitleAsc = !this.isTitleAsc;
        this.sortTitle = this.isTitleAsc ? 'desc' : 'asc';
        break;
      case 'categoryType':
        this.config.sorting.columns = [{ name: 'categoryType', sort: this.sortCategory }];
        this.onChangeTable(this.config);
        this.isCategoryAsc = !this.isCategoryAsc;
        this.sortCategory = this.isCategoryAsc ? 'desc' : 'asc';
        break;
      case 'traderName':
        this.config.sorting.columns = [{ name: 'traderName', sort: this.sortName }];
        this.onChangeTable(this.config);
        this.isNameAsc = !this.isNameAsc;
        this.sortName = this.isNameAsc ? 'desc' : 'asc';
        break;
      case 'satePublished':
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







