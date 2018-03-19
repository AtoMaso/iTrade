import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CONFIG } from '../../config';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

import {AuthenticationService } from '../authentication/authentication.service';
import { SecurityDetails} from '../../helpers/classes';

let securitydetailsbytraderid = CONFIG.baseUrls.securitydetailsbytraderid;

@Injectable()
export class LoginDetailsService {

  private localUrl: string;

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };

  public getSecurityDetailsByTraderId(traderId: string): Observable<SecurityDetails> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${securitydetailsbytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<SecurityDetails>(this.localUrl, httpOptions).retry(1);
  }

}

