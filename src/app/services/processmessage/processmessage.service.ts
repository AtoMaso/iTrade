import { Inject, Injectable, OnInit} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';


import { LoggerService } from '../logger/logger.service';
import {ProcessMessage } from '../../helpers/classes';


@Injectable()
export class ProcessMessageService {

    public allProcessMessages: ProcessMessage[]= [];
    public behaviorProcessMessageStore: BehaviorSubject<ProcessMessage> = new BehaviorSubject(null);
    public behaviorMessageObserver$: Observable<ProcessMessage> = this.behaviorProcessMessageStore.asObservable(); 

    public behaviorRouteStore: BehaviorSubject<string> = new BehaviorSubject(null);
    public behaviorRouteObserver$: Observable<string> = this.behaviorRouteStore.asObservable(); 


    private processMessagesUrl = 'api/processmessages';  // URL to web api in our case will be using in memory service object 'trades'


    constructor(private httpService: Http,
      private httpClientService: HttpClient,
      private loggerService: LoggerService) { };


  //******************************************************
  // GET PROCESS MESSAGE
  //******************************************************
  // method called from the appmodule to initialis all process messages
  public getProcessMessage() {

    this.getProcessMessagesFromRepository().subscribe(
          (messages: ProcessMessage[]) => this.allProcessMessages = messages
          , (error: Response) => this.onError(error, "GetProcessMessage"));
  }

  // get the process messages from the json repository
  public getProcessMessagesFromRepository(): Observable<ProcessMessage[]> {
      // using HTTPClient module
      return this.httpClientService.get<ProcessMessage[]>(this.processMessagesUrl)
                        .pipe(
                              tap(processmessages => this.log(`fetched process messages`)),
                              catchError(this.handleError('getProcessMessagesFromRepository', []))
      );
          // using HTTP module
            //return this.httpService.get("../assets/processmessages.json")
            //        .map((messages: Response) => <ProcessMessage[]>messages.json().data)
            //        .catch((error: Response) => this.onError(error, "GetProcessmessageFromRepository"));
  }
  
    // raises the event which the app component is subcribed to
    // and the message id passed to the child control on the app component
  public emitProcessMessage(id: string, message?: string) {

          let pm: ProcessMessage = this.allProcessMessages.find(pm => pm.id === id); 
          if (id == "PME") {
              pm.text = message;
          }
          this.behaviorProcessMessageStore.next(pm);
    }
   

    // raises the event which the app component is subcribed to
    // and the messageis passed to the child control on the app component
    public emitRoute(id: string) {     
      this.behaviorRouteStore.next(id);
    }

    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    // logs errors to the web api side
  private onError(err: any, method: string) {
    this.loggerService.logErrors(err, "processmessage.service had an error in the method " + method);
    return Observable.throw(err.json().error || 'Server error');
      //this.loggerService.logErrors(err, "processmessage.service");            
      //return Observable.throw(err.json().error || 'Server error');
    }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    //this.messageService.add('HeroService: ' + message);
  }

}
