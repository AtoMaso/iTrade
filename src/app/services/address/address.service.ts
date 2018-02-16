import { Inject, Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry'; 

import { LoggerService } from '../logger/logger.service';
import { Address } from '../../helpers/classes';

let addressesUrl = CONFIG.baseUrls.addresses;
let addressUrl = CONFIG.baseUrls.address;
let updateAddressUrl = CONFIG.baseUrls.updateaddress
let addAddressUrl = CONFIG.baseUrls.addaddress;
let removeAddressUrl = CONFIG.baseUrls.removeaddress;


@Injectable()export class AddressService {

  constructor(private httpClientService: HttpClient, private loggerService:LoggerService) { };


  //******************************************************
  // GET ADDRESSES
  //******************************************************
  public getAddressesApi(): Observable<Address[]> {

    return this.httpClientService.get<Address[]>(addressesUrl).retry(1)
   
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


}
