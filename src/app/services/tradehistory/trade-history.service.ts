import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable} from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';

import { LoggerService } from '../logger/logger.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { TradeHistory, UserSession, UserIdentity} from '../../helpers/classes';

let tradehistoriesUrl = CONFIG.baseUrls.tradehistories;
let pagesOfHistoriesUrl = CONFIG.baseUrls.pagesoftradehistories;
let tradeHistoryUrl = CONFIG.baseUrls.tradehistory;
let updateTradeHistoryUrl = CONFIG.baseUrls.updatetradehistory;
let addTradeHistoryUrl = CONFIG.baseUrls.addtradehistory;
let removeTradeHistoryUrl = CONFIG.baseUrls.removetradehistory;


@Injectable()
export class TradeHistoryService {

  constructor(
    private httpClientService: HttpClient,
    private loggerService: LoggerService) { };


  //******************************************************
  // GET IMAGES METHODS
  //******************************************************
    public getTradeHistoryApi(): Observable<TradeHistory[]> {

      return this.httpClientService.get<TradeHistory[]>(tradehistoriesUrl).retry(3);
  }


    public getTradeHistoryByTradeId(tradeId: number): Observable<TradeHistory[]> {

          const localUrl = `${tradehistoriesUrl}?tradeId=${tradeId}`;

          return this.httpClientService.get<TradeHistory[]>(localUrl).retry(3);
  }

}
