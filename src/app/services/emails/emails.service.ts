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

    const localUrl = `${emailUrl}`;
    return this.httpClientService.get<Email[]>(localUrl, httpOptions).retry(1);

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

    const localUrl = `${emailsbytraderid}?traderId=${traderId}`;
    return this.httpClientService.get<Email[]>(localUrl, httpOptions).retry(1);
  }


  //******************************************************
  // GET PREFERRED EMAIL
  //******************************************************
  public getPreferredEmail(traderId: string, flag: string): Observable<Email> { 
    // annonimous
    const localUrl = `${preferredemail}?traderId=${traderId}&preferredFlag=${flag}`;   
    return this.httpClientService.get<Email>(localUrl).retry(1);
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

    const localUrl = `${addEmailUrl}`;
    return this.httpClientService.post<Email>(localUrl, email, httpOptions).retry(1);
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

    const localUrl = `${updateEmailUrl}?id=${emails.id}`;
    return this.httpClientService.put<Email>(localUrl, emails, httpOptions).retry(1);
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

    const localUrl = `${deleteEmailUrl}?id=${emails.id}`;
    return this.httpClientService.delete<Email>(localUrl, httpOptions).retry(1);
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

    const localUrl = `${emailTypesUrl}`;
    return this.httpClientService.get<EmailType []>(localUrl, httpOptions).retry(1);

  }

  //******************************************************
  // ADD EMAIL TYPE
  //******************************************************
  public addEmailType(type: EmailType): Observable<EmailType> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${addEmailTypeUrl}`;
    return this.httpClientService.post<EmailType>(localUrl, type, httpOptions).retry(1);
  }



  //******************************************************
  // UPDATE EMAIL TYPE
  //******************************************************
  public updateEmailType(id: number): Observable<EmailType> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updateEmailTypeUrl}?emailTypeid=${id}`;
    return this.httpClientService.put<EmailType>(localUrl, httpOptions).retry(1);
  }


  //******************************************************
  // DELETE EMAIL TYPE
  //******************************************************
  public deleteEmailType(id: number): Observable<EmailType> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deleteEmailTypeUrl}?emailTypeId = ${id}`;
    return this.httpClientService.delete<EmailType>(localUrl, httpOptions).retry(1);
  }
}

