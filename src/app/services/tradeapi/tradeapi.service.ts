import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CONFIG } from '../../config';
import { Observable} from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry'; 

import { Trade, PostTrade, UserSession, UserIdentity} from '../../helpers/classes';

let allTrades = CONFIG.baseUrls.alltrades;
let tradesWithStatus = CONFIG.baseUrls.tradeswithstatus;

let tradesWithSetFilters = CONFIG.baseUrls.tradeswithsetfilters;
let setOfTradesWithSetFilters = CONFIG.baseUrls.setoftradeswithsetfilters;

let limitedTradesWithStatus = CONFIG.baseUrls.limitedtradeswithstatus;
let limitedTradesNoStatus = CONFIG.baseUrls.limitedtradesnostatus;
 
let tradesByTraderIdNoStatus = CONFIG.baseUrls.tradesbytraderidnostatus;
let tradesByTraderIdWithStatus = CONFIG.baseUrls.tradesbytraderidwithstatus;

let setOfTradesWithStatus = CONFIG.baseUrls.setoftradeswithstatus;
let setOfTradesWithStatusForTrader = CONFIG.baseUrls.setoftradeswithstatusfortrader
let setOfTradesNoStatus = CONFIG.baseUrls.setoftradesnostatus;


let trade = CONFIG.baseUrls.trade;
let updateTrade = CONFIG.baseUrls.updatetrade;
let addTrade = CONFIG.baseUrls.addtrade;
let deleteTrade = CONFIG.baseUrls.deletetrade;

@Injectable()
export class TradeApiService {

  private args: RequestOptionsArgs;
  private localUrl: string; 
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private token: string;
  private newTrade = new PostTrade();

  constructor(
    private httpClientService: HttpClient ) { };
 

  //******************************************************
  // WITH STATUS or ALL
  //******************************************************
  //GOOD
  // get all trades for a trader or all trades in the system  GetTradesByTraderIdWithStatus
  public getTradesWithStatusOrAll(traderId: string, status: string) :  Observable<Trade[]> {
    if (status === "All") {
      if (traderId != "" || traderId != undefined) { this.localUrl = `${tradesByTraderIdNoStatus}?traderId=${traderId}`; }
      // get all trades in the system
      if (traderId == "" || traderId == undefined) { this.localUrl = allTrades; } 
    }
    else {  
      // get all tardes by traderId
      if (traderId != "" || traderId != undefined) { this.localUrl = `${tradesByTraderIdWithStatus}?traderId=${traderId}&status=${status}`; }
      // get all trades in the system
      if (traderId == "" || traderId == undefined) { this.localUrl = `${tradesWithStatus}?status=${status}`; }
    }

    // errors are handled in the component
    return this.httpClientService.get<Trade[]>(this.localUrl).retry(1);
  }


  //******************************************************
  // PAGES WITH STATUS and/or TRADER
  //******************************************************
  //GOOD
  // gets set of trades, number of pages and number of records per page with status OPEN
  public getSetOfTradesWithStatusForTrader(traderId: string, setCounter: number, recordsPerSet: number, status: string) {

    if (status === "All") { this.localUrl = `${setOfTradesNoStatus}?traderId=${traderId}&setCounter=${setCounter}&recordsPerSet=${recordsPerSet}`; }
    else { this.localUrl = `${setOfTradesWithStatusForTrader}?traderId=${traderId}&setCounter=${setCounter}&recordsPerSet=${recordsPerSet}&status=${status}`; }
                                               
    return this.httpClientService.get(this.localUrl).retry(3);
  }


  // gets set of trades, number of pages and number of records per page with status OPEN
  public getSetOfTradesWithStatus(setCounter: number, recordsPerSet: number, status: string) {

    if (status === "All") { this.localUrl = `${setOfTradesNoStatus}?setCounter=${setCounter}&recordsPerSet=${recordsPerSet}`; }
    else { this.localUrl = `${setOfTradesWithStatus}?setCounter=${setCounter}&recordsPerSet=${recordsPerSet}&status=${status}`; }

    return this.httpClientService.get(this.localUrl).retry(3);
  }


