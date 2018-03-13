import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators'; // left here as an example
import { of } from 'rxjs/observable/of';   // left here as an example
import 'rxjs/add/operator/catch'; // left here as an example
import 'rxjs/add/observable/of'; // left here as an example
import 'rxjs/add/observable/empty'; // left here as an example
import 'rxjs/add/operator/retry'; // left here as an example

import {AuthenticationService } from '../authentication/authentication.service';
import { Address, AddressType } from '../../helpers/classes';

let addressesUrl = CONFIG.baseUrls.addresses;
let addressUrl = CONFIG.baseUrls.address;
let addressesbytraderid = CONFIG.baseUrls.addressesbytraderid;
let preferredaddress = CONFIG.baseUrls.preferredaddress;
let updateAddressUrl = CONFIG.baseUrls.updateaddress
let addAddressUrl = CONFIG.baseUrls.addaddress;
let deleteAddressUrl = CONFIG.baseUrls.deleteaddress;


let addressTypesUrl = CONFIG.baseUrls.addresstypes;
let addressTypeUrl = CONFIG.baseUrls.addresstypes;
let updateAddressTypeUrl = CONFIG.baseUrls.updateaddresstype;
let addAddressTypeUrl = CONFIG.baseUrls.addaddresstype;
let deleteAddressTypeUrl = CONFIG.baseUrls.deleteaddresstype;


@Injectable()
export class AddressService {

  private localUrl: string;
  private args: RequestOptionsArgs;


  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


  //******************************************************
  // GET ADDRESSES
  //******************************************************
  public getAddressesApi(): Observable<Address[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${addressesUrl}`;
    return this.httpClientService.get<Address[]>(this.localUrl, httpOptions).retry(1);
   
    }

  
    //******************************************************
    // GET ADDRESSES BY TRADER ID
    //******************************************************
  public getAddressesByTraderId(traderId: string) {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${addressesbytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<Address[]>(this.localUrl, httpOptions).retry(1);
  }


  //******************************************************
  // GET PREFERRED ADDRESS
  //******************************************************
  public getPreferredAddress(traderId: string, flag: string) {

    //// prepare the headesrs
    //const httpOptions = {
    //  headers: new HttpHeaders({
    //    'Accept': 'application/json',
    //    'Content-Type': 'application/json',
    //    'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
    //  })
    //};

    this.localUrl = `${preferredaddress}?traderId=${traderId}&preferredFlag=${flag}`;
    //return this.httpClientService.get<Address>(this.localUrl, httpOptions).retry(1);
    return this.httpClientService.get<Address>(this.localUrl).retry(1);
  }

    //******************************************************
    // ADD ADDRESS
    //******************************************************
  public addAddress(address: Address): Observable<Address> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${addAddressUrl}`;
    return this.httpClientService.post<Address>(this.localUrl, address, httpOptions).retry(1);
  }

    //******************************************************
    // DELETE ADDRESS
    //******************************************************
  public deleteAddress(address: Address): Observable<Address> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${deleteAddressUrl}?id=${address.id}`;
    return this.httpClientService.delete<Address>(this.localUrl, httpOptions).retry(1);
  }


    //******************************************************
    // UPDATE ADDRESS
    //******************************************************
  public updateAddress(address: Address): Observable<Address> {
      // prepare the headesrs
      const httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
        })
      };

      this.localUrl = `${updateAddressUrl}?id=${address.id}`;
      return this.httpClientService.put<Address>(this.localUrl, address,  httpOptions).retry(1);
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${addressTypesUrl}`;
    return this.httpClientService.get<AddressType[]>(this.localUrl, httpOptions).retry(1);

  }


}
