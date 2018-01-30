import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable} from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry'; 

import { LoggerService } from '../logger/logger.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Trade, UserSession, UserIdentity} from '../../helpers/classes';

let tradesUrl = CONFIG.baseUrls.trades;
let pagesOfTradesUrl = CONFIG.baseUrls.pagesoftrades;
let tradeUrl = CONFIG.baseUrls.trade;
let updateTradeUrl = CONFIG.baseUrls.updatetrade;
let addTradeUrl = CONFIG.baseUrls.addtrade;
let removeTradeUrl = CONFIG.baseUrls.removetrade;

@Injectable()
export class TradeApiService {
  private localUrl: string;
  private session: UserSession;

  constructor(
    private httpClientService: HttpClient,
    private loggerService: LoggerService,
    private authenticationService: AuthenticationService) {

    if (sessionStorage["UserSession"] != "null") {
      this.session = JSON.parse(sessionStorage["UserSession"]);
    }
  };



  //******************************************************
  // GET TRADES
  //******************************************************
  //GOOD
  // get all trades for a trader or all trades in the system
  public getTradesApi(traderId?: string): Observable<Trade[]> {

    // get all tardes by traderId
    if (traderId != "" || traderId != undefined) { this.localUrl = `${tradesUrl}?traderId=${traderId}`; }     
     // get all trades in the system
    if (traderId == "" || traderId == undefined) { this.localUrl = tradesUrl; } 

    // errors are handled in the component
    return this.httpClientService.get<Trade[]>(this.localUrl).retry(3);
  }


  // GOOD 
  // gets set of trades, number of pages and number of records per page
  public getPageOfTrades(traderId: string, setCounter: number = 1, recordsPerSet: number = 50) {

    // get trades by traderId or not by get a set orecords only
    this.localUrl = `${pagesOfTradesUrl}?traderId=${traderId}&page=${setCounter}&perpage=${recordsPerSet}`;  
   
    return this.httpClientService.get(this.localUrl).retry(3);
  }


  // GOOD
  // gets filtered set of trades by date published for the dashboard view
  public getFilteredTradesApi(number: number, filter: string) {

    //$select = name, revenue,& $orderby=revenue asc, name desc & $filter=revenue ne null 
    this.localUrl = `${tradesUrl}?number=${number}&filter=${filter}`;

    // errors are handled in the component
    return this.httpClientService.get(this.localUrl).retry(3);
  }


  //******************************************************
  // GET TRADE
  //******************************************************
  // get all trades for a trader or all trades in the system
  public getSingleTradeApi(tradeId: number) {

     // get single trade by tradeId list
    if (tradeId != 0 || tradeId != undefined) { this.localUrl = `${tradesUrl}/${tradeId}`; }  
  
    // errors are handled in the component
    return this.httpClientService.get(this.localUrl).retry(3);
  }

  //******************************************************
  // ADD TRADE
  //******************************************************


  //******************************************************
  // DELETE TRADE
  //******************************************************


  //******************************************************
  // UPDATE TRADE
  //******************************************************


  //*****************************************************
  // HELPER METHODS
  //*****************************************************

}
