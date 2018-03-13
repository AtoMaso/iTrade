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
    //TODO header here for authentication to be added
      return this.httpClientService.get<Subcategory[]>(subcategoriesUrl).retry(1);
  }


    public getSubcategoriesByCategoryId(categoryId: number): Observable<Subcategory[]> {
    // this is anonymous
      return this.httpClientService.get<Subcategory[]>(subcategoriesByCategoryIdUrl + `?categoryId=${categoryId}`).retry(1);
  }


    public getSubcategory(id: number): Observable<Subcategory> {
    //TODO header here for authentication to be added
      return this.httpClientService.get<Subcategory>(subcategoryUrl + `${id}`).retry(1);

  }

}
