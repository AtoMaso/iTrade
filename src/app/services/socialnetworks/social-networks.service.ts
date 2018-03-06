import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';

import { LoggerService } from '../logger/logger.service';
import { Address, AddressType } from '../../helpers/classes';
import { UserSession, UserIdentity, SocialNetwork, SocialNetworkType } from '../../helpers/classes';

let socialnetworksUrl = CONFIG.baseUrls.socialnetworks;
let socialnetworksbytraderid = CONFIG.baseUrls.socialnetworksbytraderid;
let preferredsocialnetwork = CONFIG.baseUrls.preferredsocialnetwork;
let socialnetworkUrl = CONFIG.baseUrls.socialnetworks;
let updateSocialNetworkUrl = CONFIG.baseUrls.updatesocialnetwork
let addSocialNetworkUrl = CONFIG.baseUrls.addsocialnetwork;
let deleteSocialNetworkUrl = CONFIG.baseUrls.deletesocialnetwork;


let socialnetworkTypesUrl = CONFIG.baseUrls.socialnetworktypes;
let socialnetworkTypeUrl = CONFIG.baseUrls.socialnetworktypes;
let updateSocialNetworkTypeUrl = CONFIG.baseUrls.updatesocialnetworktype;
let addSocialNetworkTypeUrl = CONFIG.baseUrls.addsocialnetworktype;
let deleteSocialNetworkTypeUrl = CONFIG.baseUrls.deletesocialnetworktype;


@Injectable()
export class SocialNetworksService {

  private localUrl: string;
  private args: RequestOptionsArgs;
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private token: string;


  constructor(private httpClientService: HttpClient) {
    this.getUseridentity();
  };


  //******************************************************
  // GET SOCIAL NETWORKS
  //******************************************************
  public getSocialNetworks(): Observable<SocialNetwork[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${socialnetworksUrl}`;
    return this.httpClientService.get<SocialNetwork[]>(this.localUrl, httpOptions).retry(1);

  }


  //******************************************************
  // GET SOCIAL NETWORK BY TRADER ID
  //******************************************************
  public getSocialNetworksByTraderId(traderId: string): Observable<SocialNetwork[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${socialnetworksbytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<SocialNetwork[]>(this.localUrl, httpOptions).retry(1);
  }



  //******************************************************
  // GET PREFERRED SOCIAL NETWORK
  //******************************************************
  public getPreferredSocialNetwork(traderId: string, flag: string): Observable<SocialNetwork> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${preferredsocialnetwork}?traderId=${traderId}&preferredFlag=${flag}`;
    return this.httpClientService.get<SocialNetwork>(this.localUrl, httpOptions).retry(1);
  }

  //******************************************************
  // ADD SOCIAL NETWORK
  //******************************************************
  public addSocialNetwork(socialnetwork: SocialNetwork): Observable<SocialNetwork> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${addSocialNetworkUrl}`;
    return this.httpClientService.post<SocialNetwork>(this.localUrl, socialnetwork, httpOptions).retry(1);
  }

  //******************************************************
  // DELETE SOCIAL NETWORK
  //******************************************************
  public deleteSocialNetwork(socialnetwork: SocialNetwork): Observable<SocialNetwork> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${deleteSocialNetworkUrl}/${socialnetwork.id}`;
    return this.httpClientService.delete<SocialNetwork>(this.localUrl, httpOptions).retry(1);
  }


  //******************************************************
  // UPDATE SOCIAL NETWORK
  //******************************************************
  public updateSocialNetwork(socialnetwork: SocialNetwork): Observable<SocialNetwork> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${updateSocialNetworkUrl}?id=${socialnetwork.id}`;
    return this.httpClientService.put<SocialNetwork>(this.localUrl, socialnetwork, httpOptions).retry(1);
  }



  //******************************************************
  // GET SOCIAL NETWORK TYPES
  //******************************************************
  public getSocialNetworkTypes(): Observable<SocialNetworkType[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${socialnetworkTypesUrl}`;
    return this.httpClientService.get<SocialNetworkType[]>(this.localUrl, httpOptions).retry(1);

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
