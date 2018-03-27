import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import { StatesService } from '../../services/states/states.service';
import { PlacesService } from '../../services/places/places.service';
import { PostcodesService } from '../../services/postcodes/postcodes.service';
import { SuburbsService } from '../../services/suburbs/suburbs.service';
import { ValidationService } from '../../services/validation/validation.service';
import { LoggerService } from '../../services/logger/logger.service';
import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';
// components
import { UserSession, PageTitle, State, Place, Postcode, Suburb} from '../../helpers/classes';
import { SpinnerOneComponent } from '../controls/spinner/spinnerone.component';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {

  private traderId: string;
  private isRequesting: boolean;
  private session: UserSession;

  private stateForm: FormGroup;
  private states: State[] = [];
  private stateInView: State;
  private tempAddUpdateState: State;
  private defaultState: State;
  private isStateAddOn: boolean = false;
  private isStateEditOn: boolean = false;
  private updatedState: State;
  private addedState: State;
  private removedState: State;
  private stateToRemove: State;
 

  private placeForm: FormGroup;
  private places: Place[] = [];
  private placeInView: Place;
  private tempAddUpdatePlace: Place;
  private defaultPlace: Place;
  private isPlaceAddOn: boolean = false;
  private isPlaceEditOn: boolean = false;
  private updatedPlace: Place;
  private addedPlace: Place;
  private removedPlace: Place;
  private placeToRemove: Place;



  private postcodeForm: FormGroup;
  private postcodes: Postcode[] = [];
  private postcodeInView: Postcode;
  private tempAddUpdatePostcode: Postcode;
  private defaultPostcode: Postcode;
  private isPostcodeAddOn: boolean = false;
  private isPostcodeEditOn: boolean = false;
  private updatedPostcode: Postcode;
  private addedPostcode: Postcode;
  private removedPostcode: Postcode;
  private postcodeToRemove: Postcode;


  private suburbForm: FormGroup;
  private suburbs: Suburb[] = [];
  private suburbInView: Suburb;
  private tempAddUpdateSuburb: Suburb;
  private defaultSuburb: Suburb;
  private isSuburbAddOn: boolean = false;
  private isSuburbEditOn: boolean = false;
  private updatedSuburb: Suburb;
  private addedSuburb: Suburb;
  private removedSuburb: Suburb;
  private suburbToRemove: Suburb;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private statesService: StatesService,
    private placesService: PlacesService,
    private postcodesService: PostcodesService,
    private suburbsService: SuburbsService,
    private pageTitleService: PageTitleService,
    private messagesService: ProcessMessageService,
    private loggerService: LoggerService) { }



  ngOnInit() {
    this.getUserSession();
    this.initialiseComponent();

    this.getStates();

    this.setStatesForm();
    this.setPlacesForm();
    this.setPostcodesForm();
    this.setSuburbsForm();
  }


  // toggling done with jquery
  public ngAfterViewInit() {

    jQuery(document).ready(function () {

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapseStates").on("hide.bs.collapse", function () {
        jQuery(".states").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> States</span>  ');
      });
      jQuery("#collapseStates").on("show.bs.collapse", function () {
        jQuery(".states").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> States</span>');
      });

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapsePlaces").on("hide.bs.collapse", function () {
        jQuery(".places").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Places</span>  ');
      });
      jQuery("#collapsePlaces").on("show.bs.collapse", function () {
        jQuery(".places").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Places</span>');
      });

      jQuery("#collapsePostcodes").on("hide.bs.collapse", function () {
        jQuery(".postcodes").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Postcodes</span>  ');
      });
      jQuery("#collapsePostcodes").on("show.bs.collapse", function () {
        jQuery(".postcodes").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Postcodes</span>');
      });

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapseSuburbs").on("hide.bs.collapse", function () {
        jQuery(".suburbs").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Suburbs</span>  ');
      });
      jQuery("#collapseSuburbs").on("show.bs.collapse", function () {
        jQuery(".suburbs").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Suburbs</span>');
      });



      setTimeout(function () {

        // this will set the first item from of the select phone type dropdown
        var counter: number = 0;
        if (jQuery('#state option')) {
          jQuery('#state option').each(function () {
            if (this.text != "" && counter == 1) { jQuery(this).attr("selected", "selected"); }
            counter = counter + 1;
          });
        }
        counter=0
        // this will set the first item from of the select email type dropdown     
        if (jQuery('#place option')) {
          jQuery('#place option').each(function () {
            if (this.text != "" && counter == 1) { jQuery(this).attr("selected", "selected"); }
            counter = counter + 1;
          });
        }

        // this will set the first item from of the select phone type dropdown
        counter = 0
        if (jQuery('#postcode option')) {
          jQuery('#postcode option').each(function () {
            if (this.text != "" && counter == 1) { jQuery(this).attr("selected", "selected"); }
            counter = counter + 1;
          });
        }

        // this will set the first item from of the select email type dropdown
        counter = 0
        if (jQuery('#suburb option')) {
          jQuery('#suburb option').each(function () {
            if (this.text != "" && counter == 1) { jQuery(this).attr("selected", "selected"); }
            counter = counter + 1;
          });
        }

      }, 100);

    });
  }


  //************************************************************
  // GET DATA METHODS
  //************************************************************
  public getStates() {
    this.statesService.getStates()
      .subscribe((res: State[]) => {
        this.onSuccessStates(res);
      }
      , (error: Response) => this.onError(error, "getStates"));
  }

  private onSuccessStates(states: State[]) {
    this.states = null;
    // collections return zero length when no record found as it is initialised
    if (states.length == 0) {
      this.states = null;
      this.stateInView = null;
    }
    else {
      this.states = states;
      if (this.updatedState) {
        this.stateInView = this.updatedState;
        this.updatedState = null;
      }
      else if (this.addedState) {
        this.stateInView = this.addedState;
        this.addedState = null;
      }
      else if (this.removedPlace) {
        this.stateInView = this.removedState;
        this.removedState= null;
      }
      else if (this.removedPlace) {
        this.stateInView = this.removedState;
        this.removedPlace = null;
      }
      else { this.stateInView = this.states[0]; }

      // get the places for this state
      this.getPlacesByStateId(this.stateInView.id);
    }
  }



  private getPlacesByStateId(stateid: number) {
    this.placesService.getPlacesByStateId(this.stateInView.id)
      .subscribe((res: Place[]) => {
        this.onSuccessPlaces(res);
      }
      , (error: Response) => this.onError(error, "getPlacesByStateId"));
  }

  private onSuccessPlaces(passedplaces: Place[]) {

    this.places = null;
    // collections return zero length when no record found as it is initialised
    if (passedplaces.length == 0) {
      this.places = null;
      this.placeInView = null;
    }
    else {
      this.places = passedplaces;
      if (this.updatedPlace) {
        this.placeInView = this.updatedPlace;
        this.updatedPlace = null;
      }
      else if (this.addedPlace) {
        this.placeInView = this.addedPlace;
        this.addedPlace = null;
      }
      else if (this.removedPostcode) {
        this.placeInView = this.removedPlace;
        this.removedPostcode = null;
      }
      else { this.placeInView = this.places[0]; }
    }

    // get the postcodes for this place
    this.getPostcodesByPlaceId(this.placeInView.id);
  }



  private getPostcodesByPlaceId(placeid: number) {
    this.postcodesService.getPostcodesByPlaceId(placeid)
      .subscribe((res: Postcode[]) => {
        this.onSuccessPostcodes(res);
      }
      , (error: Response) => this.onError(error, "getPostcodesByPlaceid"));
  }

  private onSuccessPostcodes(passedpostcodes: Postcode[]) {

    this.postcodes = null;
    // collections return zero length when no record found as it is initialised
    if (passedpostcodes.length == 0) {
      this.postcodes = null;
      this.postcodeInView = null;
    }
    else {
      this.postcodes = passedpostcodes;
      if (this.updatedPostcode) {
        this.postcodeInView = this.updatedPostcode;
        this.updatedPostcode = null;
      }
      else if (this.addedPostcode) {
        this.postcodeInView = this.addedPostcode;
        this.addedPostcode = null;
      }
      else if (this.removedSuburb) {
        this.postcodeInView = this.removedPostcode;
        this.removedSuburb = null;
      }
      else { this.postcodeInView = this.postcodes[0]; }
    }

    // get the suburbs for this postcode
    this.getSuburbsByPostcodeId(this.postcodeInView.id);
  }



  private getSuburbsByPostcodeId(postcodeid: number) {
    this.suburbsService.getSuburbsByPostcodeId(postcodeid)
      .subscribe((res: Suburb[]) => {
        this.onSuccessSuburbs(res);
      }
      , (error: Response) => this.onError(error, "getSuburbsByPostcodeId"));
  }

  private onSuccessSuburbs(passedsuburbs: Suburb[]) {

    this.suburbs = null;
    // collections return zero length when no record found as it is initialised
    if (passedsuburbs.length == 0) {
      this.suburbs = null;
      this.suburbInView = null;
    }
    else {
      this.suburbs = passedsuburbs;
      if (this.updatedSuburb) {
        this.suburbInView = this.updatedSuburb;
        this.updatedSuburb = null;
      }
      else if (this.addedSuburb) {
        this.suburbInView = this.addedSuburb;
        this.addedSuburb = null;
      }
      else { this.suburbInView = this.suburbs[0]; }
    }
  }




  //************************************************************
  // SETUP FORM METHODS
  //************************************************************
  private setStatesForm() {
    this.stateForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, ValidationService.stateInputValidator]),
    });
  }

  private setPlacesForm() {
    this.placeForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, ValidationService.placeInputValidator]),
    });
  }

  private setPostcodesForm() {
    this.postcodeForm = this.formBuilder.group({
      number: new FormControl('', [Validators.required, ValidationService.postcodeInputValidator]),
    });
  }

  private setSuburbsForm() {
    this.suburbForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, ValidationService.suburbInputValidator]),
    });
  }

  private setStatesFormDefaults() {

    setTimeout(() => {
      this.stateForm.setValue({
        name: this.stateInView.name,
      });
    }, 30);
  }

  private setPlacesFormDefaults() {

    setTimeout(() => {
      this.placeForm.setValue({
        name: this.placeInView.name, 
      });
    }, 30);
  }

  private setPostcodesFormDefaults() {

    setTimeout(() => {
      this.postcodeForm.setValue({
        number: this.postcodeInView.number,
      });
    }, 30);
  }

  private setSuburbsFormDefaults() {

    setTimeout(() => {
      this.suburbForm.setValue({
        name: this.suburbInView.name,
      });
    }, 30);
  }



  //*****************************************************
  // SCREEN CHANGE STATES 
  //*****************************************************
  private onViewStateChange(state: any) {
    let m: number = 0;
    for (m = 0; m < this.states.length; m++) {

      if (this.states[m].name === state.target.value) {
        // set states
        this.stateInView = this.states[m];
        this.tempAddUpdateState = this.states[m];
        this.setStatesFormDefaults();

        // reset places, postcodes and suburbs
        this.isPlaceAddOn = false;
        this.isPlaceEditOn = false;
        this.isPostcodeAddOn = false;
        this.isPostcodeEditOn = false;
        this.isSuburbAddOn = false;
        this.isSuburbEditOn = false;
        this.getPlacesByStateId(this.stateInView.id);
        this.setPlacesFormDefaults();
      }
    }
  }


  private onStateAddClick() {
    this.messagesService.emitRoute("nill");
    this.isStateAddOn = true;
    this.isStateEditOn = false;
    this.setStatesForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.stateInView) {
      this.tempAddUpdateState = this.stateInView;
      this.stateInView = null;
    }
  }


  private onStateEditClick() {
    this.messagesService.emitRoute("nill");
    this.isStateEditOn = true;
    this.isStateAddOn = false;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateState = this.stateInView;
    this.setStatesForm();
    this.setStatesFormDefaults();
  }


  private onStateAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isStateAddOn == true) { this.isStateAddOn = false; }
    if (this.isStateEditOn == true) { this.isStateEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateState) { this.stateInView = this.tempAddUpdateState; }
  }


  private onSubmitStateAddUpdate() {

    this.removedState = null;
    this.messagesService.emitRoute("nill");
    let state: State = this.prepareAddUpdateState();

    if (this.isStateAddOn && state) {

        // add new state
        this.statesService.addState(state)
          .subscribe((response: State) => {
            // reset the others
            this.updatedState = null;
            this.removedState = null;
            // get the new state so we can display it when we come from the server
            this.addedState = response;
            // show success
            this.messagesService.emitProcessMessage("PMSASt");
            // get the new data from the server
            this.getStates();

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitStateAdd"));

        // go back to view
        this.isStateAddOn = !this.isStateAddOn;
           
    }


    if (this.isStateEditOn && state) {
  
        // update state
        this.statesService.updateState(state)
          .subscribe((response: State) => {
            // reset the others
            this.addedState = null;
            this.removedState = null;
            // get the saved state to pass it when we get the date from the server 
            this.updatedState = response;
            // show success
            this.messagesService.emitProcessMessage("PMSUSt"); 
            // get the new data from the server
            this.getStates();

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitStateUpdate"));

        // go back to view
        this.isStateEditOn = !this.isStateEditOn;    
    }

  }


  // prepare the new add or update data - get it from the form
  private prepareAddUpdateState(): State {

    const formModel = this.stateForm.value;

    let newAddUpdateState: State = new State();

    if (this.isStateEditOn) { newAddUpdateState.id = this.stateInView.id; }
    newAddUpdateState.name = formModel.name as string;


    // has anything beeing changed in the form and we are updating
    if (this.isStateEditOn && !this.isStateChanged(newAddUpdateState, this.tempAddUpdateState)) {
      this.messagesService.emitProcessMessage("PMEUSt"); 
      return null;
    }
    if (this.stateExists(newAddUpdateState)) {
      this.messagesService.emitProcessMessage("PMEUStE");
      return null;
    }

    return newAddUpdateState;
  }

  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  private isStateChanged(newState: State, oldState: State): boolean {
    if (newState.name === oldState.name) { return false; }
    return true;
  }


  private stateExists(state: State): boolean {
    // is this the first state??
    if (this.states === null) { return false; }
    let m: number = 0;
    for (m = 0; m < this.states.length; m++) {
      if (state.name === this.states[m].name) { return true; }
    }
    return false;
  }


  private onStateDeleteClick() {
    this.stateToRemove = this.stateInView;
  }


  private onSubmitDeleteState(stateToRemove) {

    this.statesService.deleteState(stateToRemove.id)
      .subscribe((response: State) => {
        // reset the update and add
        this.addedState = null;
        this.updatedState = null;
        // show success
        this.messagesService.emitProcessMessage("PMSDSt");
        // get the new data from the server and start again
        this.getStates();

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteState"));
  }




  //*****************************************************
  // SCREEN CHANGE PLACES 
  //*****************************************************
  private onViewPlaceChange(place: any) {
    let m: number = 0;
    for (m = 0; m < this.places.length; m++) {
      if (this.places[m].name === place.target.value) {
        //set places
        this.placeInView = this.places[m];
        this.tempAddUpdatePlace = this.places[m];
        this.setPlacesFormDefaults();

        // reset postcodes and suburbs       
        this.isPostcodeAddOn = false;
        this.isPostcodeEditOn = false;
        this.isSuburbAddOn = false;
        this.isSuburbEditOn = false;
        this.getPostcodesByPlaceId(this.placeInView.id);
        this.setPostcodesFormDefaults();
      }
    }
  }


  private onPlaceAddClick() {
    this.messagesService.emitRoute("nill");
    this.isPlaceAddOn = true;
    this.isPlaceEditOn = false;

    this.setPlacesForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.placeInView) {
      this.tempAddUpdatePlace = this.placeInView;
      this.placeInView = null;
    }
  }


  private onPlaceEditClick() {
    this.messagesService.emitRoute("nill");
    this.isPlaceEditOn = true;
    this.isPlaceAddOn = false;

    // if place in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdatePlace = this.placeInView;
    this.setPlacesForm();
    this.setPlacesFormDefaults();
  }


  private onPlaceAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isPlaceAddOn == true) { this.isPlaceAddOn = false; }
    if (this.isPlaceEditOn == true) { this.isPlaceEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdatePlace) { this.placeInView = this.tempAddUpdatePlace; }
  }


  private onSubmitPlaceAddUpdate() {

    this.messagesService.emitRoute("nill");
    let place: Place = this.prepareAddUpdatePlace();

    if (this.isPlaceAddOn && place) {

        // add new phone
        this.placesService.addPlace(place)
          .subscribe((response: Place) => {
            // reset the athers
            this.updatedPlace = null;
            this.removedPlace = null;
            // get the new added place so when we come back from the server we can display it in view
            this.addedPlace = response;
            // show success
            this.messagesService.emitProcessMessage("PMSAPl");
            // get the new data from the server
            this.getPlacesByStateId(this.stateInView.id);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitPlaceAdd"));

        // go back to view
        this.isPlaceAddOn = !this.isPlaceAddOn;
     
    }


    if (this.isPlaceEditOn && place) {
             
        // update place
        this.placesService.updatePlace(place)
          .subscribe((response: Place) => {
            // reset the athers
            this.addedPlace = null;
            this.removedPlace = null;
            // get the saved place so when we can put it in view when we come back from the server
            this.updatedPlace = response;
            // show success
            this.messagesService.emitProcessMessage("PMSUPl");
            // get the new data from the server
            this.getPlacesByStateId(this.stateInView.id);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitPlaceUpdate"));

        // go back to view
        this.isPlaceEditOn = !this.isPlaceEditOn;
  
    }
  }


  // prepare the new add or update data - get it from the form
  private prepareAddUpdatePlace(): Place {

    const formModel = this.placeForm.value;

    let newAddUpdatePlace: Place = new Place();

    if (this.isPlaceEditOn) { newAddUpdatePlace.id = this.placeInView.id; }
    newAddUpdatePlace.name = formModel.name as string;
    newAddUpdatePlace.stateId = this.stateInView.id;

    // has anything beeing changed in the form and we are updating
    if (this.isPlaceEditOn && !this.isPlaceChanged(newAddUpdatePlace, this.tempAddUpdatePlace)) {
      this.messagesService.emitProcessMessage("PMEUPl");
      return null;
    }
    if (this.placeExists(newAddUpdatePlace)) {
      this.messagesService.emitProcessMessage("PMEUPlE");
      return null;
    }

    return newAddUpdatePlace;
  }


  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  private isPlaceChanged(newPlace: Place, oldPlace: Place): boolean {

    if (newPlace.name === oldPlace.name && newPlace.stateId === oldPlace.stateId) { return false; }
    return true;
  }


  private placeExists(place: Place): boolean {
    // is this the first place??
    if (this.places === null) { return false; }
    let m: number = 0;
    for (m = 0; m < this.places.length; m++) {
      if (place.name === this.places[m].name) { return true; }
    }
    return false;
  }


  private onPlaceDeleteClick() {
    this.placeToRemove = this.placeInView;
  }


  private onSubmitDeletePlace(placeToRemove) {
  
    this.placesService.deletePlace(placeToRemove.id)
      .subscribe((response: Place) => {
        // reset the update and add
        this.addedPlace = null;
        this.updatedPlace = null;
        // initiate the flag that place has been deleted
        this.removedPlace = response;
        // grab the parent category at the moment of deletetion
        this.removedState = this.stateInView;
        // show success
        this.messagesService.emitProcessMessage("PMSDPl");
        // get the new data from the server
        this.getStates();

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeletePlace"));
  }








  //*****************************************************
  // SCREEN CHANGE POSTCODE 
  //*****************************************************
  private onViewPostcodeChange(state: any) {
    let m: number = 0;
    for (m = 0; m < this.postcodes.length; m++) {

      if (this.postcodes[m].number === state.target.value) {
        // set postcodes
        this.postcodeInView = this.postcodes[m];
        this.tempAddUpdatePostcode = this.postcodes[m];
        this.setPostcodesFormDefaults();

        // reset set places
        this.isSuburbAddOn = false;
        this.isSuburbEditOn = false;
        this.getSuburbsByPostcodeId(this.postcodeInView.id);
        this.setSuburbsFormDefaults();
      }
    }
  }


  private onPostcodeAddClick() {
    this.messagesService.emitRoute("nill");
    this.isPostcodeAddOn = true;
    this.isPostcodeEditOn = false;
    this.setPostcodesForm();

    // if postcode in view take it as temp so we can go back if adding has been cancelled
    if (this.postcodeInView) {
      this.tempAddUpdatePostcode = this.postcodeInView;
      this.postcodeInView = null;
    }
  }


  private onPostcodeEditClick() {
    this.messagesService.emitRoute("nill");
    this.isPostcodeEditOn = true;
    this.isPostcodeAddOn = false;

    // if postcode in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdatePostcode = this.postcodeInView;
    this.setPostcodesForm();
    this.setPostcodesFormDefaults();
  }


  private onPostcodeAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isPostcodeAddOn == true) { this.isPostcodeAddOn = false; }
    if (this.isPostcodeEditOn == true) { this.isPostcodeEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdatePostcode) { this.postcodeInView = this.tempAddUpdatePostcode; }
  }


  private onSubmitPostcodeAddUpdate() {

    this.removedPostcode = null;
    this.messagesService.emitRoute("nill");
    let postcode: Postcode = this.prepareAddUpdatePostcode();

    if (this.isPostcodeAddOn && postcode) {

        // add new state
        this.postcodesService.addPostcode(postcode)
          .subscribe((response: Postcode) => {
            // reset the others
            this.updatedPostcode = null;
            this.removedPostcode = null;
            // get the new state so we can display it when we come from the server
            this.addedPostcode = response;
            // show success
            this.messagesService.emitProcessMessage("PMSAPc");
            // get the new data from the server
            this.getPostcodesByPlaceId(this.placeInView.id);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitPostcodeAdd"));

        // go back to view
        this.isPostcodeAddOn = !this.isPostcodeAddOn;
     
    }


    if (this.isPostcodeEditOn && postcode) {

        // update state
        this.postcodesService.updatePostcode(postcode)
          .subscribe((response: Postcode) => {
            // reset the others
            this.addedPostcode = null;
            this.removedPostcode = null;
            // get the saved state to pass it when we get the date from the server 
            this.updatedPostcode = response;
            // show success
            this.messagesService.emitProcessMessage("PMSUPc");
            // get the new data from the server
            this.getPostcodesByPlaceId(this.placeInView.id);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitPostcodeUpdate"));

        // go back to view
        this.isPostcodeEditOn = !this.isPostcodeEditOn;
     
    }

  }


  // prepare the new add or update data - get it from the form
  private prepareAddUpdatePostcode(): Postcode {

    const formModel = this.postcodeForm.value;

    let newAddUpdatePostcode: Postcode = new Postcode();

    if (this.isPostcodeEditOn) { newAddUpdatePostcode.id = this.postcodeInView.id; }
    newAddUpdatePostcode.number = formModel.number as string;
    newAddUpdatePostcode.placeId = this.placeInView.id;


    // has anything beeing changed in the form and we are updating
    if (this.isStateEditOn && !this.isPostcodeChanged(newAddUpdatePostcode, this.tempAddUpdatePostcode)) {
      this.messagesService.emitProcessMessage("PMEUPc");
      return null;
    }
    if (this.postcodeExists(newAddUpdatePostcode)) {
      this.messagesService.emitProcessMessage("PMEUPcE");
      return null;
    }

    return newAddUpdatePostcode;
  }

  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  private isPostcodeChanged(newPostcode: Postcode, oldPostcode: Postcode): boolean {
    if (newPostcode.number === oldPostcode.number && newPostcode.placeId === oldPostcode .id) { return false; }
    return true;
  }


  private postcodeExists(postcode: Postcode): boolean {
    // is this the first postcode??
    if (this.postcodes === null) { return false; }
    let m: number = 0;
    for (m = 0; m < this.postcodes.length; m++) {
      if (postcode.number === this.postcodes[m].number) { return true; }
    }
    return false;
  }


  private onPostcodeDeleteClick() {
    this.postcodeToRemove = this.postcodeInView;
  }


  private onSubmitDeletePostcode(postcodeToRemove) {

    this.postcodesService.deletePostcode(postcodeToRemove.id)
      .subscribe((response: Postcode) => {
        // reset the update and add
        this.addedPostcode= null;
        this.updatedPostcode = null;       
        // initiate the flag that place has been deleted
        this.removedPostcode = response;
        // grab the parent category at the moment of deletetion
        this.removedPlace = this.placeInView;
         // show success
        this.messagesService.emitProcessMessage("PMSDPc");
        // get the new data from the server and start again
        this.getPlacesByStateId(this.stateInView.id);

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeletePostcode"));
  }






  //*****************************************************
  // SCREEN CHANGE SUBURBS 
  //*****************************************************
  private onViewSuburbChange(place: any) {
    let m: number = 0;
    for (m = 0; m < this.suburbs.length; m++) {
      if (this.suburbs[m].name === place.target.value) {
        // set suburbs
        this.suburbInView = this.suburbs[m];
        this.tempAddUpdateSuburb = this.suburbs[m];
        this.setSuburbsFormDefaults();
      }
    }
  }


  private onSuburbAddClick() {
    this.messagesService.emitRoute("nill");
    this.isSuburbAddOn = true;
    this.isSuburbEditOn = false;

    this.setSuburbsForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.suburbInView) {
      this.tempAddUpdateSuburb= this.suburbInView;
      this.suburbInView = null;
    }
  }


  private onSuburbEditClick() {
    this.messagesService.emitRoute("nill");
    this.isSuburbEditOn = true;
    this.isSuburbAddOn = false;

    // if place in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateSuburb = this.suburbInView;
    this.setSuburbsForm();
    this.setSuburbsFormDefaults();
  }


  private onSuburbAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isSuburbAddOn == true) { this.isSuburbAddOn = false; }
    if (this.isSuburbEditOn == true) { this.isSuburbEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateSuburb) { this.suburbInView = this.tempAddUpdateSuburb; }
  }


  private onSubmitSuburbAddUpdate() {

    this.messagesService.emitRoute("nill");
    let suburb: Suburb = this.prepareAddUpdateSuburb();

    if (this.isSuburbAddOn && suburb) {  

        // add new phone
        this.suburbsService.addSuburb(suburb)
          .subscribe((response: Suburb) => {
            // reset the other
            this.updatedSuburb = null;
            this.removedSuburb = null;
            // get the new added place so when we come back from the server we can display it in view
            this.addedSuburb = response;
            // show success
            this.messagesService.emitProcessMessage("PMSASu");
            // get the new data from the server
            this.getSuburbsByPostcodeId(this.postcodeInView.id);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitSuburbAddUpdate"));

        // go back to view
        this.isSuburbAddOn = !this.isSuburbAddOn;

    }


    if (this.isSuburbEditOn && suburb) {

        // update place
        this.suburbsService.updateSuburb(suburb)
          .subscribe((response: Suburb) => {
            // reset the athers
            this.addedSuburb = null;
            this.removedSuburb = null;
            // get the saved place so when we can put it in view when we come back from the server
            this.updatedSuburb = response;
            // show success
            this.messagesService.emitProcessMessage("PMSUSu");
            // get the new data from the server
            this.getSuburbsByPostcodeId(this.postcodeInView.id);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitSuburbAddUpdate"));

        // go back to view
        this.isSuburbEditOn = !this.isSuburbEditOn;
     
    }
  }


  // prepare the new add or update data - get it from the form
  private prepareAddUpdateSuburb(): Suburb {

    const formModel = this.suburbForm.value;

    let newAddUpdateSuburb: Suburb = new Suburb();

    if (this.isSuburbEditOn) { newAddUpdateSuburb.id = this.suburbInView.id; }
    newAddUpdateSuburb.name = formModel.name as string;
    newAddUpdateSuburb.postcodeId = this.postcodeInView.id;

    // has anything beeing changed in the form and we are updating
    if (this.isSuburbEditOn && !this.isSuburbChanged(newAddUpdateSuburb, this.tempAddUpdateSuburb)) {
      this.messagesService.emitProcessMessage("PMEUSu");
      return null;
    }
    if (this.suburbExists(newAddUpdateSuburb)) {
      this.messagesService.emitProcessMessage("PMEUSuE");
      return null;
    }

    return newAddUpdateSuburb;
  }


  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  private isSuburbChanged(newSuburb: Suburb, oldSuburb: Suburb): boolean {

    if (newSuburb.name === oldSuburb.name && newSuburb.postcodeId === oldSuburb.postcodeId) { return false; }
    return true;
  }


  private suburbExists(suburb: Suburb): boolean {
    // is this the first suburb??
    if (this.suburbs === null) { return false; }
    let m: number = 0;
    for (m = 0; m < this.suburbs.length; m++) {
      if (suburb.name === this.suburbs[m].name) { return true; }
    }
    return false;
  }


  private onSuburbDeleteClick() {
    this.suburbToRemove = this.suburbInView;
  }


  private onSubmitDeleteSuburb(suburbToRemove) {

    this.suburbsService.deleteSuburb(suburbToRemove.id)
      .subscribe((response: Suburb) => {
        // reset the update and add
        this.addedSuburb = null;
        this.updatedSuburb = null;
        // initiate the flag that place has been deleted
        this.removedSuburb = response;
        // grab the parent category at the moment of deletetion
        this.removedPostcode = this.postcodeInView;
        // show success
        this.messagesService.emitProcessMessage("PMSDSu");
        // get the new data from the server
        this.getPostcodesByPlaceId(this.placeInView.id);

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteSuburb"));
  }





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
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  private initialiseComponent() {
    this.messagesService.emitRoute("nill");
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
      this.messagesService.emitProcessMessage("PME", message);
    }
    else if (serviceError.error.ModelState !== undefined) { this.messagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }
    else if (serviceError.error !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error.Message); }
    else { this.messagesService.emitProcessMessage("PMEUEO"); } // unexpected error
  }

}



