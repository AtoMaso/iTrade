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
import { Place } from '../../helpers/classes';


let placesUrl = CONFIG.baseUrls.places;
let placesByStateIdUrl = CONFIG.baseUrls.getplacesbystateid;
let placeUrl = CONFIG.baseUrls.place;
let updatePlaceUrl = CONFIG.baseUrls.updateplace;
let addPlaceUrl = CONFIG.baseUrls.addplace;
let deletePlaceUrl = CONFIG.baseUrls.deleteplace;

@Injectable()
export class PlacesService {

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


  //******************************************************
  // GET places METHODS
  //******************************************************
  public getPlaces(): Observable<Place[]> {
    //TODO heade here for authentication to be added
    return this.httpClientService.get<Place[]>(placesUrl).retry(1);
  }


  public getPlacesByStateId(stateId: number): Observable<Place[]> {
    // this is anonymous
    return this.httpClientService.get<Place[]>(placesByStateIdUrl +`?stateId=${stateId}`).retry(1);
  }


  public getPlace(id: number): Observable<Place> {
     //TODO heade here for authentication to be added
    return this.httpClientService.get<Place>(placeUrl + `${id}`).retry(1);
  }

}
