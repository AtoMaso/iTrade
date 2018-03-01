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


import { LoggerService } from '../logger/logger.service';
import { Correspondence, UserSession, UserIdentity, PersonalDetails } from '../../helpers/classes';

let corres = CONFIG.baseUrls.corres;
let correswithstatus = CONFIG.baseUrls.correswithstatus;
let corresbytradeid = CONFIG.baseUrls.corresbytradeid; 
let corresbytradeidwithstatus = CONFIG.baseUrls.corresbytradeidwithstatus;
let corresbytraderid = CONFIG.baseUrls.corresbytraderid;
let corresbytraderidwithstatus = CONFIG.baseUrls.corresbytraderidwithstatus;
let singlecorres = CONFIG.baseUrls.singlecorres
let updatecorres = CONFIG.baseUrls.updatecorres;
let addcorres= CONFIG.baseUrls.addcorres;
let deletecorres = CONFIG.baseUrls.deletecorres;


@Injectable()
export class CorrespondenceService {
  private localUrl: string;
  private args: RequestOptionsArgs;
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private token: string;

  constructor(private httpClientService: HttpClient) {
    this.getUseridentity();
  };


   //**********************************************************
  // GET CORRES
  //***********************************************************
  public getCorres(status:string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
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
        'Authorization': `Bearer ${this.token}`
      })
    };
   
    this.localUrl = `${singlecorres}${corresId}`; 

    return this.httpClientService.get<Correspondence>(this.localUrl, httpOptions).retry(1);
  }


   //**********************************************************
  // GET CORRES BY TRADE ID
  //***********************************************************
  // get corres by trade id with or without status
  public getCorresByTradeIdWithStatusOrAll(tradeId: number, status: string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
  
    if (status === "All") { if (tradeId !== 0 || tradeId !== undefined) { this.localUrl = `${corresbytradeid}?traderId=${tradeId}`; }  }
    else {  if (tradeId !== 0 || tradeId !== undefined) { this.localUrl = `${corresbytradeidwithstatus}?traderId=${tradeId}&status=${status}`; } }  

    return this.httpClientService.get<Correspondence[]>(this.localUrl, httpOptions).retry(1);
  }


  //**********************************************************
  // GET CORRES BY TRADER ID
  //***********************************************************
  public getCorresByTraderIdWithStatusOrAll(traderId: string, status: string): Observable<Correspondence[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    if (status === "All") { if (traderId !== null || traderId != undefined) { this.localUrl = `${corresbytraderid}?traderId=${traderId}`; } }
    else { if (traderId !== null || traderId !== undefined) { this.localUrl = `${corresbytraderidwithstatus}?traderId=${traderId}&status=${status}`; } }

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
        'Authorization': `Bearer ${this.token}`
      })
    };

    const localUrl = `${addcorres}`;

    return this.httpClientService.post<Correspondence>(localUrl, corres, httpOptions);
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
