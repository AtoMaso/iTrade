import { Component, OnInit } from '@angular/core';

import { TradeApiService } from '../../services/tradeapi.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { SpinnerOneComponent } from '../../blocks/spinner/spinnerone.component';
import { TopTradesPipe, SortTradeByDatePipe } from '../../helpers/pipes';
import { PageTitle, Trade } from '../../helpers/classes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})

export class DashboardComponent implements OnInit {

  private pagetitle: PageTitle;
  private trades: Trade[] = [];
  private isRequesting: boolean;
  private itself: DashboardComponent = this;

  constructor(private tradeService: TradeApiService,
                    private titleService: PageTitleService,
                    private messagesService: ProcessMessageService,
                    private loggerService: LoggerService) { }

  ngOnInit() {
    this.pagetitle = new PageTitle();
    this.pagetitle.title = "Latest trades";
    this.messagesService.emitRoute("nill");

    this.titleService.emitPageTitle(this.pagetitle);  
    this.isRequesting = true;    
    this.getTradesLocal();
  }

 

  //*****************************************************
  // GET Trades here TODO
  //*****************************************************
  getTradesLocal(): void {
          this.tradeService.getTrades()
                .subscribe(
                (res: Trade[]) => {
                  this.trades = res.slice(1, 6),
                    this.isRequesting = false
                }
                , (res: Response) => this.onError(res));
  }


  //******************************************************
  // PRIVATE METHODS
  //******************************************************
  // an error has occured
  private onError(res: any) {

    // stop the spinner
    this.isRequesting = false;

    // we will log the error in the server side by calling the logger, or that is already 
    // done on the server side if the error has been caught
    this.loggerService.logErrors(res, "dashboard page");

    // we will display a fiendly process message using the process message service             
    this.messagesService.emitProcessMessage("PMGA");


  } 
}