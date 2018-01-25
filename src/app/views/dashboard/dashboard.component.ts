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
  public isRequesting: boolean;

  constructor(private tradeapiService: TradeApiService,
                    private titleService: PageTitleService,
                    private messagesService: ProcessMessageService,
                    private loggerService: LoggerService) { }

  ngOnInit() {

    this.titleService.emitPageTitle(new PageTitle("Latest trades"));   
    this.messagesService.emitRoute("nill");

    this.isRequesting = true;      
    this.getTradesApi()
  }


  //*****************************************************
  //  GET THE TOP TRADES
  //*****************************************************
  public getTradesApi(): void {
      // call the service to get the data  
      this.tradeapiService.getTradesApi().subscribe(
        (response: Trade[]) => {
          this.trades = response;
          this.isRequesting = false;
        },
        (res: Response) => this.onError(res, "getTradesApi method"));          
  } 



  // an error has occured
  private onError(err: any, operation: string) {
    // stop the spinner
    this.isRequesting = false;

    // logg the audit log error
    this.loggerService.addError(err, `${operation} failed: ${err.status},  the URL: ${err.url}, was:  ${err.statusText}`);

    // show the process message
    this.messagesService.emitProcessMessage("PMGTs");
  }

  // an event from the child carousel component saying that encountered an error
  private ChangeIsRequesting(bool) { this.isRequesting = false;}

}
