import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

// services
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { CorrespondenceService } from '../../../services/correspondence/correspondence.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import { UserSession, UserIdentity, Authentication, Trade, PageTitle, Correspondence } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-traderhome',
  templateUrl: './traderhome.component.html',
  styleUrls: ['./traderhome.component.scss']
})
export class TraderHomeComponent implements OnInit {
  private traderId: string;
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private isRequesting: boolean = false;
  private isAuthenticated: boolean = false;
  private status: string = "Open";
  private statusCorr: string = "New";
  private hasTrades: boolean = true;
  private hasCorres: boolean = true;

  constructor(
    private tradeService: TradeApiService,
    private corresService: CorrespondenceService,
    private route: ActivatedRoute,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private loggerService: LoggerService) {}


  ngOnInit() {
    
    this.getUseridentity();
    this.initialiseComponent();

    this.getTrades(this.traderId, this.status);    
  }


  // toggling done with jquery
  ngAfterViewInit() {
    jQuery(document).ready(function () {

    
      jQuery("#collapseCorrespondence").on("hide.bs.collapse", function () {                         
        jQuery(".correspondence").html('<span class="glyphicon glyphicon-plus"></span>   Latest Correspondence ');
      });
      jQuery("#collapseCorrespondence").on("show.bs.collapse", function () {              
        jQuery(".correspondence").html('<span class="glyphicon glyphicon-minus"></span>  Latest Correspondence ');
      });
    
      jQuery("#collapseTrades").on("hide.bs.collapse", function () {
        jQuery(".status").html('<span class="glyphicon glyphicon-plus"></span> Open Trades');
      });
      jQuery("#collapseTrades").on("show.bs.collapse", function () {
        jQuery(".status").html('<span class="glyphicon glyphicon-minus"></span> Open Trades');
      });

    });
  }



  //**************************************************************************************
  // GET TRADES -- this will get all trades for the trader closed and open, if there are no any will show message
  //**************************************************************************************
  private getTrades(traderId: string, status: string = "All") {

    this.tradeService.getTradesWithStatusOrAll(traderId, status)
      .subscribe((returnedTrades: Trade[]) => {
        this.onSuccessTrades(returnedTrades);
      },
      (res: Response) => this.onError(res, "getTrades"));

  }


  private onSuccessTrades(trades: Trade[]) {
    if (trades.length === 0) { this.hasTrades = false; }
    else {
      this.data = this.TransformData(trades),
        this.hasTrades = true,
        this.onChangeTable(this.config),
        this.onPageChange(1)
    }

    // now call the correspondence
    this.getCorres(this.traderId, this.statusCorr);
  }



  //****************************************************************************************
  // GET CORRESPONDENCE - -- this wil get all correspondence, if there are no any will show the message
  //****************************************************************************************
  private getCorres(traderId: string, status: string = "All") {

    this.corresService.getCorresByTraderIdWithStatusOrAll(traderId, status)
      .subscribe((returnedCorres: Correspondence []) => {
        if (returnedCorres.length === 0) { this.hasCorres = false; } 
        else {
            this.corrData = returnedCorres,
              this.isRequesting = false,
              this.hasCorres = true,
              this.onChangeTableCorr(this.configCorr),
              this.onPageChangeCorr(1)
        }
      },
      (res: Response) => this.onError(res, "getCorres"));

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
        this.traderId = this.session.userIdentity.userId;
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  private initialiseComponent() {
    this.isRequesting = true;  
    this.pageTitleService.emitPageTitle(new PageTitle("Trader Home"));    
    this.messagesService.emitRoute("nill");   
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
      trd.status = value.status;
      trd.tradeFor = value.tradeFor; 
      trd.categoryDescription = value.categoryDescription;
      trd.place = value.place;
      trd.state = value.state;
            
      trd.traderId = value.traderId;
      trd.traderFirstName = value.traderFirstName;
      trd.traderMiddleName = value.traderMiddleName;
      trd.traderLastName = value.traderLastName;
      trd.traderFullName = trd.traderFirstName + " " + trd.traderMiddleName + " " + trd.traderLastName;

  

      transformedData.push(trd);

    });
    return transformedData;
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





  /**********************************************/
  //trade status section
  /***********************************************/
  private isIdAsc = true;
  private isTradeIdAsc = true;
  private isDateAsc = true;
  private isStatusAsc = true;

  private sortId: string = 'desc'
  private sortTradeId: string = 'desc';
  private sortStatus: string = 'desc';
  private sortDate: string = 'desc';

  private data: Array<any> = [];     // full data from the server
  public rows: Array<any> = [];      // rows passed to the table
  public maxSize: number = 5;
  public numPages: number = 1;

