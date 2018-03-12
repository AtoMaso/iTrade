import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
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
    // this is anonymous
    return this.httpClientService.get<State[]>(statesUrl).retry(1);
  }

   public getState(id:number): Observable<State> {
     //TODO heade here for authentication to be added
     return this.httpClientService.get<State>(stateUrl +`${id}`).retry(1);
   }

}