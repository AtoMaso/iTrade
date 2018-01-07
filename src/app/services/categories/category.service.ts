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
    public getCategoriesApi(): Observable<Category[]> {

      return this.httpClientService.get<Category[]>(categoriesUrl)
      .retry(3)
      .catch((err: HttpErrorResponse, result) => {

        if (err.error instanceof Error) {

          // A client-side or network error occurred. Handle it accordingly.
          console.error('Backend returned code in getCategoriesApi method:', err.error.message);

          this.handleError("getCategoriesApi method in the category service error", err);

        } else {
          // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
          console.error(`Backend returned code in getCategoriesApi service method. Status code was ${err.status}, body was: ${err.error.message} , the ${err.url}, was ${err.statusText}`);

          this.handleError("getCategoriesApi method in the category service error", err);

        }
        // return Observable.of<any>;
        // or simply an empty observable
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
 
   
  //*****************************************************
  // PRIVATE METHODS
  //*****************************************************
  //@param operation - name of the operation that failed
  //@param result - optional value to return as the observable result
  private handleError(operation, err: HttpErrorResponse) {

    // audit log the error on the server side
     this.loggerService.addError(err, `${operation} failed: ${err.error.message},  the URL: ${err.url}, was:  ${err.statusText}`);

    // Let the app keep running by throwing the error to the calling component where it will be couth and friendly message displayed
    throw (err);
  };
}
