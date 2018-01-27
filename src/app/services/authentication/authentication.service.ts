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
      .map(res => this.onLoginSuccess(res)
      , (err: HttpErrorResponse) => {
        if (err.error instanceof Error) { this.handleError("Client side error occured: loginClient method in the authentication service", err); }
        else { this.handleError("Server side error occured:loginClient method in the authentication service", err); }
        return Observable.throw(err);
      });
      //this.handleError("Login", error));
}


// grabs the refresh token when IDLE requires or WORKING session is close to expiry
  public refreshTokenClient() {
    var data = "grant_type=refresh_token&refresh_token=" + this.userIdentity.refreshToken + "&client_id=";
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' })

    return this.httpClientService.post(serviceBase + "Token", data, {headers: httpHeaders})
      // this should be subscibe as we need to run onLoginSuccess
      .subscribe(res => this.onLoginSuccess(res) 
      , (err: HttpErrorResponse) => {
        if (err.error instanceof Error) { this.handleError("Client side error occured: loginClient method in the authentication service", err); }
        else { this.handleError("Server side error occured:refreshTokenClient method in the authentication service", err); }
        return Observable.throw(err);
      });
        //this.handleError("RefreshToken", error)
     
  }

  
  //******************************************************
  // Register new account
  //******************************************************
  public register(user: RegisterBindingModel) {      
  
    let body = JSON.stringify(user);
    let httpHeaders = new Headers();
    httpHeaders.append('Accept', 'application/json'); 
    httpHeaders.append('Content-Type', 'application/json');

    return this.httpService.post(serviceAccount + "Register", body, { headers: httpHeaders })
      .map((res: Response) => this.onSucessRegistering(res)
      , (error: HttpErrorResponse) => this.handleError("Register", error));
  }



  //******************************************************
  // Logout the logged in user
  //******************************************************
  public logOut() {
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
      this.userIdentity.userId = body.Id;
      this.userIdentity.name = body.firstName + " " + body.middleName + " " + body.lastName;
      this.userIdentity.roles = body.roles.split(",");

      // authentication
      this.authentication.isAuthenticated = true;
      this.authentication.authenticationType = this.userIdentity.accessTokenType;

      // session
      this.userSession.authentication = this.authentication;
      this.userSession.userIdentity = this.userIdentity;

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


  public emitUserSession(passedSession: UserSession) {
    this.behaviorSessionStore.next(passedSession);
  } 
 
  private onSucessRegistering(response: any) {
     // maybe some logic here but for now code below causes issues as is treated as error passed to the component    
      //let errors: any = [];
      //for (var key in response.data.modelState) {
      //    for (var i = 0; i < response.data.modelState[key].length; i++) {
      //        errors.push(response.data.modelState[key][i]);
      //    }
      //}
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
  // the IDLE situation is handled by the IDLE methods on the app
  // component
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


  //*****************************************************
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


 //******************************************************
  // Login/Get token
  //******************************************************
  //public login(trader: LoginModel) {

  //    var data = "grant_type=password&username=" + trader.UserName + "&password=" + trader.Password;
  //    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' })    

  //    return this.httpService.post(serviceBase + "Token", data, { headers: headers })       
  //        .map(res => this.onLoginSuccess(res) // this should be .map as the component is subscribing for it
  //        , (error:Response) => this.onLoginError(error, "Login"));

  //}

  //// grabs the refresh token when IDLE requires or WORKING session is close to expiry
  //public refreshToken() {
  //  var data = "grant_type=refresh_token&refresh_token=" + this.userIdentity.refreshToken + "&client_id=";  
  //  let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' })

  //  return this.httpService.post(serviceBase + "Token", data, { headers: headers })
  //      .subscribe(res => this.onLoginSuccess(res) // this should be subscibe as we need to run onLoginSuccess
  //      ,(error:any) => this.onLoginError(error, "RefreshToken")); 
  //}

  // used by the token interceptor
  //public getToken() {
  //  return this.userIdentity.accessToken;
  //}
