﻿import { Inject, Injectable, ErrorHandler } from '@angular/core';
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

import { LoggerService } from '../logger/logger.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Trader, UserSession, UserIdentity} from '../../helpers/classes';

let tradersUrl = CONFIG.baseUrls.traders;
let traderByTraderIdUrl = CONFIG.baseUrls.traderbytraderid;
let updateTraderUrl = CONFIG.baseUrls.updatetrader;
let addTraderUrl = CONFIG.baseUrls.addtrader;
let deleteTraderUrl = CONFIG.baseUrls.deletetrader;


@Injectable()
export class TraderApiService {
  private localUrl: string;
  private args: RequestOptionsArgs;
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private token: string;


  constructor(private httpClientService: HttpClient) {
    this.getUseridentity();
  };


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
           'Authorization': `Bearer ${this.token}`
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
            'Authorization': `Bearer ${this.token}`
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
          'Authorization': `Bearer ${this.token}`
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
            'Authorization': `Bearer ${this.token}`
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
              'Authorization': `Bearer ${this.token}`
            })
      };

      this.localUrl = deleteTraderUrl + "?traderId=" + traderId;
      return this.httpClientService.delete(this.localUrl, httpOptions);                         
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
