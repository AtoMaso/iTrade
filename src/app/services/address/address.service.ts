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
import { UserSession, UserIdentity, PersonalDetails } from '../../helpers/classes';

let addressesUrl = CONFIG.baseUrls.addresses;
let addressUrl = CONFIG.baseUrls.address;
let updateAddressUrl = CONFIG.baseUrls.updateaddress
let addAddressUrl = CONFIG.baseUrls.addaddress;
let deleteAddressUrl = CONFIG.baseUrls.deleteaddress;


let addressTypesUrl = CONFIG.baseUrls.addresstypes;
let addressTypeUrl = CONFIG.baseUrls.addresstypes;
let updateAddressTypeUrl = CONFIG.baseUrls.updateaddresstype;
let addAddressTypeUrl = CONFIG.baseUrls.addaddresstype;
let deleteAddressTypeUrl = CONFIG.baseUrls.deleteaddresstype;


@Injectable() export class AddressService {

  private localUrl: string;
  private args: RequestOptionsArgs;
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private token: string;


  constructor(private httpClientService: HttpClient) {
    this.getUseridentity();
  };


  //******************************************************
  // GET ADDRESSES
  //******************************************************
  public getAddressesApi(): Observable<Address[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${addressesUrl}`;
    return this.httpClientService.get<Address[]>(this.localUrl, httpOptions).retry(1);
   
    }

  
    //******************************************************
    // GET ADDRESS
    //******************************************************


    //******************************************************
    // ADD ADDRESS
    //******************************************************


    //******************************************************
    // DELETE ADDRESS
    //******************************************************


    //******************************************************
    // UPDATE ADDRESS
    //******************************************************
    public updateAddress(add: Address) {
      // prepare the headesrs
      const httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        })
      };

      this.localUrl = `${updateAddressUrl}`;
      return this.httpClientService.put<PersonalDetails>(this.localUrl, add,  httpOptions).retry(1);
    }



   //******************************************************
  // GET ADDRESS TYPES
  //******************************************************
  public getAddressTypes(): Observable<AddressType[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${addressTypesUrl}`;
    return this.httpClientService.get<AddressType[]>(this.localUrl, httpOptions).retry(1);

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
