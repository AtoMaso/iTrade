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
import { CSSCarouselComponent } from '../controls/carousel//carousel.component';
import { TopTradesPipe, SortTradesByDatePipe } from '../../helpers/pipes';
import { PageTitle, Trade } from '../../helpers/classes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})

export class DashboardComponent implements OnInit {

  private itSelf: DashboardComponent = this;
  private pagetitle: PageTitle;
  private trades: Trade[]  = [];
  public isRequesting: boolean;

  constructor(private tradeapiService: TradeApiService,
                    private titleService: PageTitleService,
                    private messagesService: ProcessMessageService,
                    private loggerService: LoggerService) { }

  ngOnInit() {
    this.pagetitle = new PageTitle();
    this.pagetitle.title = "Latest trades";
    this.messagesService.emitRoute("nill");

    this.titleService.emitPageTitle(this.pagetitle);   
    this.isRequesting = true;      
    this.getTradesApi()
  }


  //*****************************************************
  //  GET THE TOP TRADES
  //*****************************************************
  public getTradesApi(): void {

    try {

      this.tradeapiService.getTradesApi().subscribe((response: Trade[]) => { this.trades = response, this.isRequesting = false });
       
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
   
    this.isRequesting = false;

    // images can not be retrieved, so friendly message to be displayed
    this.messagesService.emitProcessMessage("PMGI");
  }


  // an event from the child saying that was an error in it
  private ChangeIsRequesting() {
    this.isRequesting = false;
  }

}
