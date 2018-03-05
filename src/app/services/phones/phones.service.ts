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
import { UserSession, UserIdentity, Phone, PhoneType } from '../../helpers/classes';

let phonesUrl = CONFIG.baseUrls.phones;
let phonesbytraderid = CONFIG.baseUrls.phonesbytraderid;
let phoneUrl = CONFIG.baseUrls.phones;
let updatePhoneUrl = CONFIG.baseUrls.updatephone
let addPhoneUrl = CONFIG.baseUrls.addphone;
let deletePhoneUrl = CONFIG.baseUrls.deletephone;


let phoneTypesUrl = CONFIG.baseUrls.phonetypes;
let phoneTypeUrl = CONFIG.baseUrls.phonetypes;
let updatePhoneTypeUrl = CONFIG.baseUrls.updatephonetype;
let addPhoneTypeUrl = CONFIG.baseUrls.addphonetype;
let deletePhoneTypeUrl = CONFIG.baseUrls.deletephonetype;


@Injectable()
export class PhonesService {

  private localUrl: string;
  private args: RequestOptionsArgs;
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private token: string;


  constructor(private httpClientService: HttpClient) {
    this.getUseridentity();
  };


  //******************************************************
  // GET PHONES
  //******************************************************
  public getPhones(): Observable<Phone[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${phonesUrl}`;
    return this.httpClientService.get<Phone[]>(this.localUrl, httpOptions).retry(1);

  }


  //******************************************************
  // GET PHONE
  //******************************************************
  public getPhonesByTraderId(traderId: string): Observable<Phone[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${phonesbytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<Phone[]>(this.localUrl, httpOptions).retry(1);
  }


  //******************************************************
  // ADD PHONE
  //******************************************************
  public addPhone(phone: Phone): Observable<Phone> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${addPhoneUrl}`;
    return this.httpClientService.post<Phone>(this.localUrl, phone, httpOptions).retry(1);
  }

  //******************************************************
  // DELETE PHONE
  //******************************************************
  public deletePhone(phone: Phone): Observable<Phone> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${deletePhoneUrl}/${phone.id}`;
    return this.httpClientService.delete<Phone>(this.localUrl, httpOptions).retry(1);
  }


  //******************************************************
  // UPDATE PHONE
  //******************************************************
  public updatePhone(phone: Phone): Observable<Phone> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${updatePhoneUrl}?id=${phone.id}`;
    return this.httpClientService.put<Phone>(this.localUrl, phone, httpOptions).retry(1);
  }



  //******************************************************
  // GET PHONE TYPES
  //******************************************************
  public getPhoneTypes(): Observable<PhoneType[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${phoneTypesUrl}`;
    return this.httpClientService.get<PhoneType[]>(this.localUrl, httpOptions).retry(1);

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
