import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

import {AuthenticationService } from '../authentication/authentication.service';
import { Place, StatePlacePostcodeSuburb } from '../../helpers/classes';


let placesUrl = CONFIG.baseUrls.places;
let placesByStateIdUrl = CONFIG.baseUrls.getplacesbystateid;
let placeUrl = CONFIG.baseUrls.place;
let updatePlaceUrl = CONFIG.baseUrls.updateplace;
let addPlaceUrl = CONFIG.baseUrls.addplace;
let deletePlaceUrl = CONFIG.baseUrls.deleteplace;

let geodataStates = CONFIG.baseUrls.geodataStates;
let geodataPlacesByStateCodeUrl = CONFIG.baseUrls.geodataPlacesByStateCodeUrl;
let geodataPostcodesByPlaceNameUrl = CONFIG.baseUrls.geodataPostcodesByPlaceNameUrl;
let geodataSuburbsByPostcodeNumberUrl = CONFIG.baseUrls.geodataSuburbsByPostcodeNumberUrl;
let geodataSuburbsByPostcodeNumberAndPlaceNameUrl = CONFIG.baseUrls.geodataSuburbsByPostcodeNumberAndPlaceNameUrl;

@Injectable()
export class GeoDataService {

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


  //******************************************************
  // GET places METHODS
  //******************************************************
  public getStates(): Observable<StatePlacePostcodeSuburb[]> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
    return this.httpClientService.get<StatePlacePostcodeSuburb[]>(geodataStatesUrl, httpOptions).retry(1);
  }


  public getPlacesByStateCode(statecode: string): Observable<StatePlacePostcodeSuburb[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<StatePlacePostcodeSuburb[]>(geodataPlacesByStateCodeUrl + `?statecode=${statecode}`, httpOptions).retry(1);
  }


  public getPostcodesByPlaceName(placename: string): Observable<StatePlacePostcodeSuburb> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<StatePlacePostcodeSuburb>(geodataPostcodesByPlaceNameUrl + `?placename=${placename}`, httpOptions).retry(1);
  }



  public getSuburbssByPostcodeNumber(postcodenumber: string): Observable<StatePlacePostcodeSuburb> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<StatePlacePostcodeSuburb>(geodataSuburbsByPostcodeNumberUrl + `?postcodenumber=${postcodenumber}`, httpOptions).retry(1);
  }




  public getSuburbssByPostcodeNumberAndPlaceName(postcodenumber: string, placename:string): Observable<StatePlacePostcodeSuburb> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<StatePlacePostcodeSuburb>(geodataSuburbsByPostcodeNumberAndPlaceNameUrl + `?postcodenumber=${postcodenumber}&placename=${placename}`, httpOptions).retry(1);
  }


  //******************************************************
  // ADD GEO PLACE
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
  // UPDATE GEO PLACE
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
  // DELETE GEO PLACE
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

