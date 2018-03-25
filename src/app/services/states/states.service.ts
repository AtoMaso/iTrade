import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry'; 

import {AuthenticationService } from '../authentication/authentication.service';
import { State } from '../../helpers/classes';


let statesUrl = CONFIG.baseUrls.states;
let stateUrl = CONFIG.baseUrls.state;
let updateStateUrl = CONFIG.baseUrls.updatestate;
let addStateUrl = CONFIG.baseUrls.addstate;
let deleteStateUrl = CONFIG.baseUrls.deletestate;

@Injectable()
export class StatesService {

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


  //******************************************************
 // GET STATES METHODS
  //******************************************************  
  public getStates(): Observable<State[]> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = statesUrl;
    return this.httpClientService.get<State[]>(localUrl, httpOptions).retry(1);

  }


  //******************************************************
  // GET STATE
  //****************************************************** 
  public getState(id: number): Observable<State> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
     
    return this.httpClientService.get<State>(stateUrl + `${id}`, httpOptions).retry(1);
  }




  //******************************************************
  // ADD STATE
  //******************************************************
  public addState(state: State): Observable<State> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.post<State>(addStateUrl, state, httpOptions).retry(1);
  }


  //******************************************************
  // UPDATE STATE
  //******************************************************
  public updateState(state: State): Observable<State> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updateStateUrl}/${state.id}`;
    return this.httpClientService.put<State>(localUrl, state, httpOptions).retry(1);
  }


  //******************************************************
  // DELETE STATE
  //******************************************************
  public deleteState(id: number): Observable<State> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deleteStateUrl}/${id}`; // DELETE api/states/1
    return this.httpClientService.delete<State>(localUrl, httpOptions);
  }
}
