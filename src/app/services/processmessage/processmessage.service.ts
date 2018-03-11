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
let deleteMessageUrl = CONFIG.baseUrls.deletemessage;


@Injectable()
export class ProcessMessageService {

  public allProcessMessages: ProcessMessage[] = [];
  public localProcessMessage: ProcessMessage = new ProcessMessage();

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
  // method called from the appmodule to initialis all process messages!!!!!!!!!!!!!!!
  public getProcessMessage() {

    this.getProcessMessagesFromRepository().subscribe(
      (messages: ProcessMessage[]) => {
        this.allProcessMessages = messages
      });
  }


  // get the process messages from the api json repository
  public getProcessMessagesFromRepository(): Observable<ProcessMessage[]> {

    return this.httpClientService.get<ProcessMessage[]>(messagessUrl).retry(1)
      .catch((err: HttpErrorResponse, result) => {

        if (err.error instanceof Error) { this.handleError("getTradesApi method in the tradeapi service error", err); }
        else { this.handleError("getTradesApi method in the tradeapi service error", err); }       
        return Observable.of<any>();
      });

  }


  // raises the event which the app component is subcribed to
  // and the message id passed to the child control on the app component
  public emitProcessMessage(code: string, message?: string) {

   

    if (code === "PME") {
      this.localProcessMessage = new ProcessMessage();
      this.localProcessMessage.messageText = message;
      this.localProcessMessage.messageTypeDescription = "error";
    }
    else {
      try {

        this.localProcessMessage = this.allProcessMessages.find(pm => pm.messageCode === code);

      } catch (exception) {

          this.localProcessMessage = new ProcessMessage();
          this.localProcessMessage.messageText = "Unexprected error has occured. Please contact the application administration!";
          this.localProcessMessage.messageTypeDescription = "error";
      }     
  }

    if (this.localProcessMessage === undefined || this.localProcessMessage === null) {    
      if (message) {
        this.localProcessMessage = new ProcessMessage();
        this.localProcessMessage.messageText = message;
        this.localProcessMessage.messageTypeDescription = "error";
      }
      else {
        this.localProcessMessage = new ProcessMessage();
        this.localProcessMessage.messageText = "Unexprected error has occured. Please contact the application administration!";
        this.localProcessMessage.messageTypeDescription = "error";
      }
    }
  

    this.behaviorProcessMessageStore.getValue();
    this.behaviorProcessMessageStore.next(this.localProcessMessage);
  }
   

  // raises the event which the app component is subcribed to
  // and the messageis passed to the child control on the app component
  // this is done to remove any process message displayed and we move to the next route
  public emitRoute(id: string) {     
      this.behaviorRouteStore.next(id);
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


