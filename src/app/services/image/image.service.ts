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
   public getImages(): Observable<Image[]> {

    return this.httpClientService.get<Image[]>(imagesUrl).retry(1);
  }


   public getImagesByTradeId(tradeId: number): Observable<Image[]> {

      const localUrl = `${imagesUrl}/?tradeId=${tradeId}`;

      return this.httpClientService.get<Image[]>(localUrl).retry(1);
  }

}
