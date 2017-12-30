import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';
import { Address } from '../helpers/classes';

let addressesUrl = CONFIG.baseUrls.addresses;


@Injectable()export class AddressService {

    private localUrl: string;

    constructor(private httpService: Http, private loggerService:LoggerService) { };


    //******************************************************
    // GET LOCATION
    //******************************************************
    public getAddresses(id?: number):Observable<Address[]> {
        return this.httpService.get(addressesUrl)
            .map((res: Response) => res.json())
            .catch((error:Response) => this.onError(error, "GetAddresses"));
    }


    //******************************************************
    // GET Address
    //******************************************************
    public getAddress(id:number):Observable<Address> {
        return this.httpService.get(`${addressesUrl}/${id}`)
            .map((res: Response) => <Address>res.json()) 
            .catch((error:Response) => this.onError(error, "GetAddress"));
    }


    //******************************************************
    // ADD LOCATION
    //******************************************************


    //******************************************************
    // DELETE LOCATION
    //******************************************************


    //******************************************************
    // UPDATE LOCATION
    //******************************************************


    //******************************************************
    // PRIVATE METHODS
    //******************************************************  
    private onError(err: any, method: string) {
      this.loggerService.logErrors(err, "location.service had an error in the method " + method);
      return Observable.throw(err);   
    }
}