  //******************************************************
  //LIMITED NUMBER WITH STATUS or NO STATUS
  //******************************************************
  // GOOD
  // gets limited number of trades by date published for the dashboard view and they are with status =OPEN
  public getLimitedNumberOfTradesTradesWithStatusOrAll(number: number, status:string ) {

    if (status === "All") { this.localUrl = `${limitedTradesNoStatus}?number=${number}`; }
    else  { this.localUrl = `${limitedTradesWithStatus}?number=${number}&status=${status}`; }
   
    // errors are handled in the component
    return this.httpClientService.get(this.localUrl).retry(1);
  }



  //******************************************************
  // SET FILTERS - SET or ALL
  //******************************************************
  public getAllTradesWithSetFilters(catIdClicked?: number, subcatIdClicked?: number, stateIdClicked?: number, placeIdClicked?: number) {

    this.localUrl = `${tradesWithSetFilters}?categoryId=${catIdClicked}&subcategoryId=${subcatIdClicked}&stateId=${stateIdClicked}&placeid=${placeIdClicked}`; 
    // errors are handled in the component
    return this.httpClientService.get(this.localUrl).retry(1);
}

  public getSetOfTradesWithSetFilters(setCounter: number, recordsPerSet: number, status: string, catIdClicked?: number, subcatIdClicked?: number, stateIdClicked?: number, placeIdClicked?: number)  {

    this.localUrl = `${setOfTradesWithSetFilters}?setCounter=${setCounter}&recordsPerSet=${recordsPerSet}&status=${status}&categoryId=${catIdClicked}&subcategoryId=${subcatIdClicked}&stateId=${stateIdClicked}&placeid=${placeIdClicked}`;
    // errors are handled in the component
    return this.httpClientService.get(this.localUrl).retry(1);
  }


  //******************************************************
  // GET TRADE
  //******************************************************
  // get all trades for a trader or all trades in the system
  public getSingleTrade(tradeId: number): any {

     // get single trade by tradeId list
    if (tradeId != 0 || tradeId != undefined) { this.localUrl = `${allTrades}/${tradeId}`; }  
  
    // errors are handled in the component
    return this.httpClientService.get(this.localUrl).retry(1);
  }

  //******************************************************
  // ADD TRADE
  //******************************************************
  public AddTrade(trade: PostTrade):Observable<PostTrade> {
    // get the session details
    this.getUseridentity(); 

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    // post the trade
    this.localUrl = addTrade;  
    return this.httpClientService.post<PostTrade>(this.localUrl, trade, httpOptions);    
  }



  //******************************************************
  // UPDATE TRADE
  //******************************************************
  public UpdateTrade(trade: Trade): Observable<Trade>{
    // get the session details
    this.getUseridentity();

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    // post the trade
    this.localUrl = updateTrade + trade.tradeId;
    return this.httpClientService.put<Trade>(this.localUrl, trade, httpOptions);    
  }



  //******************************************************
  // DELETE TRADE
  //******************************************************
  public DeleteTrade(tradeid:number): Observable<PostTrade> {
    // get the session details
    this.getUseridentity();

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    this.localUrl = `${deleteTrade}?tradeId=${tradeid}`; // DELETE api/trades/DeleteTrade?tradeId=1

    return this.httpClientService.delete<PostTrade>(this.localUrl, httpOptions);    

  }


  //*****************************************************
  // HELPER METHODS
  //*****************************************************
  private getUseridentity() {
    if (sessionStorage["UserSession"] != "null") {    
        this.session = JSON.parse(sessionStorage["UserSession"])       
        this.identity = this.session.userIdentity;   
        this.token = this.identity.accessToken;      
    }
  }
}
