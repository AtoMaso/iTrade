import { Inject, Injectable, OnInit} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { LoggerService } from '../logger/logger.service';
import {ProcessMessage } from '../../helpers/classes';


@Injectable()
export class ProcessMessageService {

    public allProcessMessages: ProcessMessage[]= [];
    public behaviorProcessMessageStore: BehaviorSubject<ProcessMessage> = new BehaviorSubject(null);
    public behaviorMessageObserver$: Observable<ProcessMessage> = this.behaviorProcessMessageStore.asObservable(); 

    public behaviorRouteStore: BehaviorSubject<string> = new BehaviorSubject(null);
    public behaviorRouteObserver$: Observable<string> = this.behaviorRouteStore.asObservable(); 

  constructor(private httpService: Http, private loggerService: LoggerService) { };


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

    return this.httpService.get("../assets/processmessages.json")
            .map((messages: Response) => <ProcessMessage[]>messages.json().data)
            .catch((error: Response) => this.onError(error, "GetProcessmessageFromRepository"));
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

}
