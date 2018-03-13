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

    this.localUrl = categoriesUrl;
    return this.httpClientService.get(this.localUrl).retry(1);   

  }


    //******************************************************
    // GET CATEGORY
    //****************************************************** 
  

    //******************************************************
    // ADD CATEGORY
    //******************************************************
   

    //******************************************************
    // DELETE CATEGORY
    //******************************************************
  

    //******************************************************
    // UPDATE CATEGORY
    //******************************************************
 
  
}
