import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CONFIG } from '../../config';
import { Observable} from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';

import { LoggerService } from '../logger/logger.service';
import { UserSession, UserIdentity, PersonalDetails} from '../../helpers/classes';

let personaldetailsbytraderid = CONFIG.baseUrls.personaldetailsbytraderid;
let updatepersonaldetail = CONFIG.baseUrls.updatepersonaldetail;

@Injectable()
export class PersonalDetailsService {

  private localUrl: string;
  private args: RequestOptionsArgs;
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private token: string;


  constructor(private httpClientService: HttpClient) {
    this.getUseridentity();
  };


  public getPersonalDetailsByTraderId(traderId: string): Observable<PersonalDetails>{

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${personaldetailsbytraderid}?traderId=${traderId}`; 
    return this.httpClientService.get<PersonalDetails>(this.localUrl, httpOptions).retry(1);
  }

  //update personal details
  public updatePersonalDetails(pd: PersonalDetails) {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${updatepersonaldetail}`;
    return this.httpClientService.put<PersonalDetails>(this.localUrl, pd, httpOptions).retry(1);
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
