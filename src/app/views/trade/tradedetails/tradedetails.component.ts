import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';

import {Trade, PageTitle } from '../../../helpers/classes';


@Component({
  selector: 'app-tradedetails',
  templateUrl: './tradedetails.component.html',
  styleUrls: ['./tradedetails.component.scss']
})


export class TradeDetailsComponent implements OnInit {
  private tradeId: number = 0;
  private trade: Trade;
  private hasImages: boolean; =false;

  constructor(  
    private tradeApiService: TradeApiService;
    private route: ActivatedRoute,    
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) {

    this.route.queryParams.subscribe(params => { this.tradeId = params['id']; });
  };

  ngOnInit() {

    this.setupPage(); 
    this.getTheTrade(this.tradeId);
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

    });        
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

    trd.images = returnedTrade.images;

    if (returnedTrade !== null {
      this.hasImages = true;
    }
    return trd;
  }
}