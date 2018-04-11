import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/retry';


import {AuthenticationService } from '../authentication/authentication.service';
import { Correspondence } from '../../helpers/classes';

let corres = CONFIG.baseUrls.corres;
let correswithstatus = CONFIG.baseUrls.correswithstatus;
let corresbytradeid = CONFIG.baseUrls.corresbytradeid; 
let corresbytradeidwithstatus = CONFIG.baseUrls.corresbytradeidwithstatus;
let corresbysenderidandid = CONFIG.baseUrls.corresbysenderidandid;
  
let corresbytraderidinbox = CONFIG.baseUrls.corresbytraderidinbox;
let corresbytraderidsent = CONFIG.baseUrls.corresbytraderidsent;
let corresbytraderidarchivedinbox = CONFIG.baseUrls.corresbytraderidarchivedinbox;
let corresbytraderidarchivedsent = CONFIG.baseUrls.corresbytraderidarchivedsent;
let removedcorresbytraderid = CONFIG.baseUrls.removedcorrespondencebytraderid;

let singlecorres = CONFIG.baseUrls.singlecorres
let updatecorres = CONFIG.baseUrls.updatecorres;
let addcorres= CONFIG.baseUrls.addcorres;
let deletecorres = CONFIG.baseUrls.deletecorres;


@Injectable()
export class CorrespondenceService {
  private localUrl: string;
 

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


   //**********************************************************
  // GET CORRES
  //***********************************************************
  public getCorres(status:string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    if (status === "All")  { this.localUrl = `${corresbytradeid}`; } 
    else { this.localUrl = `${correswithstatus}?status=${status}`; }   

    return this.httpClientService.get<Correspondence[]>(this.localUrl, httpOptions).retry(1);
  }


   //**********************************************************
  // GET SINGLE CORRES
  //***********************************************************
  // get single correspondence by corres id
  public getSingleCorres(corresId: number): Observable<Correspondence> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
   
    const localUrl = `${singlecorres}${corresId}`; 

    return this.httpClientService.get<Correspondence>(localUrl, httpOptions).retry(1);
  }

  // get single correspondence by corres id and sender id
  public getSingleCorresByTraderIdAndId(loggedonTrader:string, corresId: number): Observable<Correspondence> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${corresbysenderidandid}?loggedOnTrader=${loggedonTrader}&id=${corresId}`;

    return this.httpClientService.get<Correspondence>(localUrl, httpOptions).retry(1);
  }

   //**********************************************************
  // GET CORRES BY TRADE ID
  //***********************************************************
  // get corres by trade id with or without status
  public getCorresByTradeId(tradeId: number): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
  
   
    const localUrl = `${corresbytradeid}?traderId=${tradeId}`; 
    return this.httpClientService.get<Correspondence[]>(localUrl, httpOptions).retry(1);
  }


  

  //**********************************************************
  // GET INBOX/ARCHIVED BY TRADER ID
  //***********************************************************
  public getInboxByTraderId(traderId: string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

   const localUrl = `${corresbytraderidinbox}?traderId=${traderId}`; 
    return this.httpClientService.get<Correspondence[]>(localUrl, httpOptions).retry(1);
  }


  public getArchivedInboxByTraderId(traderId: string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${corresbytraderidarchivedinbox}?traderId=${traderId}`;
    return this.httpClientService.get<Correspondence[]>(localUrl, httpOptions).retry(1);
  }

  //**********************************************************
  // GET SENT/ARCHIVED BY TRADER ID
  //***********************************************************
  public getSentByTraderId(traderId: string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

   
   const localUrl = `${corresbytraderidsent}?traderId=${traderId}`; 
    return this.httpClientService.get<Correspondence[]>(localUrl, httpOptions).retry(1);
  }


  public getArchivedSentByTraderId(traderId: string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
    const localUrl = `${corresbytraderidarchivedsent}?traderId=${traderId}`;
    return this.httpClientService.get<Correspondence[]>(localUrl, httpOptions).retry(1);
  }

  //**********************************************************
  // GET DELETED BY TRADER ID
  //***********************************************************
  public getRemovedByTraderId(traderId: string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${removedcorresbytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<Correspondence[]>(localUrl, httpOptions).retry(1);
  }





  //**********************************************************
  // ADD SINGLE CORRES
  //***********************************************************
  public addCorres(corres: Correspondence): Observable<Correspondence> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${addcorres}`;
    return this.httpClientService.post<Correspondence>(localUrl, corres, httpOptions);
  }

  //**********************************************************
  // UPDATE SINGLE CORRES
  //***********************************************************
  public updateCorrespondence(corres: Correspondence): Observable<Correspondence> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updatecorres}?id=${corres.id}`;
    return this.httpClientService.put<Correspondence>(localUrl, corres, httpOptions);
  }

}
