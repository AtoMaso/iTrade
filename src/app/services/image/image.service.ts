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
import { Image } from '../../helpers/classes';


let imagesUrl = CONFIG.baseUrls.images;
let imageUrl = CONFIG.baseUrls.image;
let updateimageUrl = CONFIG.baseUrls.updateimage;
let addimageUrl = CONFIG.baseUrls.addimage;
let removeimageUrl = CONFIG.baseUrls.removeimage;

@Injectable()
export class ImageService {

  constructor(
    private httpClientService: HttpClient,
    private http: Http,
    private loggerService: LoggerService) { };


    //******************************************************
    // GET IMAGES METHODS
    //******************************************************
   public getImagesApi(): Observable<Image[]> {

    return this.httpClientService.get<Image[]>(imagesUrl)
      .retry(3)
      .catch((err: HttpErrorResponse, result) => {

        if (err.error instanceof Error) { this.handleError("getImagesApi method in the image service error", err); }
        else { this.handleError("getImagesApi method in the image service error", err); }        
        return Observable.throw(err);

      });
  }


   public getImagesApiByTradeId(tradeId: number): Observable<Image[]> {

      const localUrl = `${imagesUrl}/?tradeId=${tradeId}`;

      return this.httpClientService.get<Image[]>(localUrl)
        .retry(3)
        .catch((err: HttpErrorResponse, result) => {
          if (err.error instanceof Error) { this.handleError("Client method error ocured: getImagesApiByTradeId method in the image service error.", err); }
          else { this.handleError("Server side error occured: getImagesApiByTradeId method in the image service error", err); }       
          return Observable.throw(err);

        });
  }


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
