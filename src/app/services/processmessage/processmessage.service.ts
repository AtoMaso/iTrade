import { Inject, Injectable, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthenticationService } from '../authentication/authentication.service';
import { LoggerService } from '../logger/logger.service';
import {ProcessMessage, ProcessMessageType} from '../../helpers/classes';
import { CONFIG } from '../../config';

let messagessUrl = CONFIG.baseUrls.messages;
let messageUrl = CONFIG.baseUrls.message;
let updateMessageUrl = CONFIG.baseUrls.updatemessage;
let addMessageUrl = CONFIG.baseUrls.addmessage;
let deleteMessageUrl = CONFIG.baseUrls.deletemessage;

let messageTypesUrl = CONFIG.baseUrls.messagetypes;
let messageTypeUrl = CONFIG.baseUrls.messagetype;
let updateMessageTypeUrl = CONFIG.baseUrls.updatemessagetype;
let addMessageTypeUrl = CONFIG.baseUrls.addmessagetype;
let deleteMessageTypeUrl = CONFIG.baseUrls.deletemessagetype;

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
      private authenticationService: AuthenticationService,
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


  // get the process messages from the server
  public getProcessMessagesFromRepository(): Observable<ProcessMessage[]> {
    return this.httpClientService.get<ProcessMessage[]>(messagessUrl).retry(1);   
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



  //******************************************************
  // ADD MESSAGE
  //******************************************************
  public addProcessMessage(message: ProcessMessage): Observable<ProcessMessage> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.post<ProcessMessage>(addMessageUrl, message, httpOptions).retry(1);
  }


  //******************************************************
  // UPDATE MESSAGE
  //******************************************************
  public updateMessage(message: ProcessMessage): Observable<ProcessMessage> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updateMessageUrl}?messageId=${message.messageId}`;
    return this.httpClientService.put<ProcessMessage>(localUrl, message, httpOptions).retry(1);
  }


  //******************************************************
  // DELETE MESSAGE
  //******************************************************
  public deleteMessage(id: number): Observable<ProcessMessage> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deleteMessageUrl}?messageId=${id}`; // DELETE api/postcodes/DeleteProcessMessage?messageId=1
    return this.httpClientService.delete<ProcessMessage>(localUrl, httpOptions);
  }


  //******************************************************
  // GET PROCESS MESSAGE TYPES  HTTPCLIENT MODULE
  //******************************************************
  public getMessageTypes() {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.get<ProcessMessageType[]>(messageTypesUrl).retry(1);

  }


  //******************************************************
  // ADD MESSAGE MESSAGE TYPE
  //******************************************************
  public addMessageType(messagetype: ProcessMessageType): Observable<ProcessMessageType> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    return this.httpClientService.post<ProcessMessageType>(addMessageTypeUrl, messagetype, httpOptions).retry(1);
  }


  //******************************************************
  // UPDATE MESSAGE TYPE
  //******************************************************
  public updateMessageType(messagetype: ProcessMessageType): Observable<ProcessMessageType> {
    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${updateMessageTypeUrl}?messageTypeId=${messagetype.messageTypeId}`;
    return this.httpClientService.put<ProcessMessageType>(localUrl, messagetype, httpOptions).retry(1);
  }


  //******************************************************
  // DELETE POSTCODE
  //******************************************************
  public deletePostcode(id: number): Observable<ProcessMessageType> {

    // prepare the headesrs
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.userSession.userIdentity.accessToken}`
      })
    };

    const localUrl = `${deleteMessageTypeUrl}?id=${id}`; // DELETE api/postcodes/DeletePostcode?id=1
    return this.httpClientService.delete<ProcessMessageType>(localUrl, httpOptions);
  }

}


