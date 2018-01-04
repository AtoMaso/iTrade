import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CONFIG } from '../../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from '../logger/logger.service';
import {Image } from '../../helpers/classes';

@Injectable()
export class HelperService {

    private localUrl: string;

    constructor(private _http: Http, private _loggerService: LoggerService) { };


    //******************************************************
    // GET IMAGES
    //******************************************************
    public getImages() {
        this.localUrl = "http://localhost:3000/app/api/images.json"
        return this._http.get(this.localUrl)
          .map((response: Response) => <Image[]>response.json().data)        
          .catch(this.logError);
    }

    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    private logError(error: any) {
      
      this._loggerService.logErrors(error, "article.service");            
      return Observable.throw(error.json().error || 'Server error');
    }

}
