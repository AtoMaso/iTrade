import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';
import { AuthenticationService } from './authentication.service';
import { Trade, UserSession, UserIdentity} from '../helpers/classes';

let tradesUrl = CONFIG.baseUrls.trades;
let tradeUrl = CONFIG.baseUrls.trade;
let updateTradeUrl = CONFIG.baseUrls.updatetrader
let addTradeUrl = CONFIG.baseUrls.addtrade;
let removeTradeUrl = CONFIG.baseUrls.removetrade;

@Injectable()
export class TradeApiService {
    private localUrl: string;
    private session: UserSession;

    constructor(private httpService: Http, private loggerService: LoggerService, private authenticationService:AuthenticationService) {

        if (sessionStorage["UserSession"] != "null") {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }  
    };


  //******************************************************
  // GET TRADES LOCALLY 
  //******************************************************
  public getTradesLocal(): any {

    return this.httpService.get('../assets/trades.json')

      .map((response: Response) => response.json().data)
      .catch((response: Response) => this.logError(response, "GetTradesLocally"));

  }



    //******************************************************
    // GET TRADES
    //******************************************************
    public getTrades(): any {
      
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');      
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this.httpService.get(tradesUrl, { headers: headers })           
            .map((res: Response) => res.json())  
            .catch((err: Response) => this.logError(err, "GetTrade"));
    }

    // page of members
    public getPageOfTrader(page: number, perpage: number) {

        let localUrl = tradesUrl + "?page=" + page + "&perpage=" + perpage;
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');   
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this.httpService.get(localUrl, {headers: headers})          
            .map((res: Response) => res.json())   
            .catch((err: Response) => this.logError(err, "GetTrades"));
    }


    //******************************************************
    // GET USER
    //******************************************************
    public getTradeById(id: string): any {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this.httpService.get(`${tradeUrl}?TradeId=${id}`, { headers: headers })            
            .map((res: Response) => res.json())  
            .catch((err: Response) => this.logError(err, "GetTrade"));
    }


    //******************************************************
    // UPDATE USER
    //******************************************************
    // this will be on the members details page whcih will be the view
    // and update view with two way databinding


    //******************************************************
    // ADD USER
    //******************************************************
    public addTrader(trade: Trade): any {

      let body = JSON.stringify(trade);
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

        return this.httpService.post(addTradeUrl, body, { headers: headers })                  
                  .map((res: Response) => res.json())
                  .catch((err: Response) => this.logError(err, "AddTrade"));
    }


    //******************************************************
    // REMOVE USER
    //******************************************************
    public removeTrade(tradeId: string) {
      let localUrl = removeTradeUrl + "?TradeId=" + tradeId;
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this.httpService.delete(localUrl, { headers: headers })         
              .map((res: Response) => res.json())
              .catch(( error:Response) => this.logError(error, "RemoveTrade"));
    }


    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    private logError(err: any, method:string) {
      this.loggerService.logErrors(err, "trade.service had an error in the method " + method);   
      return Observable.throw(err);
    }

}
