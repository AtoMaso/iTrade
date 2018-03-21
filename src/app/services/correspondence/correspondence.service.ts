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

let corresbytraderidinbox = CONFIG.baseUrls.corresbytraderidinbox;
let corresbytraderidwithstatusinbox = CONFIG.baseUrls.corresbytraderidwithstatusinbox;

let corresbytraderidsent = CONFIG.baseUrls.corresbytraderidsent;
let corresbytraderidwithstatussent = CONFIG.baseUrls.corresbytraderidwithstatussent;
let deletedcorrespondencebytraderid = CONFIG.baseUrls.deletedcorrespondencebytraderid;

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
   
    this.localUrl = `${singlecorres}${corresId}`; 

    return this.httpClientService.get<Correspondence>(this.localUrl, httpOptions).retry(1);
  }


   //**********************************************************
  // GET CORRES BY TRADE ID
  //***********************************************************
  // get corres by trade id with or without status
  public getCorresByTradeIdWithStatus(tradeId: number, status: string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
  
   
    this.localUrl = `${corresbytradeidwithstatus}?traderId=${tradeId}&status=${status}`; 
    return this.httpClientService.get<Correspondence[]>(this.localUrl, httpOptions).retry(1);
  }


  //**********************************************************
  // GET DELETED CORRESPONDENCE BY TRADER ID
  //***********************************************************
  public getDeletedCorresByTraderId(traderId:string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
    
    this.localUrl = `${deletedcorrespondencebytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<Correspondence[]>(this.localUrl, httpOptions).retry(1);
  }




  //**********************************************************
  // GET INBOX or ARCHIVED INBOX CORRESPONDENCE BY TRADER ID
  //***********************************************************
  public getInboxByTraderIdWithStatus(traderId: string, status: string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };


   this.localUrl = `${corresbytraderidwithstatusinbox}?traderId=${traderId}&status=${status}`; 
    return this.httpClientService.get<Correspondence[]>(this.localUrl, httpOptions).retry(1);
  }



  //**********************************************************
  // GET SENT or SENT ARHIVED CORRESPONDENCE BY TRADER ID
  //***********************************************************
  public getSentByTraderIdWithStatus(traderId: string, status: string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

   
   this.localUrl = `${corresbytraderidwithstatussent}?traderId=${traderId}&status=${status}`; 
    return this.httpClientService.get<Correspondence[]>(this.localUrl, httpOptions).retry(1);
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
