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

    return this.httpClientService.get<Address[]>(addressesUrl)
      .retry(3)
      .catch((err: HttpErrorResponse, result) => {

        if (err.error instanceof Error) { this.handleError("Client side error occured: getAddressesApi method in the addressapi service error", err); }
        else { this.handleError("Server side error occured: getAddressesApi method in the address service error", err); }    
         return Observable.throw(err);
      }); 
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

  ///*****************************************************
  // HELPER METHODS
  //*****************************************************
  private handleError(operation: string, err: HttpErrorResponse) {

    let errMsg = `error in ${operation}() retrieving ${err.url}`;
    // audit log the error on the server side
    this.loggerService.addError(err, `${operation} failed: ${err.message},  the URL: ${err.url}, was:  ${err.statusText}`);

    // Let the app keep running by throwing the error to the calling component where it will be couth and friendly message displayed
    return Observable.throw(errMsg);
  };
}
