import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { ImageService } from '../../../services/image/image.service';
import { TradeHistoryService } from '../../../services/tradehistory/trade-history.service';

import { UserSession, UserIdentity, Authentication, Trade, PageTitle, Image, TradeHistory } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-tradedetails',
  templateUrl: './tradedetails.component.html',
  styleUrls: ['./tradedetails.component.scss']
})


export class TradeDetailsComponent implements OnInit {

  private tradeId: number = 0;
  private trade: Trade = new Trade();
  private images: Image[];
  private histories: TradeHistory[];
  private hasImages: boolean = false; 
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private isRequesting: boolean = false;
  private isAuthenticated: boolean = false;

  constructor(  
    private tradeApiService: TradeApiService,
    private imageServise: ImageService, 
    private tradeHistoryService: TradeHistoryService,
    private route: ActivatedRoute,    
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) {
   
  };


  ngOnInit() {
    this.route.queryParams.subscribe(params => { this.tradeId = params['id']; });

    this.getUseridentity();

    this.initialiseComponent(); 

    this.getATrade(this.tradeId); 

    this.getTradeImages(this.tradeId);

    this.getTradeHistory(this.tradeId);

  
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
    this.pageTitleService.emitPageTitle(new PageTitle("Trade Details"));
    this.messagesService.emitRoute("nill");
  }


  ngAfterViewInit() {


    jQuery(document).ready(function () {

      jQuery("#collapseDescription").on("hide.bs.collapse", function () {
        jQuery(".description").html('<span class="glyphicon glyphicon-plus"></span> Trade Description');
      });
      jQuery("#collapseDescription").on("show.bs.collapse", function () {
        jQuery(".description").html('<span class="glyphicon glyphicon-minus"></span> Trade Description');
      });

      jQuery("#collapseImages").on("hide.bs.collapse", function () {
        jQuery(".images").html('<span class="glyphicon glyphicon-plus"></span> Trade Images');
      });
      jQuery("#collapseImages").on("show.bs.collapse", function () {
        jQuery(".images").html('<span class="glyphicon glyphicon-minus"></span> Trade Images');
      });


      jQuery("#collapseHistory").on("hide.bs.collapse", function () {
        jQuery(".history").html('<span class="glyphicon glyphicon-plus"></span> This Trade History');
      });
      jQuery("#collapseHistory").on("show.bs.collapse", function () {
       jQuery(".history").html('<span class="glyphicon glyphicon-minus"></span> This Trade History');
      });


    });
  }


 

  /*******************************************************?
  // GET TRADE
  /*******************************************************/
  private getATrade(tradeId: number) {

    this.tradeApiService.getSingleTrade(tradeId)
      .subscribe((tradeResult: Trade) => {
        this.trade = this.TransformData(tradeResult);
    }, (serviceError: Response) => this.onError(serviceError, "getTheTrade"));

  }


  /*******************************************************?
 // GET IMAGES
 /*******************************************************/
  private getTradeImages(tradeId: number) {
    this.imageServise.getImagesByTradeId(tradeId)
      .subscribe((returnedImages: Image[]) => {
          this.images = returnedImages;
          if (this.images !== null) { this.hasImages = true; }
    }
     , (serviceError: Response) => this.onError(serviceError, "getTradeImages"));
    
  }

  /*******************************************************?
 // GET TRADE HISTORY
 /*******************************************************/
  private getTradeHistory(tradeId: number) {
    this.tradeHistoryService.getTradeHistoryByTradeId(tradeId)
      .subscribe((returnedHistories: TradeHistory[]) => {
        this.data = returnedHistories,
        this.onChangeTable(this.config)
    }, (serviceError: Response) => this.onError(serviceError, "getTradeHistory"));
  }



  private TransformData(returnedTrade: Trade): Trade {     

    let trd = new Trade;
      
    trd.tradeId = returnedTrade.tradeId;
    trd.tradeDatePublished = returnedTrade.tradeDatePublished;
    trd.tradeStatus = returnedTrade.tradeStatus;

    trd.traderId = returnedTrade.traderId; 
    trd.traderFullName = returnedTrade.traderFirstName + " " + returnedTrade.traderMiddleName + " " + returnedTrade.traderLastName;

    trd.tradeObjectDescription = returnedTrade.tradeObjects[0].tradeObjectDescription;
    trd.tradeObjectCategoryDescription = returnedTrade.tradeObjects[0].tradeObjectCategoryDescription;

    returnedTrade.tradeForObjects.forEach(function (returnedTrade) {
            trd.tradeForObjectsDescription = trd.tradeForObjectsDescription + returnedTrade.tradeForObjectDescription + ",";
    });
   
    return trd;
  }



  private onError(serviceError: any, operation: string) {

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

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
  private isTradeIdAsc = true;
  private isDateAsc = true;
  private isStatusAsc = true;

  private sortId: string = 'desc'
  private sortTradeId: string = 'desc';
  private sortStatus: string = 'desc';
  private sortDate: string = 'desc';

  private data: Array<any> = [];              // full data from the server
  public historyrows: Array<any> = [];      // rows passed to the table
  public maxSize: number = 5;
  public numPages: number = 1;

  public columns: Array<any> =
  [  
    { title: 'Created Date', name: 'createdDate', sort: true, filtering: { filterString: '', placeholder: 'Filter by history date.' } },
    { title: 'Action', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by history action.' } }
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
    this.historyrows = sortedData;
    this.config.totalItems = sortedData.length;
  }


  private sortTable(column: string) {
    // reset the array of columns
    this.config.sorting.columns = [];

    switch (column) {

      case 'createdDate':
        this.config.sorting.columns = [{ name: 'createdDate', sort: this.sortDate }];
        this.onChangeTable(this.config);
        this.isDateAsc = !this.isDateAsc;
        this.sortDate = this.isDateAsc ? 'desc' : 'asc';
        break;

      case 'status':
        this.config.sorting.columns = [{ name: 'status', sort: this.sortStatus }];
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

}