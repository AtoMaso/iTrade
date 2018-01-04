import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from '../logger/logger.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Trader, UserSession} from '../../helpers/classes';

let tradersUrl = CONFIG.baseUrls.traders;
let traderUrl = CONFIG.baseUrls.trader;
let updateTraderUrl = CONFIG.baseUrls.updatetrader;
let addTraderUrl = CONFIG.baseUrls.addtrader;
let removeTraderUrl = CONFIG.baseUrls.removetrader;

@Injectable()
export class TraderService {
    private localUrl: string;
    private session: UserSession;

    constructor(private httpService: Http, private loggerService: LoggerService, private authenticationService:AuthenticationService) {

        if (sessionStorage["UserSession"] != "null") {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }  
    };

    //******************************************************
    // GET USERS
    //******************************************************
    public getTraders(id?: number): any {
        let localUrl: string;
        if (id != undefined) { localUrl = `${traderUrl}?TraderId=${id}`}
        else { localUrl = traderUrl; }

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');      
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this.httpService.get(localUrl, { headers: headers })           
            .map((res: Response) => res.json())  
            .catch((err: Response) => this.logError(err, "GetTraders"));
    }

    // page of members
    public getPageOfTraders(page: number, perpage: number) {

        let localUrl = tradersUrl + "?page=" + page + "&perpage=" + perpage;
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');   
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this.httpService.get(localUrl, {headers: headers})          
            .map((res: Response) => res.json())   
            .catch((err: Response) => this.logError(err, "GetTraders"));
    }


    //******************************************************
    // GET USER
    //******************************************************
    public getTrader(id: string): any {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this.httpService.get(`${traderUrl}?TraderId=${id}`, { headers: headers })            
            .map((res: Response) => res.json())  
            .catch((err: Response) => this.logError(err, "GetTrader"));
    }


    //******************************************************
    // UPDATE USER
    //******************************************************
    // this will be on the members details page whcih will be the view
    // and update view with two way databinding


    //******************************************************
    // ADD USER
    //******************************************************
    public addTrader(trader: Trader): any {

      let body = JSON.stringify(trader);
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

        return this.httpService.post(addTraderUrl, body, { headers: headers })                  
                  .map((res: Response) => res.json())
                  .catch((err: Response) => this.logError(err, "AddTrader"));
    }


    //******************************************************
    // REMOVE USER
    //******************************************************
    public removeTrader(traderId: string) {
      let localUrl = removeTraderUrl + "?TraderId=" + traderId;
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this.httpService.delete(localUrl, { headers: headers })         
              .map((res: Response) => res.json())
              .catch(( error:Response) => this.logError(error, "RemoveTrader"));
    }


    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    private logError(err: any, method:string) {
      this.loggerService.logErrors(err, "user.service had an error in the method " + method);   
      return Observable.throw(err);
    }

}
