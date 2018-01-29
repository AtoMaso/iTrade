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
  public getTradesApi(id?: string): Observable<Trade[]> {

    if (id != "" || id != undefined) { this.localUrl = `${tradesUrl}?traderId=${id}`; }     // get trader's list of trades
    if (id == "" || id == undefined) { this.localUrl = tradesUrl; }  // get all trade list

    // errors are handled in the component
    return this.httpClientService.get<Trade[]>(this.localUrl).retry(3);
  }

  // GOOD 
  // gets set of trades, number of pages and number of records per page
  public getPageOfTrades(id: string, page: number = 1, perpage: number = 50) {

    if (id != "" || id != undefined) { this.localUrl = `${pagesOfTradesUrl}?traderId=${id}&page=${page}&perpage=${perpage}`; }  // get trader's list of trade   
    if (id == "" || id == undefined) { this.localUrl = `${pagesOfTradesUrl}?page=${page}&perpage=${perpage}`; }    // get all trade list

   
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
