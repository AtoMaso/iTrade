/////<reference path="../../typings/moment.d.ts" />
import { Inject, Injectable, EventEmitter, OnDestroy} from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import * as moment from 'moment';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject }    from 'rxjs/Subject';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { LoggerService } from '../logger/logger.service';
import { TraderDetails, RegisterBindingModel, LoginModel, UserSession, Authentication, UserIdentity } from '../../helpers/classes';

let serviceBase = CONFIG.baseUrls.servicebase;
let serviceAccount = CONFIG.baseUrls.accounts;

@Injectable()
export class AuthenticationService implements OnDestroy {

  private timer: any = null;
  private authentication: Authentication;
  private userIdentity: UserIdentity;
  public userSession: UserSession = new UserSession();

  public subjectSessionStore = new Subject<UserSession>();
  public subjectSessionObserver$ = this.subjectSessionStore.asObservable();

  public behaviorSessionStore: BehaviorSubject<UserSession> = new BehaviorSubject(null);
  public behaviorSessionObserver$: Observable<UserSession> = this.behaviorSessionStore.asObservable(); 

  constructor(private httpService: Http, private httpClientService: HttpClient, private loggerService: LoggerService) { }

  public ngOnDestroy() {
    this.authentication = null;
    this.userIdentity = null;
    this.userSession = null ;
    this.subjectSessionStore = null;
    this.subjectSessionObserver$ = null;
    this.behaviorSessionStore = null;
    this.behaviorSessionObserver$ = null;
  }

 
  //******************************************************
  // Login/Get token  using HTTP CLIENT
  //****************************************************** 
  public loginClient(trader: LoginModel) {

    //let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var data = "grant_type=password&username=" + trader.UserName + "&password=" + trader.Password;

    let httpParams = new HttpParams()    
      .set('username', trader.UserName)
      .set('password', trader.Password);

    return this.httpClientService.post(serviceBase + 'Token', data, { headers: httpHeaders, responseType: "text" })
      // this should be .map as the component is subscribing for it
      .map(res => this.onLoginSuccess(res));
}


// grabs the refresh token when IDLE requires or WORKING session is close to expiry
  public refreshTokenClient() {
    var data = "grant_type=refresh_token&refresh_token=" + this.userIdentity.refreshToken + "&client_id=";
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' })

    return this.httpClientService.post(serviceBase + "Token", data, { headers: httpHeaders })
      // this should be subscibe as we need to run onLoginSuccess
      .subscribe(res => this.onLoginSuccess(res));
     
  }

  
  //******************************************************
  // Register new account
  //******************************************************
  public register(user: RegisterBindingModel) {      
  
    let body = JSON.stringify(user);
    let httpHeaders = new Headers();
    httpHeaders.append('Accept', 'application/json'); 
    httpHeaders.append('Content-Type', 'application/json');

    return this.httpService.post(serviceAccount + "Register", body, { headers: httpHeaders})
      .map((res: Response) => this.onSucessRegistering(res));    
  }



  //******************************************************
  // Logout the logged in user
  //******************************************************
  public logOut() {
    // TODO send the web api logout request
    this.clearSessionTimer();
    this.removeUserIdentity();
    this.removeAuthData();
    this.removeUserSession();   
  }


  //******************************************************
  // PRIVATE METHODS
  //****************************************************** 
  private onLoginSuccess(res: any) {

    let body = JSON.parse(res);   //.json(); use it with Http

    if (body.emailConfirmed == "True") {  // this means the account has not been confirmed

    this.userIdentity = new UserIdentity();
    this.authentication = new Authentication();
    this.userSession = new UserSession();
     
     // identity
    this.userIdentity.accessToken = body.access_token;
    this.userIdentity.refreshToken = body.refresh_token;
    this.userIdentity.accessTokenType = body.token_type;      
    this.userIdentity.accessTokenExpiresIn = body.expires_in;   
    this.userIdentity.accessTokenExpiresDate = this.tokenExpiresInDate(this.userIdentity.accessTokenExpiresIn)
    this.userIdentity.userName = body.userName;
    this.userIdentity.email = body.email;
    this.userIdentity.emailConfirmed = body.emailConfirmed;
    this.userIdentity.userId = body.Id;
    this.userIdentity.name = body.firstName + " " + body.middleName + " " + body.lastName;
    this.userIdentity.roles = body.roles.split(",");

    // authentication
    this.authentication.isAuthenticated = true;
    this.authentication.authenticationType = this.userIdentity.accessTokenType;

    // session
    this.userSession.authentication = this.authentication;
    this.userSession.userIdentity = this.userIdentity;

    //  TODO  check has the email beeing confirmed???
  

      // then create session with the session timer
      this.storeUserIdentity(this.userIdentity);
      this.storeAuthData(this.authentication);
      this.storeUsersSession(this.userSession);

      // we do emit from the login component as we do not need to emit new session every time is created
      // if we are planning to pass different sesssion values of expiry values then we need the following line
      // and remove the emiting of the session in the login component
      // this.emitUserSession(this._userSession);

      // clear the webapi session timer if one exist, this is needed when IDLE has done the refresh of the token
      this.clearSessionTimer();

      // start the webapi session timer
      this.startSessionTimer(this.userIdentity.accessTokenExpiresIn);

    }
    else { this.removeUserSession(); }  
  }


