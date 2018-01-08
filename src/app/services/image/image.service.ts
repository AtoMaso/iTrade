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

        if (err.error instanceof Error) {

          // A client-side or network error occurred. Handle it accordingly.
          console.log('Backend returned code in getImagesApi method:');

          this.handleError("getImagesApi method in the image service error", err);

        } else {
          console.error('Backend returned code in getImagesApi method:');
          // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
          //console.log(`Backend returned code in getImagesApi service method. Status code was ${err.status}, body was: ${err.error} , the ${err.url}, was ${err.statusText}`);

          this.handleError("getImagesApi method in the image service error", err);

        }
        // return Observable.of<any>;
        // or simply an empty observable
        return Observable.throw(err);

      });
  }


   public getImagesApiByTradeId(tradeId: number): Observable<Image[]> {

      const localUrl = `${imagesUrl}/?tradeId=${tradeId}`;

      return this.httpClientService.get<Image[]>(localUrl)
        .retry(3)
        .catch((err: HttpErrorResponse, result) => {

          if (err.error instanceof Error) {

            console.log("Client-side error occured.");

            // A client-side or network error occurred. Handle it accordingly.
            console.log('Backend returned code in getImagesApiByTradeId method:', err.status);

            this.handleError("getImagesApiByTradeId method in the image service error", err);

          } else {

            console.log("Server-side error occured.");

            // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
            console.log(`Backend returned code in getImagesApiByTradeId service method. Status code was ${err.status} , the ${err.url}, was ${err.statusText}`);

            this.handleError("getImagesApiByTradeId method in the image service error", err);

          }
          // return Observable.of<any>;
          // or simply an empty observable
          return Observable.throw(err);

        });
  }



  //*****************************************************
  // PRIVATE METHODS
  //*****************************************************
  //@param operation - name of the operation that failed
  //@param result - optional value to return as the observable result
  private handleError(operation, err: HttpErrorResponse) {

  
      // audit log the error on the server side
      this.loggerService.addError(err, `${operation} failed: ${err.status},  the URL: ${err.url}, was:  ${err.statusText}`);
  
    // Let the app keep running by throwing the error to the calling component where it will be couth and friendly message displayed
    throw (err);
  };

}
