import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import { ValidationService } from '../../services/validation/validation.service';
import { LoggerService } from '../../services/logger/logger.service';
import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';
// components
import { UserSession, PageTitle, State, ProcessMessage, ProcessMessageType} from '../../helpers/classes';
import { SpinnerOneComponent } from '../controls/spinner/spinnerone.component';

@Component({
  selector: 'app-processmessagesadmin',
  templateUrl: './processmessagesadmin.component.html',
  styleUrls: ['./processmessagesadmin.component.scss']
})
export class ProcessMessagesAdminComponent implements OnInit {

  private traderId: string;
  private isRequesting: boolean;
  private session: UserSession;

  private messagesForm: FormGroup;
  private messages: ProcessMessage[] = [];
  private messageInView: ProcessMessage;
  private tempAddUpdateMessage: ProcessMessage;
  private defaultMessage: ProcessMessage;
  private isMessageAddOn: boolean = false;
  private isMessageEditOn: boolean = false;
  private updatedMessage: ProcessMessage;
  private addedMessage: ProcessMessage;
  private removedMessage: ProcessMessage;
  private messageToRemove: ProcessMessage;
 


  private typesForm: FormGroup;
  private types: ProcessMessageType[] = [];
  private typeInView: ProcessMessageType;
  private tempAddUpdateType: ProcessMessageType;
  private defaultType: ProcessMessageType;
  private isTypeAddOn: boolean = false;
  private isTypeEditOn: boolean = false;
  private updatedType: ProcessMessageType;
  private addedType: ProcessMessageType;
  private removedType: ProcessMessageType;
  private typeToRemove: ProcessMessageType;



  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private processMessagesService: ProcessMessageService,    
    private pageTitleService: PageTitleService,   
    private loggerService: LoggerService) { }



  ngOnInit() {
    this.getUserSession();
    this.initialiseComponent();

    this.getMessages();

    this.setMessagesForm();
    this.setMessageTypesForm();
  }


  //************************************************************
  // GET DATA METHODS
  //************************************************************
  public getMessages() {
    this.processMessagesService.getProcessMessagesFromRepository()
      .subscribe((res: ProcessMessage[]) => {
        this.onSuccessMessages(res);
      }
      , (error: Response) => this.onError(error, "getProcessMessages"));
  }

  private onSuccessMessages(messages: ProcessMessage[]) {
    this.messages = null;
    // collections return zero length when no record found as it is initialised
    if (messages.length == 0) {
      this.messages = null;
      this.messageInView = null;
    }
    else {
      this.messages = messages;
      if (this.updatedMessage) {
        this.messageInView = this.updatedMessage;
        this.updatedMessage = null;
      }
      else if (this.addedMessage) {
        this.messageInView = this.addedMessage;
        this.addedMessage = null;
      }
      else if (this.updatedMessage) {
        this.messageInView = this.updatedMessage;
        this.updatedMessage = null;
      }
      else if (this.removedType) {
        this.messageInView = this.removedMessage;
        this.removedType = null;
      }
      else { this.messageInView = this.messages[0]; }

      // get the message types for this state
      this.getMessageTypes();
    }
  }



  private getMessageTypes() {
    this.processMessagesService.getMessageTypes()
      .subscribe((res: ProcessMessageType[]) => {
        this.onSuccessTypes(res);
      }
      , (error: Response) => this.onError(error, "getMessageTypes"));
  }

  private onSuccessTypes(passedtypes: ProcessMessageType[]) {

    this.types = null;
    // collections return zero length when no record found as it is initialised
    if (passedtypes.length == 0) {
      this.types = null;
      this.typeInView = null;
    }
    else {
      this.types = passedtypes;
      if (this.updatedType) {
        this.typeInView = this.updatedType;
        this.updatedType = null;
      }
      else if (this.addedType) {
        this.typeInView = this.addedType;
        this.addedType = null;
      }  
      else { this.typeInView = this.types[0]; }
    }
  }




  //************************************************************
  // SETUP FORM METHODS
  //************************************************************
  private setMessagesForm() {
    this.messagesForm = this.formBuilder.group({
      type: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required]),
    });
  }

  private setMessageTypesForm() {
    this.typesForm = this.formBuilder.group({
      descritpion: new FormControl('', [Validators.required]),
    });
  }



  private setMessagesFormDefaults() {

    let m: number = 0;
    for (m = 0; m < this.messages.length; m++) {
      if (this.messages[m].messageCode == this.messageInView.messageCode) {
        this.defaultMessage = this.messages[m];
        break;
      }
    }

    setTimeout(() => {
      this.messagesForm.setValue({
        type: this.defaultMessage.messageTypeDescription,
        code: this.defaultMessage.messageCode,
        text: this.defaultMessage.messageText,
      });
    }, 30);
  }

  private setMessageTypesFormDefaults() {

    let m: number = 0;

    for (m = 0; m < this.types.length; m++) {
      if (this.types[m].messageTypeId == this.typeInView.messageTypeId) {
        this.defaultType = this.types[m];
        break;
      }
    }

    setTimeout(() => {
      this.typesForm.setValue({
        description: this.defaultType.messageTypeDescription
      });
    }, 30);
  }




  //*****************************************************
  // SCREEN CHANGE STATES 
  //*****************************************************
  private onViewStateChange(state: any) {
    let m: number = 0;
    for (m = 0; m < this.messages.length; m++) {

      if (this.messages[m].messageCode === state.target.messageCode) {
        // set messages
        this.messageInView = this.messages[m];
        this.tempAddUpdateMessage = this.messages[m];
        this.setMessagesFormDefaults();

        // reset places, postcodes and suburbs
        this.isMessageAddOn = false;
        this.isMessageEditOn = false;
        this.isMessageAddOn = false;
        this.isMessageEditOn = false;
        this.isTypeAddOn = false;
        this.isTypeEditOn = false;
        this.getMessages();
        this.setMessagesFormDefaults();
      }
    }
  }


  private onMessageAddClick() {
    this.processMessagesService.emitRoute("nill");
    this.isMessageAddOn = true;
    this.isMessageEditOn = false;
    this.setMessagesForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.messageInView) {
      this.tempAddUpdateMessage = this.messageInView;
      this.messageInView = null;
    }
  }


  private onMessageEditClick() {
    this.processMessagesService.emitRoute("nill");
    this.isMessageEditOn = true;
    this.isMessageAddOn = true;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateMessage = this.messageInView;
    this.setMessagesForm();
    this.setMessagesFormDefaults();
  }


  private onMessageAddEditCancel() {
    this.processMessagesService.emitRoute("nill");
    if (this.isMessageAddOn == true) { this.isMessageAddOn = false; }
    if (this.isMessageEditOn == true) { this.isMessageEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateMessage) { this.messageInView = this.tempAddUpdateMessage; }
  }


  private onSubmitMessageAddUpdate() {

    this.removedMessage = null;
    this.processMessagesService.emitRoute("nill");
    let message: ProcessMessage = this.prepareAddUpdateMessage();

    if (this.isMessageAddOn && message) {

      // add new state
      this.processMessagesService.addProcessMessage(message)
        .subscribe((response: ProcessMessage) => {
          // reset the others
          this.updatedMessage = null;
          this.removedMessage = null;
          // get the new state so we can display it when we come from the server
          this.addedMessage = response;
          // show success
          this.processMessagesService.emitProcessMessage("????");
          // get the new data from the server
          this.getMessages();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitMessageAdd"));

      // go back to view
      this.isMessageAddOn = !this.isMessageAddOn;

    }


    if (this.isMessageEditOn && message) {

      // update state
      this.processMessagesService.updateProcessMessage(message)
        .subscribe((response: ProcessMessage) => {
          // reset the others
          this.addedMessage = null;
          this.removedMessage = null;
          // get the saved state to pass it when we get the date from the server 
          this.updatedMessage = response;
          // show success
          this.processMessagesService.emitProcessMessage("??????");
          // get the new data from the server
          this.getMessages();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitMessageUpdate"));

      // go back to view
      this.isMessageEditOn = !this.isMessageEditOn;
    }

  }


  // prepare the new add or update data - get it from the form
  private prepareAddUpdateMessage(): ProcessMessage {

    const formModel = this.messagesForm.value;

    let newAddUpdateMessage: ProcessMessage = new ProcessMessage();

    if (this.isMessageEditOn) { newAddUpdateMessage.messageId = this.messageInView.messageId; }
    newAddUpdateMessage.messageCode = formModel.code as string;
    newAddUpdateMessage.messageText = formModel.text as string;
    newAddUpdateMessage.messageTypeId = formModel.messageTypeId;
    newAddUpdateMessage.messageTypeDescription = formModel.messageTypeDescription;


    // has anything beeing changed in the form and we are updating
    if (this.isMessageEditOn && !this.isMessageChanged(newAddUpdateMessage, this.tempAddUpdateMessage)) {
      this.processMessagesService.emitProcessMessage("???????");
      return null;
    }
    if (this.messageExists(newAddUpdateMessage)) {
      this.processMessagesService.emitProcessMessage("?????");
      return null;
    }

    return newAddUpdateMessage;
  }

  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  private isMessageChanged(newMessage: ProcessMessage, oldMessage: ProcessMessage): boolean {
    if (newMessage.messageCode === oldMessage.messageCode) { return false; }
    return true;
  }


  private messageExists(message: ProcessMessage): boolean {
    let m: number = 0;
    for (m = 0; m < this.messages.length; m++) {
      if (message.messageCode === this.messages[m].messageCode) { return true; }
    }
    return false;
  }


  private onMessageDeleteClick() {
    this.messageToRemove = this.messageInView;
  }


  private onSubmitDeleteMessage(messageToRemove:ProcessMessage) {

    this.processMessagesService.deleteProcessMessage(messageToRemove.messageId)
      .subscribe((response: ProcessMessage) => {
        // reset the update and add
        this.addedMessage = null;
        this.updatedMessage = null;
        // show success
        this.processMessagesService.emitProcessMessage("??????");
        // get the new data from the server and start again
        this.getMessages();

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteMessage"));
  }




  ////*****************************************************
  //// SCREEN CHANGE PLACES 
  ////*****************************************************
  //private onViewPlaceChange(place: any) {
  //  let m: number = 0;
  //  for (m = 0; m < this.places.length; m++) {
  //    if (this.places[m].name === place.target.value) {
  //      //set places
  //      this.placeInView = this.places[m];
  //      this.tempAddUpdatePlace = this.places[m];
  //      this.setPlacesFormDefaults();

  //      // reset postcodes and suburbs       
  //      this.isPostcodeAddOn = false;
  //      this.isPostcodeEditOn = false;
  //      this.isSuburbAddOn = false;
  //      this.isSuburbEditOn = false;
  //      this.getPostcodesByPlaceId(this.placeInView.id);
  //      this.setPostcodesFormDefaults();
  //    }
  //  }
  //}


  //private onPlaceAddClick() {
  //  this.messagesService.emitRoute("nill");
  //  this.isPlaceAddOn = true;
  //  this.isPlaceEditOn = false;

  //  this.setPlacesForm();

  //  // if address in view take it as temp so we can go back if adding has been cancelled
  //  if (this.placeInView) {
  //    this.tempAddUpdatePlace = this.placeInView;
  //    this.placeInView = null;
  //  }
  //}


  //private onPlaceEditClick() {
  //  this.messagesService.emitRoute("nill");
  //  this.isPlaceEditOn = true;
  //  this.isPlaceAddOn = false;

  //  // if place in view take it as temp so we can go back if editing has been cancelled
  //  this.tempAddUpdatePlace = this.placeInView;
  //  this.setPlacesForm();
  //  this.setPlacesFormDefaults();
  //}


  //private onPlaceAddEditCancel() {
  //  this.messagesService.emitRoute("nill");
  //  if (this.isPlaceAddOn == true) { this.isPlaceAddOn = false; }
  //  if (this.isPlaceEditOn == true) { this.isPlaceEditOn = false; }
  //  // if we are cancelling the adding or editing
  //  if (this.tempAddUpdatePlace) { this.placeInView = this.tempAddUpdatePlace; }
  //}


  //private onSubmitPlaceAddUpdate() {

  //  this.messagesService.emitRoute("nill");
  //  let place: Place = this.prepareAddUpdatePlace();

  //  if (this.isPlaceAddOn && place) {

  //    // add new phone
  //    this.placesService.addPlace(place)
  //      .subscribe((response: Place) => {
  //        // reset the athers
  //        this.updatedPlace = null;
  //        this.removedType = null;
  //        // get the new added place so when we come back from the server we can display it in view
  //        this.addedPlace = response;
  //        // show success
  //        this.messagesService.emitProcessMessage("PMSAPl");
  //        // get the new data from the server
  //        this.getPlacesByStateId(this.messageInView.id);

  //      }, (serviceError: Response) => this.onError(serviceError, "onSubmitPlaceAdd"));

  //    // go back to view
  //    this.isPlaceAddOn = !this.isPlaceAddOn;

  //  }


  //  if (this.isPlaceEditOn && place) {

  //    // update place
  //    this.placesService.updatePlace(place)
  //      .subscribe((response: Place) => {
  //        // reset the athers
  //        this.addedPlace = null;
  //        this.removedType = null;
  //        // get the saved place so when we can put it in view when we come back from the server
  //        this.updatedPlace = response;
  //        // show success
  //        this.messagesService.emitProcessMessage("PMSUPl");
  //        // get the new data from the server
  //        this.getPlacesByStateId(this.messageInView.id);

  //      }, (serviceError: Response) => this.onError(serviceError, "onSubmitPlaceUpdate"));

  //    // go back to view
  //    this.isPlaceEditOn = !this.isPlaceEditOn;

  //  }
  //}


  //// prepare the new add or update data - get it from the form
  //private prepareAddUpdatePlace(): Place {

  //  const formModel = this.placeForm.value;

  //  let newAddUpdatePlace: Place = new Place();

  //  if (this.isPlaceEditOn) { newAddUpdatePlace.id = this.placeInView.id; }
  //  newAddUpdatePlace.name = formModel.name as string;
  //  newAddUpdatePlace.stateId = this.messageInView.id;

  //  // has anything beeing changed in the form and we are updating
  //  if (this.isPlaceEditOn && !this.isPlaceChanged(newAddUpdatePlace, this.tempAddUpdatePlace)) {
  //    this.messagesService.emitProcessMessage("PMEUPl");
  //    return null;
  //  }
  //  if (this.placeExists(newAddUpdatePlace)) {
  //    this.messagesService.emitProcessMessage("PMEUPlE");
  //    return null;
  //  }

  //  return newAddUpdatePlace;
  //}


  //// as the form has been prepopulated when updating we can not use the form dirty on changed
  //// we have custom method to compare the new and old
  //private isPlaceChanged(newPlace: Place, oldPlace: Place): boolean {

  //  if (newPlace.name === oldPlace.name && newPlace.stateId === oldPlace.stateId) { return false; }
  //  return true;
  //}


  //private placeExists(place: Place): boolean {
  //  let m: number = 0;
  //  for (m = 0; m < this.places.length; m++) {
  //    if (place.name === this.places[m].name) { return true; }
  //  }
  //  return false;
  //}


  //private onPlaceDeleteClick() {
  //  this.placeToRemove = this.placeInView;
  //}


  //private onSubmitDeletePlace(placeToRemove) {

  //  this.placesService.deletePlace(placeToRemove.id)
  //    .subscribe((response: Place) => {
  //      // reset the update and add
  //      this.addedPlace = null;
  //      this.updatedPlace = null;
  //      // initiate the flag that place has been deleted
  //      this.removedType = response;
  //      // grab the parent category at the moment of deletetion
  //      this.removedState = this.messageInView;
  //      // show success
  //      this.messagesService.emitProcessMessage("PMSDPl");
  //      // get the new data from the server
  //      this.getStates();

  //    }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeletePlace"));
  //}








  




  //************************************************************
  // HELPER METHODS
  //************************************************************
  private getUserSession() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.traderId = this.session.userIdentity.userId;
      }
      catch (ex) {
        this.processMessagesService.emitProcessMessage("PMG");
      }
    }
  }


  private initialiseComponent() {
    this.processMessagesService.emitRoute("nill");
    this.pageTitleService.emitPageTitle(new PageTitle("Categories"));
  }




  //****************************************************
  // LOGGING METHODS
  //****************************************************
  private onError(serviceError: any, operation: string) {

    this.isRequesting = false;
    let message: string = "";

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

    // PME used to pass the message 
    if (serviceError.error === undefined) {

      var data = serviceError.json();

      if (data.ModelState !== undefined) {

        for (var key in data.ModelState) {
          for (var i = 0; i < data.ModelState[key].length; i++) {

            if (message == null) { message = data.ModelState[key][i]; }
            else { message = message + data.ModelState[key][i]; }
          }
        }
      }
      this.processMessagesService.emitProcessMessage("PME", message);
    }
    else if (serviceError.error.ModelState !== undefined) { this.processMessagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }
    else if (serviceError.error !== null) { this.processMessagesService.emitProcessMessage("PME", serviceError.error.Message); }
    else { this.processMessagesService.emitProcessMessage("PMEUEO"); } // unexpected error
  }

}



