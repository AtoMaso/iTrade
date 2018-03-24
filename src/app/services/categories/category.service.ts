import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry'; 

import {AuthenticationService } from '../authentication/authentication.service';
import { Category } from '../../helpers/classes';

let categoriesUrl = CONFIG.baseUrls.categories;
let categoryUrl = CONFIG.baseUrls.category;
let updateCategoryUrl = CONFIG.baseUrls.updatecategory;
let addCategoryUrl = CONFIG.baseUrls.addcategory;
let deleteCategoryUrl = CONFIG.baseUrls.deletecategory;



@Injectable()
export class CategoryService {   
  private localUrl: string;

  constructor(private httpClientService: HttpClient, private authenticationService: AuthenticationService) { };


    //******************************************************
    // GET CATEGORIES
    //******************************************************  
  public getCategories() {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    this.localUrl = categoriesUrl;
    return this.httpClientService.get(this.localUrl, httpOptions).retry(1);   

  }


    //******************************************************
    // GET CATEGORY
    //****************************************************** 
  

    //******************************************************
    // ADD CATEGORY
    //******************************************************
  public addCategory(category: Category): Observable<Category> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.post<Category>(addCategoryUrl, category, httpOptions).retry(1);
  }

 
  

    //******************************************************
    // UPDATE CATEGORY
    //******************************************************
  public updateCategory(category: Category): Observable<Category> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updateCategoryUrl}?categoryId=${category.categoryId}`;
    return this.httpClientService.put<Category>(localUrl, category, httpOptions).retry(1);
  }


 //******************************************************
 // DELETE CATEGORY
 //******************************************************
  public deleteCategory(categoryId: number): Observable<Category> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deleteCategoryUrl}?categoryId=${categoryId}`; // DELETE api/categories/DeleteCategory?categoryId=1
    return this.httpClientService.delete<Category>(localUrl, httpOptions);
  }
}
