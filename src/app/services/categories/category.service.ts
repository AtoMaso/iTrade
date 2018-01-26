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
import { ObjectCategory, UserSession} from '../../helpers/classes';

let categoriesUrl = CONFIG.baseUrls.categories;
let categoryUrl = CONFIG.baseUrls.category;
let updateCategoryUrl = CONFIG.baseUrls.updatecategory;
let addCategoryUrl = CONFIG.baseUrls.addcategory;
let removeCategoryUrl = CONFIG.baseUrls.removecategory;



@Injectable()
export class CategoryService {   
    private localUrl: string;
    private session: UserSession;

  constructor(private httpClientService: HttpClient, private loggerService: LoggerService) {

      if (sessionStorage["UserSession"] !== undefined) {
        this.session = JSON.parse(sessionStorage["UserSession"]);
      }
    };   



    //******************************************************
    // GET CATEGORIES
    //******************************************************  
    public getCategoriesApi(): Observable<ObjectCategory[]> {

      return this.httpClientService.get<ObjectCategory[]>(categoriesUrl)
      .retry(3)
      .catch((err: HttpErrorResponse, result) => {

        if (err.error instanceof Error) { this.handleError("Client side error occured:getCategoriesApi method in the category service error", err); }
        else { this.handleError("Server side error occured:getCategoriesApi method in the category service error", err); }       
        return Observable.throw(err);

      });
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
 
   
  ///*****************************************************
  // HELPER METHODS
  //*****************************************************
  private handleError(operation: string, err: HttpErrorResponse) {

    let errMsg = `error in ${operation}() retrieving ${err.url}`;

    // audit log the error on the server side
    this.loggerService.addError(err, `${operation} failed: ${err.message},  the URL: ${err.url}, was:  ${err.statusText}`);

    // Let the app keep running by throwing the error to the calling component where it will be couth and friendly message displayed
    return Observable.throw(errMsg);
  };
}
