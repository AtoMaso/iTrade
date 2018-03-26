import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
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
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
    return this.httpClientService.get<Place[]>(placesUrl, httpOptions).retry(1);
  }


  public getPlacesByStateId(stateId: number): Observable<Place[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<Place[]>(placesByStateIdUrl +`?stateId=${stateId}`, httpOptions).retry(1);
  }


  public getPlace(id: number): Observable<Place> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<Place>(placeUrl + `${id}`, httpOptions).retry(1);
  }



  //******************************************************
  // ADD PLACE
  //******************************************************
  public addPlace(place: Place): Observable<Place> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.post<Place>(addPlaceUrl, place, httpOptions).retry(1);
  }


  //******************************************************
  // UPDATE PLACE
  //******************************************************
  public updatePlace(place: Place): Observable<Place> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updatePlaceUrl}?id=${place.id}`;
    return this.httpClientService.put<Place>(localUrl, place, httpOptions).retry(1);
  }


  //******************************************************
  // DELETE PLACE
  //******************************************************
  public deletePlace(id: number): Observable<Place> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deletePlaceUrl}?id=${id}`; // DELETE api/places/DeletePlace?id=1
    return this.httpClientService.delete<Place>(localUrl, httpOptions);
  }
}

