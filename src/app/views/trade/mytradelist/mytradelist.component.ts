import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import {  NgClass, NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';
// third party
import { NG_TABLE_DIRECTIVES, NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from 'ng2-table';


// services
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import { CapsPipe } from '../../../helpers/pipes';
import {UserSession, UserIdentity, Authentication, Trade, PageTitle } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-mytradeslist',
  templateUrl: './mytradelist.component.html',
  styleUrls: ['./mytradelist.component.scss']
})
export class MyTradeListComponent implements OnInit {

  private traderId: string;
  private removedTradeId: number;
  private tradeIdToBeRemoved: number;
  private tradeToRemove: Trade;

  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;

  private isRequesting: boolean = false;
  private isAuthenticated: boolean = false;
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
                this.traderId = this.session.userIdentity.userId;
              }
              catch (ex) {
                this.messagesService.emitProcessMessage("PMG");
              }
    }

      this.messagesService.emitRoute("nill");
      this.isRequesting = true;
      // set proper title depending of what we displaying
      this.pageTitleService.emitPageTitle(new PageTitle("My Trades"));

      this.getTrades(this.traderId);
      // get all or author's articles
      this.getTrades(this.traderId);

  }


  //*****************************************************
  // GET TRADES
  //*****************************************************
  private getTrades(traderId:string) {

    this.tradeApiService.getTradesApi(traderId)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) { this.messagesService.emitProcessMessage("PMNOAs"); } // TODO change the process message code to reflect the trades
        this.data = this.TransformData(returnedTrades),
        this.isRequesting = false,
        this.onChangeTable(this.config)
      },
      (res: Response) => this.onError(res, "getTrades"));

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
    this.router.navigate(['/addtrade']);
  }


  //****************************************************
  // REMOVE TRADE
  //****************************************************
  private removeTrade(tradeId: string) {
    //this.tradeApiService.removeTrade(tradeId)
    //  .subscribe((removedTrade: Trade) => this.onSuccessRemoveTrade(removedTrade)
    //  , error => this.onError(error, "removeArticle"));
  }



  //*****************************************************
  // HELPER METHODS ARTICLES
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


  private TransformData(returnedTrades: Trade[]): Array<any> {

    let transformedData = new Array<Trade>();
    returnedTrades.forEach(function (value) {

      let trd = new Trade;
      trd.tradeIdStr = value.tradeId.toString();
      trd.tradeId = value.tradeId;
      trd.tradeDatePublished = value.tradeDatePublished;
      trd.traderId = value.traderId;
      trd.traderFirstName = value.traderFirstName;
      trd.traderMiddleName = value.traderMiddleName;
      trd.traderLastName = value.traderLastName;
      trd.traderFullName = trd.traderFirstName + " " + trd.traderMiddleName + " " + trd.traderLastName;
      trd.tradeObjectDescription = value.tradeObjects[0].tradeObjectDescription;
      trd.tradeObjectCategoryDescription = value.tradeObjects[0].tradeObjectCategoryDescription;

      value.tradeForObjects.forEach(function (value) {
        trd.tradeForObjectsDescription = trd.tradeForObjectsDescription + value.tradeForObjectDescription + ",";
      });

      transformedData.push(trd);

    });
    return transformedData;
  }


  private passToModal(trade: Trade) {

      if (trade.traderId === this.session.userIdentity.userId) {
        this.isOwner = true;
        this.tradeIdToBeRemoved = trade.tradeId;
      }
      else {
        this.isOwner = false;
        this.tradeIdToBeRemoved = null;
      }
  }


  // an error has occured
  private onError(err: any, operation: string) {
    // stop the spinner
    this.isRequesting = false;

    // logg the audit log error
    this.loggerService.addError(err, `${operation} failed: ${err.status},  the URL: ${err.url}, was:  ${err.statusText}`);

    // show the process message
    this.messagesService.emitProcessMessage("PMGTs");  // TODO  change the process message
  }


  /**********************************************/
  //ngx-pagination section
  /***********************************************/
  private isIdAsc = true;
  private isTitleAsc = true;
  private isTitleForAsc = true;
  private isCategoryAsc = true;
  private isNameAsc = true;
  private isPublishedAsc = true;

  private sortId: string = 'des'
  private sortTitle: string = 'desc';
  private sortTitleFor: string = 'desc';
  private sortCategory: string = 'desc';
  private sortName: string = 'desc';
  private sortDate: string = 'desc';

  private data: Array<any> = [];     // full data from the server
  public rows: Array<any> = [];      // rows passed to the table
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;
  public page: number = 1;

 
  public columns: Array<any> =
    [
    { title: 'Id', name: 'tradeIdStr', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade id' } },
    { title: 'Trading',    name: 'tradeObjectDescription',              sort: true,   filtering: { filterString: '', placeholder: 'Filter by trade object description' } },
    { title: 'For', name: 'tradeForObjectsDescription',                 sort: true,   filtering: { filterString: '', placeholder:  'Filter by trade for object description' } },
    { title: 'Category',  name: 'tradeObjectCategoryDescription', sort: true,  filtering: { filterString: '', placeholder:  'Filter by trade category' }},
    { title: 'Trader', name: 'traderFullName',                             sort: true,   filtering: { filterString: '', placeholder:  'Filter by trader full name.' }},
    { title: 'Published', name: 'tradeDatePublished',                   sort: true,   filtering: { filterString: '', placeholder:  'Filter by trade date.' }} 
   ];

  public config: any = {
    id: 'pagination',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: this.length,
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };

  // all sorting and filtering methods
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
      case 'tradeIdStr':
        this.config.sorting.columns = [{ name: 'tradeIdStr', sort: this.sortId }];
        this.onChangeTable(this.config);
        this.isIdAsc = !this.isIdAsc;
        this.sortId = this.isIdAsc ? 'desc' : 'asc';
        break;

        case 'tradeObjectDescription':
          this.config.sorting.columns = [{ name: 'tradeObjectDescription', sort: this.sortTitle }];
          this.onChangeTable(this.config);
          this.isTitleAsc = !this.isTitleAsc;
          this.sortTitle = this.isTitleAsc ? 'desc' : 'asc';
        break;

        case 'tradeForObjectsDescription':
          this.config.sorting.columns = [{ name: 'tradeForObjectsDescription', sort: this.sortTitleFor }];
          this.onChangeTable(this.config);
          this.isTitleForAsc = !this.isTitleForAsc;
          this.sortTitleFor = this.isTitleForAsc ? 'desc' : 'asc';
        break;

        case 'tradeObjectCategoryDescription':
          this.config.sorting.columns = [{ name: 'tradeObjectCategoryDescription', sort: this.sortCategory }];
          this.onChangeTable(this.config);
          this.isCategoryAsc = !this.isCategoryAsc;
          this.sortCategory = this.isCategoryAsc ? 'desc' : 'asc';
        break;

        case 'traderFullName':
          this.config.sorting.columns = [{ name: 'traderFullName', sort: this.sortName }];
          this.onChangeTable(this.config);
          this.isNameAsc = !this.isNameAsc;
          this.sortName = this.isNameAsc ? 'desc' : 'asc';
        break;

        case 'tradeDatePublished':
          this.config.sorting.columns = [{ name: 'tradeDatePublished', sort: this.sortDate }];
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



  //public ngAfterViewInit() {
  //  //// ONE WAY OF PASSING VALUES TO MODAL    TODO find out how to replace this
  //  ////triggered when modal is about to be shown
  //  //$('#removeAllowed').on('show.bs.modal', function (event) {
  //  //  //get data-articleid attribute of the clicked element
  //  //  var artId = $(event.relatedTarget).data('tradeId');
  //  //  var modal = $(this)
  //  //  //populate the textbox
  //  //  modal.find('input[name="tradeId"]').val(artId);
  //  //  //modal.find('.modal-body input').val(artId);
  //  //});
  //}



