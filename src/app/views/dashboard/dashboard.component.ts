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
  private hasTrades: boolean = true;
  private hasNoTrades: boolean = false;

  constructor(private tradeApiService: TradeApiService,
                    private titleService: PageTitleService,
                    private messagesService: ProcessMessageService,
                    private loggerService: LoggerService) { }

  ngOnInit() {

    this.titleService.emitPageTitle(new PageTitle("Latest trades"));   
    this.messagesService.emitRoute("nill");

    this.isRequesting = true;          
    // get the top 8 trades by date published in asc order
    this.getFilteredTrades(6, "Open");   
    //this.getLimitedTrades("Open");
  }


  //*****************************************************
  //  GET ALL TRADES
  //*****************************************************
  public getLimitedTrades(status: string): void {
      // call the service to get the data  
    this.tradeApiService.getTradesWithStatusOrAll(status)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) {
          this.hasTrades = false;
          this.isRequesting = false;
          if (!this.hasTrades && !this.hasNoTrades) { this.getLimitedTrades("All"); }     // there are no open trades so get the latest closed ones
          else {
                this.hasTrades = false;
                this.hasNoTrades = true;
          }
        }
        else {
          this.trades = this.TransformData(returnedTrades);
          this.hasTrades = true;
          this.hasNoTrades = false;
          this.isRequesting = false;        
        }
     },
     (res: Response) => this.onError(res, "getTradesApi method"));          
  } 


  //*****************************************************
  //  GET TOP 8 TRADES
  //*****************************************************
  public getFilteredTrades(number: number, status:string): void {
    // call the service to get the data  
    this.tradeApiService.getFilteredTradesWithStatusOrAll(number, status)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) {
              this.hasTrades = false;
              this.isRequesting = false;
              if (!this.hasTrades && !this.hasNoTrades) { this.getFilteredTrades(number, "All"); }     // there are no open trades so get the latest closed ones
              else {
                    this.hasTrades = false;
                    this.hasNoTrades = true;
              }
        }
        else {
          this.trades = this.TransformData(returnedTrades);
          this.hasTrades = true;
          this.hasNoTrades = false;
          this.isRequesting = false;             
        }
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
      trd.datePublished = value.datePublished;    
      trd.status = value.status;
      trd.name = value.name;
      trd.description = value.description;
      trd.categoryDescription = value.categoryDescription;
      trd.tradeFor = value.tradeFor;        

      trd.traderId = value.traderId;
      trd.traderFirstName = value.traderFirstName;
      trd.traderMiddleName = value.traderMiddleName;
      trd.traderLastName = value.traderLastName;
      trd.traderFullName = trd.traderFirstName + " " + trd.traderMiddleName + " " + trd.traderLastName;
   
      trd.Images = value.Images;  

      transformedData.push(trd);

    });
    return transformedData;
  }


  private onError(serviceError: any, operation: string) {
    // stop the spinner if running
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

  // an event from the child carousel component saying that encountered an error
  private ChangeIsRequesting(bool) { this.isRequesting = false;}

}
