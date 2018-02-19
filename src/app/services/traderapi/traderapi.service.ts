import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

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
let deleteTraderUrl = CONFIG.baseUrls.deletetrader;


@Injectable()
export class TraderApiService {
    private localUrl: string;
    private session: UserSession;

    constructor(private httpService: Http, private loggerService: LoggerService, private authenticationService:AuthenticationService) {

        if (sessionStorage["UserSession"] != "null") {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }  
    };


    // TODO To change the HTTP to HTTClient
    //******************************************************
    // GET TRADERS
    //******************************************************
    public getTraders(id?: number): any {
      
      if (id != undefined) { this.localUrl = `${traderUrl}?traderId=${id}`}
        else { this.localUrl = traderUrl; }

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');      
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

       //return this.httpService.get(this.localUrl, { headers: headers });          
      return this.httpService.get(this.localUrl);
    }

    // page of members
    public getPageOfTraders(page: number, perpage: number) {

       this.localUrl = tradersUrl + "?page=" + page + "&perpage=" + perpage;
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');   
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

        return this.httpService.get(this.localUrl, { headers: headers });           
         
    }


    //******************************************************
    // GET TRADER
    //******************************************************
    public getTrader(traderid: string): any {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      //return this.httpService.get(`${traderUrl}?traderId=${id}`, { headers: headers });       
      return this.httpService.get(`${traderUrl}?traderId=${traderid}`);             
     
    }


    //******************************************************
    // UPDATE USER
    //******************************************************
    // this will be on the members details page whcih will be the view
    // and update view with two way databinding


    //******************************************************
    // ADD TRADER
    //******************************************************
    public addTrader(trader: Trader): any {

      let body = JSON.stringify(trader);
      let httpheaders = new Headers();
      httpheaders.append('Accept', 'application/json');
      httpheaders.append('Content-Type', 'application/json');
      httpheaders.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this.httpService.post(addTraderUrl, body, { headers: httpheaders });              
            
    }


    //******************************************************
    // REMOVE TRADER
    //******************************************************
    public removeTrader(traderId: string) {
      this.localUrl = deleteTraderUrl + "?traderId=" + traderId;
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this.httpService.delete(this.localUrl, { headers: headers });                         
    }

}
