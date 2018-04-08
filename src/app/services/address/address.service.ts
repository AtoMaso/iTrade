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

    const localUrl = `${addressesUrl}`;
    return this.httpClientService.get<Address[]>(localUrl, httpOptions).retry(1);
   
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

    const localUrl = `${addressesbytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<Address[]>(localUrl, httpOptions).retry(1);
  }


  //******************************************************
  // GET PREFERRED ADDRESS
  //******************************************************
  public getPreferredAddress(traderId: string, flag: string) {
    // annonimous
    const localUrl = `${preferredaddress}?traderId=${traderId}&preferredFlag=${flag}`; 
    return this.httpClientService.get<Address>(localUrl).retry(1);
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

    const localUrl = `${addAddressUrl}`;
    return this.httpClientService.post<Address>(localUrl, address, httpOptions).retry(1);
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

    const localUrl = `${updateAddressUrl}?id=${address.id}`;
    return this.httpClientService.put<Address>(localUrl, address,  httpOptions).retry(1);
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

    const localUrl = `${deleteAddressUrl}?id=${address.id}`;
    return this.httpClientService.delete<Address>(localUrl, httpOptions).retry(1);
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

    const localUrl = `${addressTypesUrl}`;
    return this.httpClientService.get<AddressType[]>(localUrl, httpOptions).retry(1);
  }



  //******************************************************
  // ADD ADDRESS TYPE
  //******************************************************
  public addAddressType(type: AddressType): Observable<AddressType> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${addAddressTypeUrl}`;
    return this.httpClientService.post<AddressType>(localUrl, type, httpOptions).retry(1);
  }



  //******************************************************
  // UPDATE ADDRESS TYPE
  //******************************************************
  public updateAddressType(addresstype: AddressType): Observable<AddressType> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updateAddressTypeUrl}?addressTypeId=${addresstype.addressTypeId}`;
    return this.httpClientService.put<AddressType>(localUrl, addresstype, httpOptions).retry(1);
  }


  //******************************************************
  // DELETE ADDRESS TYPE
  //******************************************************
  public deleteAddressType(id: number): Observable<AddressType> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deleteAddressTypeUrl}?addressTypeId = ${id}`;
    return this.httpClientService.delete<AddressType>(localUrl, httpOptions).retry(1);
  }
}


