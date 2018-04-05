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

let geodataStatesUrl = CONFIG.baseUrls.geodataStates;
let geodataPlacesByStateCodeUrl = CONFIG.baseUrls.geodataPlacesByStateCodeUrl;
let geodataPostcodesByPlaceNameAndStateCodeUrl = CONFIG.baseUrls.geodataPostcodesByPlaceNameAndStateCodeUrl;
let geodataSuburbsByPostcodeNumberUrl = CONFIG.baseUrls.geodataSuburbsByPostcodeNumberUrl;
let geodataSuburbsByPostcodeNumberAndPlaceNameUrl = CONFIG.baseUrls.geodataSuburbsByPostcodeNumberAndPlaceNameUrl;

let addGeoRecordUrl = CONFIG.baseUrls.addGeoRecord;
let updateGeoRecordUrl = CONFIG.baseUrls.updateGeoRecord;
let deleteGeoRecordUrl = CONFIG.baseUrls.deleteGeoRecord;

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


  public getPostcodesByPlaceNameAndStateCode(placename: string, statecode: string): Observable<StatePlacePostcodeSuburb[]> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<StatePlacePostcodeSuburb[]>(geodataPostcodesByPlaceNameAndStateCodeUrl + `?placename=${placename}&statecode=${statecode}`, httpOptions).retry(1);
  }





  public getSuburbssByPostcodeNumberAndPlaceName(postcodenumber: string, placename:string): Observable<StatePlacePostcodeSuburb[]> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<StatePlacePostcodeSuburb[]>(geodataSuburbsByPostcodeNumberAndPlaceNameUrl + `?postcodenumber=${postcodenumber}&placename=${placename}`, httpOptions).retry(1);
  }


  //******************************************************
  // ADD GEO PLACE
  //******************************************************
  public addGeoRecord(place: StatePlacePostcodeSuburb): Observable<StatePlacePostcodeSuburb> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.post<StatePlacePostcodeSuburb>(addGeoRecordUrl, place, httpOptions).retry(1);
  }


  //******************************************************
  // UPDATE GEO PLACE
  //******************************************************
  public updateGeoRecord(place: StatePlacePostcodeSuburb): Observable<StatePlacePostcodeSuburb> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updateGeoRecordUrl}?geoid=${place.id}`;
    return this.httpClientService.put<StatePlacePostcodeSuburb>(localUrl, place, httpOptions).retry(1);
  }


  //******************************************************
  // DELETE GEO PLACE
  //******************************************************
  public deleteGeoRecord(id: number): Observable<StatePlacePostcodeSuburb> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deleteGeoRecordUrl}?geoid=${id}`; // DELETE api/statesplacespostcodessuburbs/Delete?id=1
    return this.httpClientService.delete<StatePlacePostcodeSuburb>(localUrl, httpOptions);
  }


}

