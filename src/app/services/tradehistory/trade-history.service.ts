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
let tradehistoriesbytradeid = CONFIG.baseUrls.tradehistoriesbytradeid;
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
  // TRADE HISTORIES METHODS
  //******************************************************
  public getTradeHistoriesApi(): Observable<TradeHistory[]> {

    return this.httpClientService.get<TradeHistory[]>(tradehistoriesUrl).retry(1);
  }


  // get history for a tade
  public getTradeHistoriesByTradeId(tradeId: number): Observable<TradeHistory[]> {

    const localUrl = `${tradehistoriesbytradeid}?tradeId=${tradeId}`;

    return this.httpClientService.get<TradeHistory[]>(localUrl).retry(1);
  }


  // add new history for a trade
  public addTradeHistory(tradehistory: TradeHistory): Observable<TradeHistory> {

    const localUrl = `${addTradeHistoryUrl}`;

    return this.httpClientService.post<TradeHistory>(localUrl, tradehistory);
  }

}