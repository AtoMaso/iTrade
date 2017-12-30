import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Trade } from '../helpers/classes';
import { MessageService } from './message.service';
import { ProcessMessageService } from './processmessage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TradeService {

  private TradesUrl = './api/trades';  // URL to web api

  constructor(
    private httpService: HttpClient,
    private messageService: MessageService) { }

  /** GET heroes from the server */
  getTrades (): Observable<Trade[]> {
    return this.httpService.get<Trade[]>(this.TradesUrl)
      .pipe(
        tap(Trade => this.log(`fetched Trade`)),
        catchError(this.handleError('getTrade', []))
      );
  }


  /** GET Trade by id. Return `undefined` when id not found */
  getTradeNo404<Data>(id: number): Observable<Trade> {
    const url = `${this.TradesUrl}/?TradeId=${id}`;
    return this.httpService.get<Trade[]>(url)
      .pipe(
        map(Trade => Trade[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} Trade id=${id}`);
        }),
        catchError(this.handleError<Trade>(`getTrade id=${id}`))
      );
  }

  /** GET Trade by id. Will 404 if id not found */
  getTrade(id: number): Observable<Trade> {
    const url = `${this.TradesUrl}/${id}`;
    return this.httpService.get<Trade>(url).pipe(
      tap(_ => this.log(`fetched Trade id=${id}`)),
      catchError(this.handleError<Trade>(`getTrade id=${id}`))
    );
  }

  /* GET Trade whose name contains search term */
  searchTrade(term: string): Observable<Trade[]> {
    if (!term.trim()) {
      // if not search term, return empty Trade array.
      return of([]);
    }
    return this.httpService.get<Trade[]>(`api/trades/?Title=${term}`).pipe(
      tap(_ => this.log(`found Trade matching "${term}"`)),
      catchError(this.handleError<Trade[]>('searchTrade', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new Trade to the server */
  addTrade (Trade: Trade): Observable<Trade> {
    return this.httpService.post<Trade>(this.TradesUrl, Trade, httpOptions).pipe(
      tap((Trade: Trade) => this.log(`added Trade w/ id=${Trade.TradeId}`)),
      catchError(this.handleError<Trade>('addTrade'))
    );
  }

  /** DELETE: delete the Trade from the server */
  deleteTrade (Trade: Trade | number): Observable<Trade> {
    const id = typeof Trade === 'number' ? Trade : Trade.TradeId;
    const url = `${this.TradesUrl}/${id}`;

    return this.httpService.delete<Trade>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted Trade id=${id}`)),
      catchError(this.handleError<Trade>('deleteTrade'))
    );
  }

  /** PUT: update the Trade on the server */
  updateTrade (Trade: Trade): Observable<any> {
    return this.httpService.put(this.TradesUrl, Trade, httpOptions).pipe(
      tap(_ => this.log(`updated Trade id=${Trade.TradeId}`)),
      catchError(this.handleError<any>('updateTrade'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a TradeService message with the MessageService */
  private log(message: string) {
    this.messageService.add('TradeService: ' + message);
  }
}