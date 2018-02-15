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
let allTradesWithStatus = CONFIG.baseUrls.alltradesWithStatus;

let tradesByTraderId = CONFIG.baseUrls.tradesbytraderid;
let tradesByTraderIdWithStatus = CONFIG.baseUrls.tradesbytraderidwithstatus;

let pagesOfTradesWithStatus = CONFIG.baseUrls.pagesoftradeswithstatus;
let pagesOfTradesAll = CONFIG.baseUrls.pagesoftradesall;

let filteredTradesWithStatus = CONFIG.baseUrls.filteredtradeswithstatus;
let filteredTradesAll = CONFIG.baseUrls.filteredtradesall;

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
    private httpClientService: HttpClient,
    private http: Http
  ) { };
 

  //******************************************************
  // GET TRADES
  //******************************************************
  //GOOD
  // get all trades for a trader or all trades in the system  GetTradesByTraderIdWithStatus
  public getTradesWithStatusOrAll(traderId?: string, status: string = "All"): Observable<Trade[]> {
    if (status === "All") {
      if (traderId != "" || traderId != undefined) { this.localUrl = `${tradesByTraderId}?traderId=${traderId}`; }
      // get all trades in the system
      if (traderId == "" || traderId == undefined) { this.localUrl = allTrades; } 
    }
    else {  
      // get all tardes by traderId
      if (traderId != "" || traderId != undefined) { this.localUrl = `${tradesByTraderIdWithStatus}?traderId=${traderId}&status=${status}`; }
      // get all trades in the system
      if (traderId == "" || traderId == undefined) { this.localUrl = allTradesWithStatus; }
    }

    // errors are handled in the component
    return this.httpClientService.get<Trade[]>(this.localUrl).retry(3);
  }


  //GOOD
  // gets set of trades, number of pages and number of records per page with status OPEN
  public getPageOfTradesWithStatusOrAll(traderId: string, setCounter: number = 1, recordsPerSet: number = 50, status: string ="All") {

    if (status === "All") { this.localUrl = `${pagesOfTradesAll}?traderId=${traderId}&page=${setCounter}&perpage=${recordsPerSet}`; }
    else  { this.localUrl = `${pagesOfTradesWithStatus}?traderId=${traderId}&page=${setCounter}&perpage=${recordsPerSet}&status=${status}`; }
                                               
    return this.httpClientService.get(this.localUrl).retry(3);
  }


  // GOOD
  // gets filtered set of trades by date published for the dashboard view and they are with status =OPEN
  public getFilteredTradesWithStatusOrAll(number: number, status:string = "All") {

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
