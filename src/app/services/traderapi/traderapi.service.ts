import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

import { AuthenticationService } from '../authentication/authentication.service';
import { Trader } from '../../helpers/classes';

let tradersUrl = CONFIG.baseUrls.traders;
let traderByTraderIdUrl = CONFIG.baseUrls.traderbytraderid;
let updateTraderUrl = CONFIG.baseUrls.updatetrader;
let addTraderUrl = CONFIG.baseUrls.addtrader;
let deleteTraderUrl = CONFIG.baseUrls.deletetrader;


@Injectable()
export class TraderApiService {
  private localUrl: string;

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


    // TODO To change the HTTP to HTTClient
    //******************************************************
    // GET TRADERS
    //******************************************************
    public getTraders(): any {
      
       // prepare the headesrs
       const httpOptions = {
         headers: new HttpHeaders({
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
         })
      };

       this.localUrl = tradersUrl; 
       //return this.httpService.get(this.localUrl, { headers: headers });          
        return this.httpClientService.get(this.localUrl, httpOptions).retry(1);
    }



    // page of members
    public getSetOfTraders(page: number, perpage: number) {
     
       // prepare the headesrs
        const httpOptions = {
          headers: new HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
          })
      };

        this.localUrl = tradersUrl + "?page=" + page + "&perpage=" + perpage;
        return this.httpClientService.get(this.localUrl, httpOptions).retry(1);           
         
    }


    //******************************************************
    // GET TRADER
    //******************************************************
    public getTraderByTraderId(traderid: string): any {

      // prepare the headesrs
      const httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
        })
      };
      
      this.localUrl = `${traderByTraderIdUrl}?traderId=${traderid}`;
      return this.httpClientService.get(this.localUrl);             
     
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

      // prepare the headesrs
      const httpOptions = {
          headers: new HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
          })
      };

      return this.httpClientService.post(addTraderUrl, trader, httpOptions);              
            
    }


    //******************************************************
    // REMOVE TRADER
    //******************************************************
    public removeTrader(traderId: string) {

       // prepare the headesrs
      const httpOptions = {
            headers: new HttpHeaders({
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
            })
      };

      this.localUrl = deleteTraderUrl + "?traderId=" + traderId;
      return this.httpClientService.delete(this.localUrl, httpOptions);                         
    }

  
}
