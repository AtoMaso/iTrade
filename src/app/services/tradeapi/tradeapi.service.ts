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

let allTrades = CONFIG.baseUrls.alltrades;
let allTradesWithStatus = CONFIG.baseUrls.alltradesWithStatus;

let allTradesByTraderId = CONFIG.baseUrls.alltradesbytraderid;
let allTradesByTraderIdWithStatus = CONFIG.baseUrls.alltradesbytraderidwithstatus;

let pagesOfTradesWithStatus = CONFIG.baseUrls.pagesoftradeswithstatus;
let pagesOfTradesAll = CONFIG.baseUrls.pagesoftradesall;

let filteredTradesWithStatus = CONFIG.baseUrls.filteredtradeswithstatus;
let filteredTradesAll = CONFIG.baseUrls.filteredtradesall;

let trade = CONFIG.baseUrls.trade;
let updateTrade = CONFIG.baseUrls.updatetrade;
let addTrade = CONFIG.baseUrls.addtrade;
let removeTrade = CONFIG.baseUrls.removetrade;

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
  public getTradesWithStatusOrAll(traderId?: string, status: string = "Open"): Observable<Trade[]> {
    if (status === "All") {
      if (traderId != "" || traderId != undefined) { this.localUrl = `${allTradesByTraderId}?traderId=${traderId}`; }
      // get all trades in the system
      if (traderId == "" || traderId == undefined) { this.localUrl = allTrades; } 
    }
    else {  
      // get all tardes by traderId
      if (traderId != "" || traderId != undefined) { this.localUrl = `${allTradesByTraderIdWithStatus}?traderId=${traderId}&statsu=${status}`; }
      // get all trades in the system
      if (traderId == "" || traderId == undefined) { this.localUrl = allTradesWithStatus; }
    }

    // errors are handled in the component
    return this.httpClientService.get<Trade[]>(this.localUrl).retry(3);
  }



  // gets set of trades, number of pages and number of records per page with status OPEN
  public getPageOfTradesWithStatusOrAll(traderId: string, setCounter: number = 1, recordsPerSet: number = 50, status: string) {

    if (status === "All") { this.localUrl = `${pagesOfTradesAll}?traderId=${traderId}&page=${setCounter}&perpage=${recordsPerSet}`; }
    else  { this.localUrl = `${pagesOfTradesWithStatus}?traderId=${traderId}&page=${setCounter}&perpage=${recordsPerSet}&status=${status}`; }

    return this.httpClientService.get(this.localUrl).retry(3);
  }


  // GOOD
  // gets filtered set of trades by date published for the dashboard view and they are with status =OPEN
  public getFilteredTradesWithStatusOrAll(number: number, status:string) {

    if (status === "All") { this.localUrl = `${filteredTradesAll}?number=${number}`; }
    else  { this.localUrl = `${filteredTradesWithStatus}?number=${number}&status=${status}`; }
   
    // errors are handled in the component
    return this.httpClientService.get(this.localUrl).retry(3);
  }



  //******************************************************
  // GET TRADE
  //******************************************************
  // get all trades for a trader or all trades in the system
  public getSingleTrade(tradeId: number): any {

     // get single trade by tradeId list
    if (tradeId != 0 || tradeId != undefined) { this.localUrl = `${allTrades}/${tradeId}`; }  
  
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
