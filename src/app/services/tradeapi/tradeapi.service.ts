import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/retry'; 

import {AuthenticationService } from '../authentication/authentication.service';
import { Trade, PostTrade } from '../../helpers/classes';

let allTrades = CONFIG.baseUrls.alltrades;
let tradesWithStatus = CONFIG.baseUrls.tradeswithstatus;


let tradesWithSetFilters = CONFIG.baseUrls.tradeswithsetfilters;
let setOfTradesWithSetFilters = CONFIG.baseUrls.setoftradeswithsetfilters;

let limitedTradesWithStatus = CONFIG.baseUrls.limitedtradeswithstatus;
let limitedTradesNoStatus = CONFIG.baseUrls.limitedtradesnostatus;
 
let tradesByTraderIdNoStatus = CONFIG.baseUrls.tradesbytraderidnostatus;
let tradesByTraderIdWithStatus = CONFIG.baseUrls.tradesbytraderidwithstatus;

let setOfTradesWithStatus = CONFIG.baseUrls.setoftradeswithstatus;
let setOfTradesNoStatus = CONFIG.baseUrls.setoftradesnostatus;
let setOfTradesWithStatusForTrader = CONFIG.baseUrls.setoftradeswithstatusfortrader;
let setOfTradesNoStatusForTrader = CONFIG.baseUrls.setoftradesnostatusfortrader;

let trade = CONFIG.baseUrls.trade;
let updateTrade = CONFIG.baseUrls.updatetrade;
let addTrade = CONFIG.baseUrls.addtrade;
let deleteTrade = CONFIG.baseUrls.deletetrade;

@Injectable()
export class TradeApiService {

  private localUrl: string; 
  private newTrade = new PostTrade();

    constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };
 

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

    if (status === "All") { this.localUrl = `${setOfTradesNoStatusForTrader}?traderId=${traderId}&setCounter=${setCounter}&recordsPerSet=${recordsPerSet}`; }
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
  public getAllTradesWithSetFilters(catClicked?: string, subcatClicked?: string, stateClicked?: string, placeClicked?: string, postcodeClicked?:string, suburbClicked?:string) {

    this.localUrl = `${tradesWithSetFilters}?category=${catClicked}&subcategory=${subcatClicked}&state=${stateClicked}&place=${placeClicked}&postcode=${postcodeClicked}&suburbid=${suburbClicked}`; 
    // errors are handled in the component
    return this.httpClientService.get(this.localUrl).retry(1);
}

  public getSetOfTradesWithSetFilters(setCounter: number, recordsPerSet: number, status: string, catClicked?: string, subcatClicked?: string, stateClicked?: string, placeClicked?: string, postcodeClicked?: string, suburbClicked?: string)  {

    this.localUrl = `${setOfTradesWithSetFilters}?setCounter=${setCounter}&recordsPerSet=${recordsPerSet}&status=${status}&category=${catClicked}&subcategory=${subcatClicked}&state=${stateClicked}&place=${placeClicked}&postcode=${postcodeClicked}&suburb=${suburbClicked}`;
    // errors are handled in the component
    return this.httpClientService.get(this.localUrl).retry(1);
  }


  //******************************************************
  // GET TRADE
  //******************************************************
  // get all trades for a trader or all trades in the system
  public getSingleTrade(tradeId: number): any {

     // get single trade by tradeId list
    if (tradeId !== 0 || tradeId !== undefined) { this.localUrl = `${allTrades}/${tradeId}`; }  
  
    // errors are handled in the component
    return this.httpClientService.get(this.localUrl).retry(1);
  }

  //******************************************************
  // ADD TRADE
  //******************************************************
  public AddTrade(trade: PostTrade):Observable<PostTrade> {
    
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
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
  
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
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
 
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
    this.localUrl = `${deleteTrade}?tradeId=${tradeid}`; // DELETE api/trades/DeleteTrade?tradeId=1

    return this.httpClientService.delete<PostTrade>(this.localUrl, httpOptions);    

  }

}
