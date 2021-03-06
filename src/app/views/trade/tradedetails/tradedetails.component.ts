import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { ChangeDetectorRef } from '@angular/core';

import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { PersonalDetailsService } from '../../../services/personaldetails/personaldetails.service';
import { ImageService } from '../../../services/image/image.service';
import { TradeHistoryService } from '../../../services/tradehistory/trade-history.service';

import { UserSession, UserIdentity, Authentication, Trade, PageTitle, Image, TradeHistory, PersonalDetails } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-tradedetails',
  templateUrl: './tradedetails.component.html',
  styleUrls: ['./tradedetails.component.scss']
})


export class TradeDetailsComponent implements OnInit {

  public traderId: string;
  public tradeId: number = 0;
  public trade: Trade;
  public images: Image[];
  public histories: TradeHistory[];
  public hasHistory: boolean = false;
  public hasImages: boolean = false; 
  public hasImage1: boolean = true;
  public hasImage2: boolean = true;
  public hasImage3: boolean = true;
  public session: UserSession;

  public isAuthenticated: boolean = false;
  public isRequesting: boolean = false;
  public canUserTrade: boolean = false;
  public isNewTrade: boolean = false;
  public isFirstLoad: boolean = false;
  public hasPersonal: boolean = false;
  public isTradeOpen: boolean = false;

  constructor(  
    private cd: ChangeDetectorRef,
    private tradeApiService: TradeApiService,
    private imageServise: ImageService, 
    private tradeHistoryService: TradeHistoryService,
    private personalService: PersonalDetailsService,
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
      this.isNewTrade = params['isNewTrade'];      
              
        this.getUserSession();
        this.initialiseComponent();

      if (this.isNewTrade) {
        this.messagesService.emitProcessMessage("PMSAT");              
      }

        // starts with gettrade end up with get images separatelly
        this.getATrade(this.tradeId);

        if (this.isAuthenticated) { this.getPersonalDetails(this.traderId); }
    });
  }


  ngAfterViewInit() {

    jQuery(document).ready(function () {

      jQuery("#tradeDetails").on("hide.bs.collapse", function () {
        jQuery(".tradedetails").html('<span class="glyphicon glyphicon-plus"></span><span class="textlightcoral medium text-uppercase"> Trade Details</span>');
      });
      jQuery("#tradeDetails").on("show.bs.collapse", function () {
        jQuery(".tradedetails").html('<span class="glyphicon glyphicon-minus"></span><span class="textlightcoral medium text-uppercase"> Trade Details</span>');
      });

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
  public getATrade(tradeId: number) {
    this.isRequesting = true;

    this.tradeApiService.getSingleTrade(tradeId)
      .subscribe((tradeResult: Trade) => {       
        this.onSuccessTrade(tradeResult);

      }, (serviceError: Response) => this.onError(serviceError, "getATrade"));
  }



  public onSuccessTrade(trade: Trade) {

    this.trade = this.TransformData(trade); 

    if (this.trade.status === "Open") { this.isTradeOpen = true; }

    this.hasImages = true;

    // business rule: trader viewing his trade can not add history
    if (sessionStorage["UserSession"] != "null") {
      // logged in
      if (this.trade.traderId !== this.session.userIdentity.userId) { this.canUserTrade = true; }
      
      if (this.isNewTrade) { this.getTradeHistory(this.tradeId); }
      else { this.addHistoryRecord(trade, "Internal"); }
    }
    else {   
      // if not logged on, the viewer is an "External"
      this.addHistoryRecord(trade, "External"); 
    }

    // reset the flag here so the history is not written twice when the trade is created
    this.isNewTrade = false;
  }



/*******************************************************/
// ADD HISTORY RECORD
/*******************************************************/
  public addHistoryRecord(trade:Trade, viewer:string) {

    // create new trdae history
    let trhis: TradeHistory = new TradeHistory();

    let dt: Date = new Date();
    trhis.createdDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds());
    trhis.status = "Viewed";
    trhis.tradeId = trade.tradeId;
    if (viewer === "Internal") {
      if (this.session.userIdentity.userId == trade.traderId) { trhis.viewer = "Owner"; }
      else { trhis.viewer = "Trader"; }
    }
    else { trhis.viewer  = viewer;}


    this.tradeHistoryService.addTradeHistory(trhis)
      .subscribe((returnedHistory: TradeHistory) => {
        this.onSuccessAddHistory(returnedHistory);
      }, (serviceError: Response) => this.onError(serviceError, "addHistoryRecord"));
  }


  public onSuccessAddHistory(history: TradeHistory) {    
    // now get the new history as it is limited to 10 per trade
    this.getTradeHistory(this.tradeId); 
  }



/*******************************************************
// GET TRADE HISTORY
/*******************************************************/
  public getTradeHistory(tradeId: number) {
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
  public getTradeImages(tradeId: number) {
  this.imageServise.getImagesByTradeId(tradeId)
    .subscribe((returnedImages: Image[]) => {    
      this.onSuccessGetImages(returnedImages);
      if (this.images !== null) { this.hasImages = true; }
    }
    , (serviceError: Response) => this.onError(serviceError, "getTradeImages"));

}


  public onSuccessGetImages(images: Image[]) {
    this.isRequesting = false;

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
  // HELPER METHODS
  //*****************************************************
  public getUserSession() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.isAuthenticated = this.session.authentication.isAuthenticated;
        this.traderId = this.session.userIdentity.userId;
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  // initialise component
  public initialiseComponent() {
    this.pageTitleService.emitPageTitle(new PageTitle("Trade Details"));
    this.messagesService.emitRoute("nill");
  }


  // transform the data in fom we need
  public TransformData(returnedTrade: Trade): Trade {     

    let trd = new Trade;
      
    trd.tradeId = returnedTrade.tradeId;
    trd.datePublished = returnedTrade.datePublished;
    trd.status = returnedTrade.status;
    trd.name = returnedTrade.name;
    trd.description = returnedTrade.description;  
    trd.tradeFor = returnedTrade.tradeFor;        

    trd.place = returnedTrade.place;
    trd.state = returnedTrade.state;
    trd.postcode = returnedTrade.postcode;    
    trd.category = returnedTrade.category; 

    trd.traderId = returnedTrade.traderId; 
    trd.traderFullName = returnedTrade.traderFirstName + " " + returnedTrade.traderMiddleName + " " + returnedTrade.traderLastName;

    return trd;
  }



  //****************************************************
  // LOGGING METHODS
  //****************************************************
  public onError(serviceError: any, operation: string) {

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



  /**********************************************/
  //ngx-pagination section
  /***********************************************/
  public isDateAsc = true;
  public sortDate: string = 'desc';

  public data: Array<any> = [];              // full data from the server
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


  public onPageChange(passedpage: number) {

    this.config.currentPage = passedpage;
  }


  public onChangeTable(config: any, page: any = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }) {
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


  public sortTable(column: string) {
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