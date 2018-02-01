import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { TradeApiService } from '../../services/tradeapi/tradeapi.service';
import { LoggerService } from '../../services/logger/logger.service';
import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';

import { SpinnerOneComponent } from '../controls/spinner/spinnerone.component';
import { CarouselComponent } from '../controls/carousel//carousel.component';
import { TopTradesPipe, SortTradesByDatePipe } from '../../helpers/pipes';
import { PageTitle, Trade } from '../../helpers/classes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})

export class DashboardComponent implements OnInit {

  //private trades: Trade[] = [];
  private trades: Array<any> = [];
  public isRequesting: boolean;

  constructor(private tradeApiService: TradeApiService,
                    private titleService: PageTitleService,
                    private messagesService: ProcessMessageService,
                    private loggerService: LoggerService) { }

  ngOnInit() {

    this.titleService.emitPageTitle(new PageTitle("Latest trades"));   
    this.messagesService.emitRoute("nill");

    this.isRequesting = true;          
    // get the top 6 trades by date published in asc order
    this.getFilteredTrades(8, "tradeDatePublished");
  }


  //*****************************************************
  //  GET ALL TRADES
  //*****************************************************
  public getTrades(): void {
      // call the service to get the data  
    this.tradeApiService.getTradesApi()
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) { this.messagesService.emitProcessMessage("PMNOAs"); } // TODO change the process message code to reflect the trades
        this.trades = this.TransformData(returnedTrades);
        this.isRequesting = false;
     },
     (res: Response) => this.onError(res, "getTradesApi method"));          
  } 


  //*****************************************************
  //  GET TOP 8 TRADES
  //*****************************************************
  public getFilteredTrades(number: number, filter:string): void {
    // call the service to get the data  
    this.tradeApiService.getFilteredTradesApi(number, filter)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) { this.messagesService.emitProcessMessage("PMNOAs"); } // TODO change the process message code to reflect the trades
        this.trades = this.TransformData(returnedTrades);
        this.isRequesting = false;
      },
      (res: Response) => this.onError(res, "getTradesApi method"));
  } 


  //*****************************************************
  //  HELPER METHODS
  //*****************************************************
  private TransformData(returnedTrades: Trade[]): Array<any> {

    let transformedData = new Array<Trade>();

    returnedTrades.forEach(function (value) {
      let trd = new Trade;

      trd.tradeId = value.tradeId;
      trd.tradeDatePublished = value.tradeDatePublished;
      trd.traderId = value.traderId;
      trd.traderFirstName = value.traderFirstName;
      trd.traderMiddleName = value.traderMiddleName;
      trd.traderLastName = value.traderLastName;
      trd.traderFullName = trd.traderFirstName + " " + trd.traderMiddleName + " " + trd.traderLastName;
      trd.tradeObjectDescription = value.tradeObjects[0].tradeObjectDescription;
      trd.tradeObjectCategoryDescription = value.tradeObjects[0].tradeObjectCategoryDescription;
      trd.images = value.images; // get the images and pass them to the  carousel child

      value.tradeForObjects.forEach(function (value) {
        trd.tradeForObjectsDescription = trd.tradeForObjectsDescription + value.tradeForObjectDescription + ",";
      });

      transformedData.push(trd);

    });
    return transformedData;
  }


  private onError(serviceError: any, operation: string) {
    // stop the spinner if running
    this.isRequesting = false;

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

    if (serviceError.error.ModelState !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }
    else { this.messagesService.emitProcessMessage("PMGTs"); }

  }

  // an event from the child carousel component saying that encountered an error
  private ChangeIsRequesting(bool) { this.isRequesting = false;}

}
