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
import { UserSession, UserIdentity, Email, EmailType } from '../../helpers/classes';

let emailsUrl = CONFIG.baseUrls.emails;
let emailsbytraderid = CONFIG.baseUrls.emailsbytraderid;
let preferredemail = CONFIG.baseUrls.preferredemail;
let emailUrl = CONFIG.baseUrls.emails;
let updateEmailUrl = CONFIG.baseUrls.updateemail
let addEmailUrl = CONFIG.baseUrls.addemail;
let deleteEmailUrl = CONFIG.baseUrls.deleteemail;


let emailTypesUrl = CONFIG.baseUrls.emailtypes;
let emailsTypeUrl = CONFIG.baseUrls.emailtypes;
let updateEmailTypeUrl = CONFIG.baseUrls.updateemailtype;
let addEmailTypeUrl = CONFIG.baseUrls.addemailtype;
let deleteEmailTypeUrl = CONFIG.baseUrls.deleteemailtype;


@Injectable()
export class EmailsService {

  private localUrl: string;
  private args: RequestOptionsArgs;
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private token: string;


  constructor(private httpClientService: HttpClient) {
    this.getUseridentity();
  };


  //******************************************************
  // GET EMAILS
  //******************************************************
  public getEmails(): Observable<Email []> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${emailUrl}`;
    return this.httpClientService.get<Email[]>(this.localUrl, httpOptions).retry(1);

  }


  //******************************************************
  // GET EMAIL BY TRADER ID
  //******************************************************
  public getEmailsByTraderId(traderId: string) :Observable<Email[]>{

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${emailsbytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<Email[]>(this.localUrl, httpOptions).retry(1);
  }


  //******************************************************
  // GET PREFERRED EMAIL
  //******************************************************
  public getPreferredEmail(traderId: string, flag: string): Observable<Email> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${preferredemail}?traderId=${traderId}&preferredFlag=${flag}`;
    return this.httpClientService.get<Email>(this.localUrl, httpOptions).retry(1);
  }

  //******************************************************
  // ADD EMAIL
  //******************************************************
  public addEmail(email: Email): Observable<Email> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${addEmailUrl}`;
    return this.httpClientService.post<Email>(this.localUrl, email, httpOptions).retry(1);
  }

  //******************************************************
  // DELETE EMAIL
  //******************************************************
  public deleteEmail(emails: Email): Observable<Email> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${deleteEmailUrl}/${emails.id}`;
    return this.httpClientService.delete<Email>(this.localUrl, httpOptions).retry(1);
  }


  //******************************************************
  // UPDATE EMAIL
  //******************************************************
  public updateEmail(emails: Email): Observable<Email> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${updateEmailUrl}?id=${emails.id}`;
    return this.httpClientService.put<Email>(this.localUrl, emails, httpOptions).retry(1);
  }



  //******************************************************
  // GET EMAIL TYPES
  //******************************************************
  public getEmailTypes(): Observable<EmailType[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.localUrl = `${emailTypesUrl}`;
    return this.httpClientService.get<EmailType []>(this.localUrl, httpOptions).retry(1);

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
