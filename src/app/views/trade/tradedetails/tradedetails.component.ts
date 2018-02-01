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

import {Trade, PageTitle, Image, TradeHistory } from '../../../helpers/classes';

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
  private hasImages: boolean = false;
 

  constructor(  
    private tradeApiService: TradeApiService,
    private imageServise: ImageService, 
    private tradeHistoryService: TradeHistoryService,
    private route: ActivatedRoute,    
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) {

    this.route.queryParams.subscribe(params => { this.tradeId = params['id']; });
  };


  ngOnInit() {
    this.setupPage(); 
    this.getTheTrade(this.tradeId); 
    this.getTradeImages(this.tradeId);
    this.getTradeHistory(this.tradeId);
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
        jQuery(".history").html('<span class="glyphicon glyphicon-plus"></span> Trade History');
      });
      jQuery("#collapseHistory").on("show.bs.collapse", function () {
        jQuery(".history").html('<span class="glyphicon glyphicon-minus"></span> Trade History');
      });


    });
  }


  private setupPage() {
    this.pageTitleService.emitPageTitle(new PageTitle("Trade Details"));
    this.messagesService.emitRoute("nill");    
  }

  /*******************************************************?
  // GET TRADE
  /*******************************************************/
  private getTheTrade(tradeId: number) {
    this.tradeApiService.getSingleTradeApi(tradeId).subscribe((tradeResult: Trade) => {
      this.trade = this.TransformData(tradeResult);
    }, (serviceError: Response) => this.onError(serviceError, "getTheTrade"));
  }


  /*******************************************************?
 // GET IMAGES
 /*******************************************************/
  private getTradeImages(tradeId: number) {
    this.imageServise.getImagesByTradeId(tradeId).subscribe((returnedImages: Image[]) => {
      this.images = returnedImages;
      if (this.images !== null) { this.hasImages = true; }
    }
     , (serviceError: Response) => this.onError(serviceError, "getTradeImages"));
    
  }

  /*******************************************************?
 // GET TRADE HISTORY
 /*******************************************************/
  private getTradeHistory(tradeId: number) {
    this.tradeHistoryService.getTradeHistoryByTradeId(tradeId).subscribe((returnedHistories: TradeHistory[]) => {
      this.histories = returnedHistories;      
    }, (serviceError: Response) => this.onError(serviceError, "getTradeHistory"));
  }


  private TransformData(returnedTrade: Trade): Trade {     

    let trd = new Trade;
    
    trd.tradeIdStr = returnedTrade.tradeId.toString();
    trd.tradeId = returnedTrade.tradeId;
    trd.tradeDatePublished = returnedTrade.tradeDatePublished;

    trd.traderId = returnedTrade.traderId;
    trd.traderFirstName = returnedTrade.traderFirstName;
    trd.traderMiddleName = returnedTrade.traderMiddleName;
    trd.traderLastName = returnedTrade.traderLastName;
    trd.traderFullName = trd.traderFirstName + " " + trd.traderMiddleName + " " + trd.traderLastName;

    trd.tradeObjectDescription = returnedTrade.tradeObjects[0].tradeObjectDescription;
    trd.tradeObjectCategoryDescription = returnedTrade.tradeObjects[0].tradeObjectCategoryDescription;

    returnedTrade.tradeForObjects.forEach(function (returnedTrade) {
            trd.tradeForObjectsDescription = trd.tradeForObjectsDescription + returnedTrade.tradeForObjectDescription + ",";
    });

    //trd.images = returnedTrade.images;

    if (returnedTrade !== null) {
      this.hasImages = true;
    }
    return trd;
  }



  private onError(serviceError: any, operation: string) {

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

    if (serviceError.error.ModelState !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }
    else { this.messagesService.emitProcessMessage("PMGT"); }

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

  private sortId: string = 'desc'
  private sortTitle: string = 'desc';
  private sortTitleFor: string = 'desc';
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
    { title: 'Id', name: 'tradeIdStr', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade id' } },
    { title: 'Trading', name: 'tradeObjectDescription', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade object description' } },
    { title: 'For', name: 'tradeForObjectsDescription', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade for object description' } },
    { title: 'Category', name: 'tradeObjectCategoryDescription', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade category' } },
    { title: 'Trader', name: 'traderFullName', sort: true, filtering: { filterString: '', placeholder: 'Filter by trader full name.' } },
    { title: 'Published', name: 'tradeDatePublished', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade date.' } }
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

  private onPageChange(passedpage: number) {

    this.config.currentPage = passedpage;

    //let rem = this.config.totalItems % this.config.itemsPerPage;
    //let mainPart = ~~(this.config.totalItems / this.config.itemsPerPage);


    //if (this.config.totalItems < this.config.itemsPerPage) { this.lastPageOfTheCurrentSet = 1; }
    //else {
    //  if (this.config.totalItems > this.config.itemsPerPage && rem) { this.lastPageOfTheCurrentSet = mainPart + 1; }
    //  else { this.lastPageOfTheCurrentSet = mainPart; }
    //}

    //// togle the next button visibility
    //if (this.lastPageOfTheCurrentSet === this.config.currentPage && this.setsCounter < this.totalNumberOfSets) { this.isNextButton = true; }
    //else { this.isNextButton = false; }

    //// toglle the prev visibility
    //if (this.setsCounter > 1) { this.isPrevButton = true; }
    //else { this.isPrevButton = false; }

  }
}