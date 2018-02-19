import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';

import { LoggerService } from '../logger/logger.service';
import { Subcategory } from '../../helpers/classes';


let subcategoriesUrl = CONFIG.baseUrls.subcategories;
let subcategoriesByCategoryIdUrl = CONFIG.baseUrls.subcategoriesbycategoryid;
let subcategoryUrl = CONFIG.baseUrls.subcategory;
let updateSubcategoryUrl = CONFIG.baseUrls.updatesubcategory;
let addSubcategoryUrl = CONFIG.baseUrls.addsubcategory;
let deleteSubcategoryUrl = CONFIG.baseUrls.deletesubcategory;

@Injectable()
export class SubcategoriesService {

  constructor(
    private httpClientService: HttpClient,
    private loggerService: LoggerService) { };


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
