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
 


  private typeForm: FormGroup;
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

    this.getProcessMessages();

    //this.setMessagesForm();
    //this.setMessageTypesForm();
  }


  //************************************************************
  // GET DATA METHODS
  //************************************************************
  public getProcessMessages() {
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




  ////************************************************************
  //// SETUP FORM METHODS
  ////************************************************************
  //private setStatesForm() {
  //  this.stateForm = this.formBuilder.group({
  //    name: new FormControl('', [Validators.required]),
  //  });
  //}

  //private setPlacesForm() {
  //  this.placeForm = this.formBuilder.group({
  //    name: new FormControl('', [Validators.required]),
  //  });
  //}

  //private setPostcodesForm() {
  //  this.postcodeForm = this.formBuilder.group({
  //    number: new FormControl('', [Validators.required]),
  //  });
  //}

  //private setSuburbsForm() {
  //  this.suburbForm = this.formBuilder.group({
  //    name: new FormControl('', [Validators.required]),
  //  });
  //}

  //private setStatesFormDefaults() {

  //  let m: number = 0;
  //  for (m = 0; m < this.messages.length; m++) {
  //    if (this.messages[m].name == this.messageInView.name) {
  //      this.defaultState = this.messages[m];
  //      break;
  //    }
  //  }

  //  setTimeout(() => {
  //    this.stateForm.setValue({
  //      name: this.defaultState.name,
  //    });
  //  }, 30);
  //}

  //private setPlacesFormDefaults() {

  //  let m: number = 0;

  //  for (m = 0; m < this.places.length; m++) {
  //    if (this.places[m].name == this.placeInView.name) {
  //      this.defaultPlace = this.places[m];
  //      break;
  //    }
  //  }

  //  setTimeout(() => {
  //    this.placeForm.setValue({
  //      name: this.defaultPlace.name,
  //    });
  //  }, 30);
  //}

  //private setPostcodesFormDefaults() {

  //  let m: number = 0;
  //  for (m = 0; m < this.postcodes.length; m++) {
  //    if (this.postcodes[m].number == this.postcodeInView.number) {
  //      this.defaultPostcode = this.postcodes[m];
  //      break;
  //    }
  //  }

  //  setTimeout(() => {
  //    this.postcodeForm.setValue({
  //      number: this.defaultPostcode.number,
  //    });
  //  }, 30);
  //}

  //private setSuburbsFormDefaults() {

  //  let m: number = 0;

  //  for (m = 0; m < this.suburbs.length; m++) {
  //    if (this.suburbs[m].name == this.suburbInView.name) {
  //      this.defaultSuburb = this.suburbs[m];
  //      break;
  //    }
  //  }

  //  setTimeout(() => {
  //    this.suburbForm.setValue({
  //      name: this.defaultSuburb.name,
  //    });
  //  }, 30);
  //}



  ////*****************************************************
  //// SCREEN CHANGE STATES 
  ////*****************************************************
  //private onViewStateChange(state: any) {
  //  let m: number = 0;
  //  for (m = 0; m < this.messages.length; m++) {

  //    if (this.messages[m].name === state.target.value) {
  //      // set messages
  //      this.messageInView = this.messages[m];
  //      this.tempAddUpdateState = this.messages[m];
  //      this.setStatesFormDefaults();

  //      // reset places, postcodes and suburbs
  //      this.isPlaceAddOn = false;
  //      this.isPlaceEditOn = false;
  //      this.isPostcodeAddOn = false;
  //      this.isPostcodeEditOn = false;
  //      this.isSuburbAddOn = false;
  //      this.isSuburbEditOn = false;
  //      this.getPlacesByStateId(this.messageInView.id);
  //      this.setPlacesFormDefaults();
  //    }
  //  }
  //}


  //private onStateAddClick() {
  //  this.messagesService.emitRoute("nill");
  //  this.isStateAddOn = true;
  //  this.isStateEditOn = false;
  //  this.setStatesForm();

  //  // if address in view take it as temp so we can go back if adding has been cancelled
  //  if (this.messageInView) {
  //    this.tempAddUpdateState = this.messageInView;
  //    this.messageInView = null;
  //  }
  //}


  //private onStateEditClick() {
  //  this.messagesService.emitRoute("nill");
  //  this.isStateEditOn = true;
  //  this.isStateAddOn = true;

  //  // if phone in view take it as temp so we can go back if editing has been cancelled
  //  this.tempAddUpdateState = this.messageInView;
  //  this.setStatesForm();
  //  this.setStatesFormDefaults();
  //}


  //private onStateAddEditCancel() {
  //  this.messagesService.emitRoute("nill");
  //  if (this.isStateAddOn == true) { this.isStateAddOn = false; }
  //  if (this.isStateEditOn == true) { this.isStateEditOn = false; }
  //  // if we are cancelling the adding or editing
  //  if (this.tempAddUpdateState) { this.messageInView = this.tempAddUpdateState; }
  //}


  //private onSubmitStateAddUpdate() {

  //  this.removedState = null;
  //  this.messagesService.emitRoute("nill");
  //  let state: State = this.prepareAddUpdateState();

  //  if (this.isStateAddOn && state) {

  //    // add new state
  //    this.statesService.addState(state)
  //      .subscribe((response: State) => {
  //        // reset the others
  //        this.updatedMessage = null;
  //        this.removedState = null;
  //        // get the new state so we can display it when we come from the server
  //        this.addedMessage = response;
  //        // show success
  //        this.messagesService.emitProcessMessage("PMSASt");
  //        // get the new data from the server
  //        this.getStates();

  //      }, (serviceError: Response) => this.onError(serviceError, "onSubmitStateAdd"));

  //    // go back to view
  //    this.isStateAddOn = !this.isStateAddOn;

  //  }


  //  if (this.isStateEditOn && state) {

  //    // update state
  //    this.statesService.updateState(state)
  //      .subscribe((response: State) => {
  //        // reset the others
  //        this.addedMessage = null;
  //        this.removedState = null;
  //        // get the saved state to pass it when we get the date from the server 
  //        this.updatedMessage = response;
  //        // show success
  //        this.messagesService.emitProcessMessage("PMSUSt");
  //        // get the new data from the server
  //        this.getStates();

  //      }, (serviceError: Response) => this.onError(serviceError, "onSubmitStateUpdate"));

  //    // go back to view
  //    this.isStateEditOn = !this.isStateEditOn;
  //  }

  //}


  //// prepare the new add or update data - get it from the form
  //private prepareAddUpdateState(): State {

  //  const formModel = this.stateForm.value;

  //  let newAddUpdateState: State = new State();

  //  if (this.isStateEditOn) { newAddUpdateState.id = this.messageInView.id; }
  //  newAddUpdateState.name = formModel.name as string;


  //  // has anything beeing changed in the form and we are updating
  //  if (this.isStateEditOn && !this.isStateChanged(newAddUpdateState, this.tempAddUpdateState)) {
  //    this.messagesService.emitProcessMessage("PSEUSt");
  //    return null;
  //  }
  //  if (this.stateExists(newAddUpdateState)) {
  //    this.messagesService.emitProcessMessage("PMEUStE");
  //    return null;
  //  }

  //  return newAddUpdateState;
  //}

  //// as the form has been prepopulated when updating we can not use the form dirty on changed
  //// we have custom method to compare the new and old
  //private isStateChanged(newState: State, oldState: State): boolean {
  //  if (newState.name === oldState.name) { return false; }
  //  return true;
  //}


  //private stateExists(state: State): boolean {
  //  let m: number = 0;
  //  for (m = 0; m < this.messages.length; m++) {
  //    if (state.name === this.messages[m].name) { return true; }
  //  }
  //  return false;
  //}


  //private onStateDeleteClick() {
  //  this.stateToRemove = this.messageInView;
  //}


  //private onSubmitDeleteState(stateToRemove) {

  //  this.statesService.deleteState(stateToRemove.id)
  //    .subscribe((response: State) => {
  //      // reset the update and add
  //      this.addedMessage = null;
  //      this.updatedMessage = null;
  //      // show success
  //      this.messagesService.emitProcessMessage("PMSDSt");
  //      // get the new data from the server and start again
  //      this.getStates();

  //    }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteState"));
  //}




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



