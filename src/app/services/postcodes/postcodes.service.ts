import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

import { AuthenticationService } from '../authentication/authentication.service';
import { Postcode } from '../../helpers/classes';


let postcodesUrl = CONFIG.baseUrls.postcodes;
let postcodesByPlaceIdUrl = CONFIG.baseUrls.getpostcodesbyplaceid;
let postcodeUrl = CONFIG.baseUrls.postcode;
let updatePostcodeUrl = CONFIG.baseUrls.updatepostcode;
let addPostcodeUrl = CONFIG.baseUrls.addpostcode;
let deletePostcodeUrl = CONFIG.baseUrls.deletepostcode;

@Injectable()
export class PostcodesService {

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


  //******************************************************
  // GET POSTCODES METHODS
  //******************************************************
  public getPostcodes(): Observable<Postcode[]> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };
    return this.httpClientService.get<Postcode[]>(postcodesUrl, httpOptions).retry(1);
  }


  public getPostcodesByPlaceId(placeid: number): Observable<Postcode[]> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<Postcode[]>(postcodesByPlaceIdUrl + `?placeid=${placeid}`, httpOptions).retry(1);
  }


  public getPostcode(id: number): Observable<Postcode> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<Postcode>(postcodeUrl + `${id}`, httpOptions).retry(1);
  }




  //******************************************************
  // ADD POSTCODE
  //******************************************************
  public addPostcode(postcode: Postcode): Observable<Postcode> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.post<Postcode>(addPostcodeUrl, postcode, httpOptions).retry(1);
  }


  //******************************************************
  // UPDATE POSTCODE
  //******************************************************
  public updatePostcode(postcode: Postcode): Observable<Postcode> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updatePostcodeUrl}/${postcode.id}`;
    return this.httpClientService.put<Postcode>(localUrl, postcode, httpOptions).retry(1);
  }


  //******************************************************
  // DELETE POSTCODE
  //******************************************************
  public deletePostcode(id: number): Observable<Postcode> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deletePostcodeUrl}/${id}`; // DELETE api/postcodes/1
    return this.httpClientService.delete<Postcode>(localUrl, httpOptions);
  }
}

