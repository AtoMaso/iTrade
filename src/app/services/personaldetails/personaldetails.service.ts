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

import {AuthenticationService } from '../authentication/authentication.service';
import { LoggerService } from '../logger/logger.service';
import { UserSession, UserIdentity, PersonalDetails} from '../../helpers/classes';

let personaldetailsbytraderid = CONFIG.baseUrls.personaldetailsbytraderid;
let updatepersonaldetails = CONFIG.baseUrls.updatepersonaldetail;
let addpersonaldetails = CONFIG.baseUrls.addpersonaldetail;
let deletepersonaldetails = CONFIG.baseUrls.deletepersonaldetails;

@Injectable()
export class PersonalDetailsService {

  private localUrl: string;
  private args: RequestOptionsArgs;
  private session: UserSession;


  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };

  //*****************************************************
  // GET PERSONAL BY TRADER ID
  //*****************************************************
  public getPersonalDetailsByTraderId(traderId: string): Observable<PersonalDetails>{

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${personaldetailsbytraderid}?traderId=${traderId}`; 
    return this.httpClientService.get<PersonalDetails>(this.localUrl, httpOptions).retry(1);
  }


  //*****************************************************
  // ADD PERSONAL
  //*****************************************************
  public addPersonalDetails(pd: PersonalDetails): Observable<PersonalDetails> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${addpersonaldetails}`;
    return this.httpClientService.post<PersonalDetails>(this.localUrl, pd, httpOptions).retry(1);
  }

  //*****************************************************
  // UPDATE PERSONAL
  //*****************************************************
  //update personal details
  public updatePersonalDetails(pd: PersonalDetails): Observable<PersonalDetails> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${updatepersonaldetails}?id=${pd.id}`;
    return this.httpClientService.put<PersonalDetails>(this.localUrl, pd, httpOptions).retry(1);
  }


  //******************************************************
  // DELETE PERSONAL
  //******************************************************
  public deletePersonaDetails(pd: PersonalDetails): Observable<PersonalDetails> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${deletepersonaldetails}?id=${pd.id}`;
    return this.httpClientService.delete<PersonalDetails>(this.localUrl, httpOptions).retry(1);
  }

 
}
