import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

import {AuthenticationService } from '../authentication/authentication.service';
import { UserSession, UserIdentity, Phone, PhoneType } from '../../helpers/classes';

let phonesUrl = CONFIG.baseUrls.phones;
let phonesbytraderid = CONFIG.baseUrls.phonesbytraderid;
let preferedphone = CONFIG.baseUrls.preferredphone;
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

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


  //******************************************************
  // GET PHONES
  //******************************************************
  public getPhones(): Observable<Phone[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${phonesUrl}`;
    return this.httpClientService.get<Phone[]>(localUrl, httpOptions).retry(1);

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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${phonesbytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<Phone[]>(localUrl, httpOptions).retry(1);
  }


  //******************************************************
  // GET PREFERRED PHONE
  //******************************************************
  public getPreferredPhone(traderId: string, flag: string): Observable<Phone> {

    //// prepare the headesrs
    //const httpOptions = {
    //  headers: new HttpHeaders({
    //    'Accept': 'application/json',
    //    'Content-Type': 'application/json',
    //    'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
    //  })
    //};

    const localUrl = `${preferedphone}?traderId=${traderId}&preferredFlag=${flag}`;
   // return this.httpClientService.get<Phone>(this.localUrl, httpOptions).retry(1);
    return this.httpClientService.get<Phone>(localUrl).retry(1);
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${addPhoneUrl}`;
    return this.httpClientService.post<Phone>(localUrl, phone, httpOptions).retry(1);
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updatePhoneUrl}?id=${phone.id}`;
    return this.httpClientService.put<Phone>(localUrl, phone, httpOptions).retry(1);
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deletePhoneUrl}?id=${phone.id}`;
    return this.httpClientService.delete<Phone>(localUrl, httpOptions).retry(1);
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${phoneTypesUrl}`;
    return this.httpClientService.get<PhoneType[]>(localUrl, httpOptions).retry(1);

  }


  //******************************************************
  // ADD PHONE TYPE
  //******************************************************
  public addPhoneType(type: PhoneType): Observable<PhoneType>{

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${addPhoneTypeUrl}`;
    return this.httpClientService.post<PhoneType>(localUrl, type, httpOptions).retry(1);
  }



 //******************************************************
  // UPDATE PHONE TYPE
  //******************************************************
  public updatePhoneType(id: number): Observable<PhoneType>{

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updatePhoneTypeUrl}?phoneTypeid=${id}`;
    return this.httpClientService.put<PhoneType>(localUrl, httpOptions).retry(1);
  }


   //******************************************************
  // DELETE PHONE TYPE
  //******************************************************
  public deletePhoneType(id: number): Observable<PhoneType> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deletePhoneTypeUrl}?phoneTypeId = ${id}`;
    return this.httpClientService.delete<PhoneType>(localUrl, httpOptions).retry(1);
  }
}



