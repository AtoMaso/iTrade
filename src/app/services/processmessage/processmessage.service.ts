import { Inject, Injectable, OnInit} from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';


import { LoggerService } from '../logger/logger.service';
import {ProcessMessage } from '../../helpers/classes';
import { CONFIG } from '../../config';

let messagessUrl = CONFIG.baseUrls.messages;
let messageUrl = CONFIG.baseUrls.message;
let updateMessageUrl = CONFIG.baseUrls.updatemessage;
let addMessageUrl = CONFIG.baseUrls.addmessage;
let removeMessageUrl = CONFIG.baseUrls.removemessage;


@Injectable()
export class ProcessMessageService {

  public allProcessMessages: ProcessMessage[] = [];

  public behaviorProcessMessageStore: BehaviorSubject<ProcessMessage> = new BehaviorSubject(null);
  public behaviorMessageObserver$: Observable<ProcessMessage> = this.behaviorProcessMessageStore.asObservable();

  public behaviorRouteStore: BehaviorSubject<string> = new BehaviorSubject(null);
  public behaviorRouteObserver$: Observable<string> = this.behaviorRouteStore.asObservable(); 

  //private processMessagesUrl = 'api/processmessages';  // URL to web api in our case will be using in memory service object 'trades'
  

  constructor(     
      private httpClientService: HttpClient,
      private loggerService: LoggerService) { };


  //******************************************************
  // GET PROCESS MESSAGE USING HTTPCLIENT MODULE
  //******************************************************
  // method called from the appmodule to initialis all process messages
  public getProcessMessage() {

    this.getProcessMessagesFromRepository().subscribe(
      (messages: ProcessMessage[]) => this.allProcessMessages = messages);
  }


  // get the process messages from the api json repository
  public getProcessMessagesFromRepository(): Observable<ProcessMessage[]> {
     // using HTTPClient module
    return this.httpClientService.get<ProcessMessage[]>(messagessUrl)  
      .retry(3)
      .catch((err: HttpErrorResponse, result) => {

        if (err.error instanceof Error) {

          // A client-side or network error occurred. Handle it accordingly.
          console.log('Backend returned code in getTadeApiService method:', err.message);

          this.handleError("getTradesApi method in the tradeapi service error", err);

        } else {
          // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
          console.log(`Backend returned code in getProcessMessagesFromRepository service method. Status code was ${err.status}, body was: ${err.message} , the ${err.url}, was ${err.statusText}`);

          this.handleError("getTradesApi method in the tradeapi service error", err);

        }
        // return Observable.of<any>;
        // or simply an empty observable
        return Observable.throw(err);

      });
  }


  // raises the event which the app component is subcribed to
  // and the message id passed to the child control on the app component
  public emitProcessMessage(code: string, message?: string) {

    let localProcessMessage: ProcessMessage 
    localProcessMessage = this.allProcessMessages.find(pm => pm.messageCode === code); 

    if (localProcessMessage === undefined || localProcessMessage === null ) {
            localProcessMessage = new ProcessMessage();
            localProcessMessage.messageText = "Unexprected error has occured. Please contact the application administration!";
            localProcessMessage.messageType = "error"
    }
    this.behaviorProcessMessageStore.getValue();
    this.behaviorProcessMessageStore.next(localProcessMessage);
  }
   

  // raises the event which the app component is subcribed to
  // and the messageis passed to the child control on the app component
  // this is done to remove any process message displayed and we move to the next route
  public emitRoute(id: string) {     
      this.behaviorRouteStore.next(id);
  }


  //*****************************************************
  // PRIVATE METHODS
  //*****************************************************
  //@param operation - name of the operation that failed
  //@param result - optional value to return as the observable result
  private handleError(operation, err: HttpErrorResponse) {

   
      // audit log the error on the server side
      this.loggerService.addError(err, `${operation} failed: ${err.message},  the URL: ${err.url}, was:  ${err.statusText}`);
    

    // Let the app keep running by throwing the error to the calling component where it will be couth and friendly message displayed
    throw (err);
  };
}