  public emitUserSession(passedSession: UserSession) {
    this.behaviorSessionStore.next(passedSession);
  } 
 
  private onSucessRegistering(response: any) {
     // !!! maybe some logic here but for now code below causes issues as is treated as error passed to the component        
  }

  
   //******************************************************
  // SESSION METHODS
  //*******************************************************
  // gives us reminder before the webapi expires
  public startSessionTimer(sessionLengthInSeconds: number): void {
    // what we do here is: we are creating a breaking point when the token
    // needs to be refreshed before the wep api session elapses 
    // so we are taking 1 minutes(60 seconds) from the web api session
    // with that we can call the refresh token method and give it time 
    // to get the refresh token before the original expires so we don't get UnAuthorized error.
    // We have WORKING refresh token happening 1 minute after the IDLE would have happened
    // if we were IDLE for session -2 minutes. So we would have have session cleared.
    if (this.userSession !== null) {       
           this.timer = setTimeout(() => {
                    this.refreshTokenClient();
                    //console.log("refresh from working has happend");
                    //alert("Session has been extended with refresh token and new idles started.");
                  }, (sessionLengthInSeconds - 60) * 1000);
    }
  }

  // called when logout is happening
  public clearSessionTimer() {
          // kill timer if one exists
          if (this.timer !== null) {
                  clearTimeout(this.timer);
                  this.timer = 0;
          }
  }

  // gets the date and time when webapi session expires
  private tokenExpiresInDate(sessionTime: number): Date {   
    return moment().add(sessionTime - 60, 'seconds').toDate();      
  }

  // NOT USED we will use this method for all authorization method before me make a call
  // this is used in situations when we are constantly working
  // the IDLE situation is handled by the IDLE methods on the app component
  public refreshTokenWhenNotIdle() {
        if (this.userSession != null) {
              if (moment().isAfter(this.userIdentity.accessTokenExpiresDate)) {
                    this.refreshTokenClient();
              }
        }
  }

 // identity section
  private storeUserIdentity(userIdentity: any) {
      sessionStorage["UserIdentity"] = JSON.stringify(userIdentity);
  }

  private getUserIdentity() {
      return this.userIdentity;
  }

  private removeUserIdentity() {
      this.userIdentity = null;
      sessionStorage["UserIdentity"] = "null";
  }

  private init() {
      if (sessionStorage["UserIdentity"] != "null")  {
          this.userIdentity = JSON.parse(sessionStorage["UserIdentity"]);
      }
  }

 // authentication section
  private storeAuthData(authData: Authentication) {
    sessionStorage["Authentication"] = JSON.stringify(authData);
  }

  private getAuthData() {
    return this.authentication;
  }

  private removeAuthData() {
    this.authentication = null;    
    sessionStorage["Authentication"] = "null";
  }

  private initAuthData() {
    if (sessionStorage["Authentication"] != "null") {
      this.authentication = JSON.parse(sessionStorage["Authentication"]);
    }
  }

  // session section
  private storeUsersSession(session: UserSession) {
      sessionStorage["UserSession"] = JSON.stringify(session);
  }

  public getUserSession() {
      return this.userSession;
  }

  private removeUserSession() {
      this.userSession = null;
      sessionStorage["UserSession"] = "null";
  }

  private initUserSession() {
      if (sessionStorage["UserSession"] != "null") {
          this.userSession = JSON.parse(sessionStorage["UserSession"]);
      }
  }

}
