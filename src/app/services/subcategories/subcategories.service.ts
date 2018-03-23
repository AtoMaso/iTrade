import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

import {AuthenticationService } from '../authentication/authentication.service';
import { Subcategory } from '../../helpers/classes';


let subcategoriesUrl = CONFIG.baseUrls.subcategories;
let subcategoriesByCategoryIdUrl = CONFIG.baseUrls.subcategoriesbycategoryid;
let subcategoryUrl = CONFIG.baseUrls.subcategory;
let updateSubcategoryUrl = CONFIG.baseUrls.updatesubcategory;
let addSubcategoryUrl = CONFIG.baseUrls.addsubcategory;
let deleteSubcategoryUrl = CONFIG.baseUrls.deletesubcategory;

@Injectable()
export class SubcategoriesService {

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


  //******************************************************
  // GET places METHODS
  //******************************************************
    public getSubcategories(): Observable<Subcategory[]> {
      // prepare the headesrs
      const httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
        })
      };

      return this.httpClientService.get<Subcategory[]>(subcategoriesUrl, httpOptions).retry(1);
  }


    public getSubcategoriesByCategoryId(categoryId: number): Observable<Subcategory[]> {
    // this is anonymous
      return this.httpClientService.get<Subcategory[]>(subcategoriesByCategoryIdUrl + `?categoryId=${categoryId}`).retry(1);
  }


    public getSubcategory(id: number): Observable<Subcategory> {   
      const httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
        })
      };
      return this.httpClientService.get<Subcategory>(subcategoryUrl + `${id}`, httpOptions).retry(1);

  }

  public addSubcategory(subcategory:Subcategory): Observable<Subcategory> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.post<Subcategory>(addSubcategoryUrl, subcategory, httpOptions ).retry(1);

  }

  public updateSubcategory(subcategory: Subcategory): Observable<Subcategory> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updateSubcategoryUrl}?subcategoryId=${subcategory.subcategoryId}`;
    return this.httpClientService.put<Subcategory>(updateSubcategoryUrl, subcategory, httpOptions).retry(1);

  }

}
