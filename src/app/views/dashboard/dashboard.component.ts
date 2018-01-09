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

  private trades: Trade[]  = [];
  public isGettingData: boolean;

  constructor(private tradeapiService: TradeApiService,
                    private titleService: PageTitleService,
                    private messagesService: ProcessMessageService,
                    private loggerService: LoggerService) { }

  ngOnInit() {

    this.titleService.emitPageTitle(new PageTitle("Latest trades"));   
    this.messagesService.emitRoute("nill");

    this.isGettingData = true;      
    this.getTradesApi()
  }


  //*****************************************************
  //  GET THE TOP TRADES
  //*****************************************************
  public getTradesApi(): void {

    try {

      this.tradeapiService.getTradesApi().subscribe(
        (response: Trade[]) => {
          this.trades = response;
          this.isGettingData = false;
        });
       
    }
    catch (err) {
      this.handleError("getTradesApi method", err);
    }
  } 



  //*****************************************************
  // PRIVATE METHODS
  //*****************************************************
  //@param operation - name of the operation that failed
  //@param result - optional value to return as the observable result
  private handleError(operation, err: HttpErrorResponse) {

    // write a message to the console
    console.error(`Backend returned code in getImages component method calling the image service!`);
    
    // audit log the error on the server side
    this.loggerService.addError(err, `${operation} failed: ${err.status},  the URL: ${err.url}, was:  ${err.statusText}`);
   
    this.isGettingData = false; 

    // images can not be retrieved, so friendly message to be displayed
    this.messagesService.emitProcessMessage("PMGTs");
  }


  // an event from the child carousel component saying that encountered an error
  private ChangeIsRequesting(bool) {
    
    this.isGettingData = false;

  }

}
