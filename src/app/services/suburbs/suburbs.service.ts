import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

import { AuthenticationService } from '../authentication/authentication.service';
import { Suburb } from '../../helpers/classes';


let suburbsUrl = CONFIG.baseUrls.suburbs;
let subursbByPostcodeIdUrl = CONFIG.baseUrls.getsuburbsbypostcodeid;
let suburbUrl = CONFIG.baseUrls.suburb;
let updateSuburbUrl = CONFIG.baseUrls.updatesuburb;
let addSuburbUrl = CONFIG.baseUrls.addsuburb;
let deleteSuburbUrl = CONFIG.baseUrls.deletesuburb;

@Injectable()
export class SuburbsService {

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


  //******************************************************
  // GET suburbs METHODS
  //******************************************************
  public getSuburbs(): Observable<Suburb[]> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
    return this.httpClientService.get<Suburb[]>(suburbsUrl, httpOptions).retry(1);
  }


  public getSuburbsByPostcodeId(postcodeId: number): Observable<Suburb[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<Suburb[]>(subursbByPostcodeIdUrl + `?postcodeId=${postcodeId}`, httpOptions).retry(1);
  }


  public getSuburb(id: number): Observable<Suburb> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<Suburb>(suburbUrl + `${id}`, httpOptions).retry(1);
  }




  //******************************************************
  // ADD SUBURB
  //******************************************************
  public addSuburb(suburb: Suburb): Observable<Suburb> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.post<Suburb>(addSuburbUrl, suburb, httpOptions).retry(1);
  }


  //******************************************************
  // UPDATE SUBURB
  //******************************************************
  public updateSuburb(suburb: Suburb): Observable<Suburb> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updateSuburbUrl}/${suburb.id}`;
    return this.httpClientService.put<Suburb>(localUrl, suburb, httpOptions).retry(1);
  }


  //******************************************************
  // DELETE SUBURB
  //******************************************************
  public deleteSuburb(id: number): Observable<Suburb> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deleteSuburbUrl}/${id}`; // DELETE api/suburbs/1
    return this.httpClientService.delete<Suburb>(localUrl, httpOptions);
  }
}

