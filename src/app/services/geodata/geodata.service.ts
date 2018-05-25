import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

import {AuthenticationService } from '../authentication/authentication.service';
import { GeoData, State } from '../../helpers/classes';

let geodataStatesWithDataUrl = CONFIG.baseUrls.geodataStatesWthData;
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
  public getStatesWithData(): Observable<State[]> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
    return this.httpClientService.get<State[]>(geodataStatesWithDataUrl, httpOptions).retry(1);
  }



  public getStates(): Observable<GeoData[]> {
    // prepare the headesrs
    //const httpOptions = {
    //  headers: new HttpHeaders({
    //    'Accept': 'application/json',
    //    'Content-Type': 'application/json',
    //    'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
    //  })
    //};
    return this.httpClientService.get<GeoData[]>(geodataStatesUrl).retry(1);
  }


  public getPlacesByStateCode(statecode: string): Observable<GeoData[]> {

    // prepare the headesrs
    //const httpOptions = {
    //  headers: new HttpHeaders({
    //    'Accept': 'application/json',
    //    'Content-Type': 'application/json',
    //    'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
    //  })
    //};

    return this.httpClientService.get<GeoData[]>(geodataPlacesByStateCodeUrl + `?statecode=${statecode}`).retry(1);
  }


  public getPostcodesByPlaceNameAndStateCode(placename: string, statecode: string): Observable<GeoData[]> {
    // prepare the headesrs
    //const httpOptions = {
    //  headers: new HttpHeaders({
    //    'Accept': 'application/json',
    //    'Content-Type': 'application/json',
    //    'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
    //  })
    //};

    return this.httpClientService.get<GeoData[]>(geodataPostcodesByPlaceNameAndStateCodeUrl + `?placename=${placename}&statecode=${statecode}`).retry(1);
  }





  public getSuburbssByPostcodeNumberAndPlaceName(postcodenumber: string, placename: string): Observable<GeoData[]> {
    // prepare the headesrs
    //const httpOptions = {
    //  headers: new HttpHeaders({
    //    'Accept': 'application/json',
    //    'Content-Type': 'application/json',
    //    'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
    //  })
    //};

    return this.httpClientService.get<GeoData[]>(geodataSuburbsByPostcodeNumberAndPlaceNameUrl + `?postcodenumber=${postcodenumber}&placename=${placename}`).retry(1);
  }


  //******************************************************
  // ADD GEO PLACE
  //******************************************************
  public addGeoRecord(georecord: GeoData): Observable<GeoData> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.post<GeoData>(addGeoRecordUrl, georecord, httpOptions).retry(1);
  }


  //******************************************************
  // UPDATE GEO PLACE
  //******************************************************
  public updateGeoRecord(georecord: GeoData): Observable<GeoData> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updateGeoRecordUrl}?geoid=${georecord.id}`;
    return this.httpClientService.put<GeoData>(localUrl, georecord, httpOptions).retry(1);
  }


  //******************************************************
  // DELETE GEO PLACE
  //******************************************************
  public deleteGeoRecord(id: number): Observable<GeoData> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deleteGeoRecordUrl}?geoid=${id}`; // DELETE api/geodatas/Delete?id=1
    return this.httpClientService.delete<GeoData>(localUrl, httpOptions);
  }


}