  public columns: Array<any> =
    [
      { title: 'Published', name: 'datePublished', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade date.' } },
      { title: 'Action', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade status.' } }
    ];


  public config: any = {
    id: 'pagination',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
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

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = sortedData;
    this.config.totalItems = sortedData.length;
  }


  private sortTable(column: string) {
    // reset the array of columns
    this.config.sorting.columns = [];

    switch (column) {

      case 'datePublished':
        this.config.sorting.columns = [{ name: 'datePublished', sort: this.sortDate }];
        this.onChangeTable(this.config);
        this.isDateAsc = !this.isDateAsc;
        this.sortDate = this.isDateAsc ? 'desc' : 'asc';
        break;

      case 'dtatus':
        this.config.sorting.columns = [{ name: 'dtatus', sort: this.sortStatus }];
        this.onChangeTable(this.config);
        this.isStatusAsc = !this.isStatusAsc;
        this.sortStatus = this.isStatusAsc ? 'desc' : 'asc';
        break;

      default:
    }
  }


  public changeFilter(data: any, config: any): any {

    let filteredData: Array<any> = data;

    this.columns.forEach((column: any) => {

      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => { return item[column.name].match(column.filtering.filterString); });
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




  /**********************************************/
  //Correspondence
  /***********************************************/
  private isDateSentAsc = true;
  private isSubjectAsc = true;
  private isCorrStatusAsc = true;
  private isSenderAsc = true;

  private sortDateSent: string = 'desc'
  private sortSubject: string = 'desc';
  private sortCorrStatus: string = 'desc';
  private sortSender: string = 'desc';

  private corrData: Array<any> = [];     // full data from the server
  public corrRows: Array<any> = [];      // rows passed to the table
  public maxSizeCorr: number = 5;
  public numPagesCorr: number = 1;

  public columnsCorr: Array<any> =
    [
      { title: 'Sent', name: 'dateSent', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence date sent.' } },
      { title: 'Status', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence status.' } },
      { title: 'Subject', name: 'subject', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence subject' } },
      { title: 'Sender', name: 'sender', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence sender.' } }
    ];


  public configCorr: any = {
    id: 'paginationCorr',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
    paging: true,
    sorting: { columns: this.columnsCorr },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  private onPageChangeCorr(passedpage: number) {

    this.configCorr.currentPage = passedpage;
  }


  private onChangeTableCorr(config: any, page: any = { page: this.configCorr.currentPage, itemsPerPage: this.configCorr.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.configCorr.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.configCorr.sorting, config.sorting);
    }

    let filteredData = this.changeFilterCorr(this.corrData, this.configCorr);
    let sortedData = this.changeSortCorr(filteredData, this.configCorr);
    this.corrRows = sortedData;
    this.configCorr.totalItems = sortedData.length;
  }


  private sortTableCorr(column: string) {
    // reset the array of columns
    this.configCorr.sorting.columns = [];

    switch (column) {

      case 'dateSent':
        this.configCorr.sorting.columns = [{ name: 'dateSent', sort: this.sortDateSent }];
        this.onChangeTableCorr(this.configCorr);
        this.isDateSentAsc = !this.isDateSentAsc;
        this.sortDateSent = this.isDateSentAsc ? 'desc' : 'asc';
        break;

      case 'status':
        this.configCorr.sorting.columns = [{ name: 'status', sort: this.sortCorrStatus }];
        this.onChangeTableCorr(this.configCorr);
        this.isCorrStatusAsc = !this.isCorrStatusAsc;
        this.sortCorrStatus = this.isCorrStatusAsc ? 'desc' : 'asc';
        break;

      case 'subject':
        this.configCorr.sorting.columns = [{ name: 'subject', sort: this.sortSubject }];
        this.onChangeTableCorr(this.configCorr);
        this.isSubjectAsc = !this.isSubjectAsc;
        this.sortSubject = this.isSubjectAsc ? 'desc' : 'asc';
        break;

      case 'sender':
        this.configCorr.sorting.columns = [{ name: 'sender', sort: this.sortSender }];
        this.onChangeTableCorr(this.configCorr);
        this.isSenderAsc = !this.isSenderAsc;
        this.sortSender = this.isSenderAsc ? 'desc' : 'asc';
        break;

      default:
    }
  }


  public changeFilterCorr(data: any, config: any): any {

    let filteredData: Array<any> = data;

    this.columnsCorr.forEach((column: any) => {

      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => { return item[column.name].match(column.filtering.filterString); });
      }

    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.configCorr.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {

      // find the string in each coloumn
      let flag = false;
      this.columnsCorr.forEach((column: any) => {
        if (item[column.name].toString().match(this.configCorr.filtering.filterString)) { flag = true; }
      });
      if (flag) { tempArray.push(item); }

    });

    filteredData = tempArray;

    return filteredData;
  }


  private changeSortCorr(data: any, config: any) {
    if (!config.sorting) {
      return data;
    }

    let columns = this.configCorr.sorting.columns || [];
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
