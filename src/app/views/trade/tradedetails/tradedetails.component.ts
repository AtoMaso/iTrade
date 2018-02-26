import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { ChangeDetectorRef } from '@angular/core';

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
  private trade: Trade;
  private images: Image[];
  private histories: TradeHistory[];
  private hasHistory: boolean = false;
  private hasImages: boolean = false; 
  private hasImage1: boolean = true;
  private hasImage2: boolean = true;
  private hasImage3: boolean = true;
  private session: UserSession;
  private identity: UserIdentity;
  private isRequesting: boolean = false;
  private isAuthenticated: boolean = false;
  private canTrade: boolean = false;
  private flagnew: boolean = false;
  private isFirstLoad: boolean = false;


  constructor(  
    private cd: ChangeDetectorRef,
    private tradeApiService: TradeApiService,
    private imageServise: ImageService, 
    private tradeHistoryService: TradeHistoryService,
    private route: ActivatedRoute,    
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) {
  
  };


  /*******************************************************/
  // Component events
  /*******************************************************/
  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.tradeId = params['id'];
      this.flagnew = params['flagnew'];
    });

    this.getUseridentity();

    this.initialiseComponent(); 
 
    if (this.flagnew) { this.messagesService.emitProcessMessage("PMSAT"); }

    // starts with gettrade end up with get images separatelly
    this.getATrade(this.tradeId);
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
        jQuery(".history").html('<span class="glyphicon glyphicon-plus"></span> Viewing History (max 10)');
      });
      jQuery("#collapseHistory").on("show.bs.collapse", function () {
        jQuery(".history").html('<span class="glyphicon glyphicon-minus"></span> Viewing History (max 10)');
      });


    });

  }


  /*******************************************************/
  // GET A TRADE
  /*******************************************************/
  private getATrade(tradeId: number) {

    this.tradeApiService.getSingleTrade(tradeId)
      .subscribe((tradeResult: Trade) => {
        this.hasImages = true;
        this.onSuccessTrade(tradeResult);

      }, (serviceError: Response) => this.onError(serviceError, "getATrade"));
  }



  private onSuccessTrade(trade: Trade) {

    this.trade = this.TransformData(trade); 

    // business rule: trader viewing his trade can not add history
    if (sessionStorage["UserSession"] != "null") {
      // logged in
      if (this.trade.traderId !== this.session.userIdentity.userId) { this.canTrade = true; }
      // if new and logged on trader is trying to view his trade do not add history ??? TODO
      if (this.flagnew) { this.getTradeHistory(this.tradeId); }
      else { this.addHistoryRecord(trade); }
    }
    else {   
      // if not logged on, we do not now who is the viewer so add history 
      this.addHistoryRecord(trade); 
    }
  
  }



/*******************************************************/
// ADD HISTORY RECORD
/*******************************************************/
  private addHistoryRecord(trade) {

    // create new trdae history
    let trhis: TradeHistory = new TradeHistory();

    let dt: Date = new Date();
    trhis.createdDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds());
    trhis.status = "Viewed";
    trhis.tradeId = trade.tradeId;
    if (sessionStorage["UserSession"] != "null") {
      if (this.session.userIdentity.userId == trade.traderId) { trhis.viewer = "Owner"; }
      else { trhis.viewer = "Trader"; }
    }
    else { trhis.viewer = "External";}



    this.tradeHistoryService.addTradeHistory(trhis)
      .subscribe((returnedHistory: TradeHistory) => {

        this.onSuccessAddHistory(returnedHistory);

      }, (serviceError: Response) => this.onError(serviceError, "addTradeHistory"));
  }


  private onSuccessAddHistory(history: TradeHistory) {    
    // now get the new history as it is limited to 10 per trade
    this.getTradeHistory(this.tradeId); 
  }



