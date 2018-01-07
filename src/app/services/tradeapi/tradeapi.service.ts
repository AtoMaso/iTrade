import { Inject, Injectable } from '@angular/core';
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
import { Trade, UserSession, UserIdentity} from '../../helpers/classes';

let tradesUrl = CONFIG.baseUrls.trades;
let tradeUrl = CONFIG.baseUrls.trade;
let updateTradeUrl = CONFIG.baseUrls.updatetrade;
let addTradeUrl = CONFIG.baseUrls.addtrade;
let removeTradeUrl = CONFIG.baseUrls.removetrade;

@Injectable()
export class TradeApiService {
  private localUrl: string;
  private session: UserSession;

    constructor(
      private httpClientService: HttpClient,
      private loggerService: LoggerService,
      private authenticationService: AuthenticationService) {

        if (sessionStorage["UserSession"] != "null") {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }  
    };



  //******************************************************
  // GET TRADES
  //******************************************************
 public getTradesApi(): Observable<Trade[]> {

   return this.httpClientService.get<Trade[]>(tradesUrl)
      .retry(3)
      .catch((err: HttpErrorResponse, result) => {

        if (err.error instanceof Error) {

                // A client-side or network error occurred. Handle it accordingly.
                console.error('Backend returned code in getTadeApiService method:', err.error.message);

                this.handleError("getTradesApi method in the tradeapi service error", err);

               } else {
               // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
                console.error(`Backend returned code in getTadesApi service method. Status code was ${err.status}, body was: ${err.error.message} , the ${err.url }, was ${ err.statusText }`);

                 this.handleError("getTradesApi method in the tradeapi service error", err);

              }    
              // return Observable.of<any>;
              // or simply an empty observable
              return Observable.throw(err);

      });
  }


  //******************************************************
    // GET TRADES
    //******************************************************


    //******************************************************
    // ADD TRADE
    //******************************************************


    //******************************************************
    // DELETE TRADE
    //******************************************************


    //******************************************************
    // UPDATE TRADE
    //******************************************************


  ///*****************************************************
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

