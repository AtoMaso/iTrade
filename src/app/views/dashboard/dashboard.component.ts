import { Component, OnInit } from '@angular/core';

import { TradeApiService } from '../../services/tradeapi.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { SpinnerOneComponent } from '../../blocks/spinner/spinnerone.component';
import { CSSCarouselComponent } from '../controls/carousel.component';
import { TopTradesPipe, SortTradesByDatePipe } from '../../helpers/pipes';
import { PageTitle, Trade } from '../../helpers/classes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})

export class DashboardComponent implements OnInit {

  private pagetitle: PageTitle;
  private trades: Trade[]  = [];
  private isRequesting: boolean;
  private itself: DashboardComponent = this;

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
    this.getTrades();
  }

 

  //*****************************************************
  // GET Trades here TODO
  //*****************************************************
  getTrades() {
          this.tradeapiService.getTradesLocal()
              .subscribe(
                    (data: Trade[]) => { this.trades = data, this.isRequesting = false }
                    , (data: Response) => this.onError(data));
  }


  //******************************************************
  // PRIVATE METHODS
  //******************************************************
  // an error has occured
  private onError(data: any) {

    // stop the spinner
    this.isRequesting = false;

    // we will log the error in the server side by calling the logger, or that is already 
    // done on the server side if the error has been caught
    this.loggerService.logErrors(data, "dashboard page");

    // we will display a fiendly process message using the process message service             
    this.messagesService.emitProcessMessage("PMGA");


  } 
}