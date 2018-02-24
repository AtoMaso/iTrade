import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry'; 

import { LoggerService } from '../logger/logger.service';
import { Category, UserSession} from '../../helpers/classes';

let categoriesUrl = CONFIG.baseUrls.categories;
let categoryUrl = CONFIG.baseUrls.category;
let updateCategoryUrl = CONFIG.baseUrls.updatecategory;
let addCategoryUrl = CONFIG.baseUrls.addcategory;
let deleteCategoryUrl = CONFIG.baseUrls.deletecategory;



@Injectable()
export class CategoryService {   
    private localUrl: string;
    private session: UserSession;

  constructor(private httpClientService: HttpClient, private loggerService: LoggerService) {

      if (sessionStorage["UserSession"] !== "null") {
        this.session = JSON.parse(sessionStorage["UserSession"]);
      }
    };   



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