/*******************************************************
// GET TRADE HISTORY
/*******************************************************/
  private getTradeHistory(tradeId: number) {
    this.tradeHistoryService.getTradeHistoriesByTradeId(tradeId)
      .subscribe((returnedHistories: TradeHistory[]) => {
        this.hasHistory = true;
        this.isFirstLoad = true;
        this.data = returnedHistories;
        this.onChangeTable(this.config); 

        // now get the images
        this.getTradeImages(tradeId);

      }, (serviceError: Response) => this.onError(serviceError, "getTradeHistory"));

  }



/*******************************************************
  // GET IMAGES 
  /*******************************************************/
  private getTradeImages(tradeId: number) {
  this.imageServise.getImagesByTradeId(tradeId)
    .subscribe((returnedImages: Image[]) => {
      //this.images = returnedImages;
      this.onSuccessGetImages(returnedImages);
      if (this.images !== null) { this.hasImages = true; }
    }
    , (serviceError: Response) => this.onError(serviceError, "getTradeImages"));

}


  private onSuccessGetImages(images:Image[]) {
    this.images = images;
    if (this.images.length == 0) {
      this.hasImages = false;
    }
    else if (this.images.length == 1) {
      this.hasImage2 = false;
      this.hasImage3 = false;
    }
    else if (this.images.length == 2) {
      this.hasImage3 = false;
    }    
  }



  //*****************************************************
  // HELPER METHODS
  //*****************************************************
  private getUseridentity() {
    if (sessionStorage["UserSession"] != "undefined") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.identity = this.session.userIdentity;
        this.isAuthenticated = this.session.authentication.isAuthenticated;       
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }

  // initialise component
  private initialiseComponent() {
    this.pageTitleService.emitPageTitle(new PageTitle("Trade Details"));
    this.messagesService.emitRoute("nill");
  }

  // transform the data in fom we need
  private TransformData(returnedTrade: Trade): Trade {     

    let trd = new Trade;
      
    trd.tradeId = returnedTrade.tradeId;
    trd.datePublished = returnedTrade.datePublished;
    trd.status = returnedTrade.status;
    trd.name = returnedTrade.name;
    trd.description = returnedTrade.description;  
    trd.tradeFor = returnedTrade.tradeFor;        

    trd.place = returnedTrade.place;
    trd.state = returnedTrade.state;
    trd.postcodeId = returnedTrade.postcodeId;
    trd.postcodeNumber = returnedTrade.postcodeNumber;
    trd.categoryDescription = returnedTrade.categoryDescription;
    trd.subcategoryDescription = returnedTrade.subcategoryDescription;

    trd.traderId = returnedTrade.traderId; 
    trd.traderFullName = returnedTrade.traderFirstName + " " + returnedTrade.traderMiddleName + " " + returnedTrade.traderLastName;

    // this where images are taken from the trade
    //trd.Images = returnedTrade.Images;
    //this.images = returnedTrade.Images;
    //if (this.images.length == 0) {
    //  this.hasImages = false;
    //}
    //else if (this.images.length == 1) {
    //  this.hasImage2 = false;
    //  this.hasImage3 = false;
    //}
    //else if (this.images.length == 2) {
    //  this.hasImage3 = false; 
    //}    

    return trd;
  }



  //****************************************************
  // LOGGING METHODS
  //****************************************************
  private onError(serviceError: any, operation: string) {

    this.isRequesting = false;  

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
  private isDateAsc = true;
  private sortDate: string = 'desc';

  private data: Array<any> = [];              // full data from the server
  public rows: Array<any> = [];      // rows passed to the table
  public maxSize: number = 5;
  public numPages: number = 1;

  public columns: Array<any> =
  [  
    { title: 'Created Date', name: 'createdDate', sort: true, filtering: { filterString: '', placeholder: 'Filter by history date.' } }
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

    if (!this.isFirstLoad) {
      let filteredData = this.changeFilter(this.data, this.config);
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

      case 'createdDate':
        this.config.sorting.columns = [{ name: 'createdDate', sort: this.sortDate }];
        this.onChangeTable(this.config);
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