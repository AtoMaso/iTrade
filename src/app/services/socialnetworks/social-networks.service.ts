import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

import {AuthenticationService } from '../authentication/authentication.service';
import { SocialNetwork, SocialNetworkType } from '../../helpers/classes';

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

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


  //******************************************************
  // GET SOCIAL NETWORKS
  //******************************************************
  public getSocialNetworks(): Observable<SocialNetwork[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${socialnetworksbytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<SocialNetwork[]>(this.localUrl, httpOptions).retry(1);
  }



  //******************************************************
  // GET PREFERRED SOCIAL NETWORK
  //******************************************************
  public getPreferredSocialNetwork(traderId: string, flag: string): Observable<SocialNetwork> {

    //// prepare the headesrs
    //const httpOptions = {
    //  headers: new HttpHeaders({
    //    'Accept': 'application/json',
    //    'Content-Type': 'application/json',
    //    'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
    //  })
    //};

    this.localUrl = `${preferredsocialnetwork}?traderId=${traderId}&preferredFlag=${flag}`;
    //return this.httpClientService.get<SocialNetwork>(this.localUrl, httpOptions).retry(1);
    return this.httpClientService.get<SocialNetwork>(this.localUrl).retry(1);
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${deleteSocialNetworkUrl}?id=${socialnetwork.id}`;
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${socialnetworkTypesUrl}`;
    return this.httpClientService.get<SocialNetworkType[]>(this.localUrl, httpOptions).retry(1);

  }

}
