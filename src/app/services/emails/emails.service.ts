import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

import { AuthenticationService } from '../authentication/authentication.service';
import { Email, EmailType } from '../../helpers/classes';

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

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


  //******************************************************
  // GET EMAILS
  //******************************************************
  public getEmails(): Observable<Email []> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${emailsbytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<Email[]>(this.localUrl, httpOptions).retry(1);
  }


  //******************************************************
  // GET PREFERRED EMAIL
  //******************************************************
  public getPreferredEmail(traderId: string, flag: string): Observable<Email> {

    //// prepare the headesrs
    //const httpOptions = {
    //  headers: new HttpHeaders({
    //    'Accept': 'application/json',
    //    'Content-Type': 'application/json',
    //    'Authorization': `Bearer ${this.session.userIdentity.accessToken}`
    //  })
    //};

    this.localUrl = `${preferredemail}?traderId=${traderId}&preferredFlag=${flag}`;
    //return this.httpClientService.get<Email>(this.localUrl, httpOptions).retry(1);
    return this.httpClientService.get<Email>(this.localUrl).retry(1);
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${deleteEmailUrl}?id=${emails.id}`;
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
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
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = `${emailTypesUrl}`;
    return this.httpClientService.get<EmailType []>(this.localUrl, httpOptions).retry(1);

  }


}
