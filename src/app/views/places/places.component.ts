import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import {GeoDataService } from '../../services/geodata/geodata.service';
import { ValidationService } from '../../services/validation/validation.service';
import { LoggerService } from '../../services/logger/logger.service';
import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';
// components
import { UserSession, PageTitle, GeoData, State, Place, Postcode, Suburb} from '../../helpers/classes';
import { SpinnerOneComponent } from '../controls/spinner/spinnerone.component';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {

  public traderId: string;
  public isRequesting: boolean;
  public session: UserSession;

  public stateForm: FormGroup;
  public states: GeoData[] = [];
  public stateInView: GeoData;
  public tempAddUpdateState: GeoData;
  public defaultState: GeoData;
  public isStateAddOn: boolean = false;
  public isStateEditOn: boolean = false;
  public updatedState: GeoData;
  public addedState: GeoData;
  public removedState: GeoData;
  public stateToRemove: GeoData;
 

  public placeForm: FormGroup;
  public places: GeoData[] = [];
  public placeInView: GeoData;
  public tempAddUpdatePlace: GeoData;
  public defaultPlace: GeoData;
  public isPlaceAddOn: boolean = false;
  public isPlaceEditOn: boolean = false;
  public updatedPlace: GeoData;
  public addedPlace: GeoData;
  public removedPlace: GeoData;
  public placeToRemove: GeoData;



  public postcodeForm: FormGroup;
  public postcodes: GeoData[] = [];
  public postcodeInView: GeoData;
  public tempAddUpdatePostcode: GeoData;
  public defaultPostcode: GeoData;
  public isPostcodeAddOn: boolean = false;
  public isPostcodeEditOn: boolean = false;
  public updatedPostcode: GeoData;
  public addedPostcode: GeoData;
  public removedPostcode: GeoData;
  public postcodeToRemove: GeoData;


  public suburbForm: FormGroup;
  public suburbs: GeoData[] = [];
  public suburbInView: GeoData;
  public tempAddUpdateSuburb: GeoData;
  public defaultSuburb: GeoData;
  public isSuburbAddOn: boolean = false;
  public isSuburbEditOn: boolean = false;
  public updatedSuburb: GeoData;
  public addedSuburb: GeoData;
  public removedSuburb: GeoData;
  public suburbToRemove: GeoData;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private geodataService: GeoDataService,
    private pageTitleService: PageTitleService,
    private messagesService: ProcessMessageService,
    private loggerService: LoggerService) { }



  ngOnInit() {
    this.getUserSession();
    this.initialiseComponent();

    this.getGeoStates();
    //this.getStatesWithData();

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
  public getGeoStates() {
    this.geodataService.getStates()
      .subscribe((res: GeoData[]) => {
        this.onSuccessStates(res);
      }
      , (error: Response) => this.onError(error, "getStates"));
  }

  public onSuccessStates(states: GeoData[]) {
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
      this.getPlacesByStateCode(this.stateInView.state);
    }
  }



  public getPlacesByStateCode(statecode: string) {
    this.geodataService.getPlacesByStateCode(statecode)
      .subscribe((res: GeoData[]) => {
        this.onSuccessPlaces(res);
      }
      , (error: Response) => this.onError(error, "getGeoPlacesByStateCode"));
  }

  public onSuccessPlaces(passedplaces: GeoData[]) {

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
    this.getPostcodesByPlaceNameAndStateCode(this.placeInView.place, this.stateInView.state);
  }



  public getPostcodesByPlaceNameAndStateCode(placename: string, statecode: string) {

    this.geodataService.getPostcodesByPlaceNameAndStateCode(placename, statecode)
      .subscribe((res: GeoData[]) => {
        this.onSuccessPostcodes(res);
      }
      , (error: Response) => this.onError(error, "getGeoPlacesByStateCode"));
  }

  public onSuccessPostcodes(passedpostcodes: GeoData[]) {

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
    this.getSuburbsByPostcodeNumberAndPlaceName(this.postcodeInView.postcode, this.placeInView.place);

  }



  public getSuburbsByPostcodeNumberAndPlaceName(postcodenumber: string, placename: string) {
    this.geodataService.getSuburbssByPostcodeNumberAndPlaceName(postcodenumber, placename)
      .subscribe((res: GeoData[]) => {
        this.onSuccessSuburbs(res);
      }
      , (error: Response) => this.onError(error, "getSuburbssByPostcodeNumberAndPlaceName"));
  }

  public onSuccessSuburbs(passedsuburbs: GeoData[]) {

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
  public setStatesForm() {
    this.stateForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, ValidationService.stateInputValidator]),
    });
  }

  public setPlacesForm() {
    this.placeForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, ValidationService.placeInputValidator]),
    });
  }

  public setPostcodesForm() {
    this.postcodeForm = this.formBuilder.group({
      number: new FormControl('', [Validators.required, ValidationService.postcodeInputValidator]),
    });
  }

  public setSuburbsForm() {
    this.suburbForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, ValidationService.suburbInputValidator]),
    });
  }

  public setStatesFormDefaults() {

    setTimeout(() => {
      this.stateForm.setValue({
        name: this.stateInView.state,
      });
    }, 30);
  }

  public setPlacesFormDefaults() {

    setTimeout(() => {
      this.placeForm.setValue({
        name: this.placeInView.place, 
      });
    }, 30);
  }

  public setPostcodesFormDefaults() {

    setTimeout(() => {
      this.postcodeForm.setValue({
        number: this.postcodeInView.postcode,
      });
    }, 30);
  }

  public setSuburbsFormDefaults() {

    setTimeout(() => {
      this.suburbForm.setValue({
        name: this.suburbInView.suburb,
      });
    }, 30);
  }



  //*****************************************************
  // SCREEN CHANGE STATES 
  //*****************************************************
  public onViewStateChange(state: any) {
    this.messagesService.emitRoute("nill");
    let m: number = 0;
    for (m = 0; m < this.states.length; m++) {

      if (this.states[m].state === state.target.value) {
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
        this.getPlacesByStateCode(this.stateInView.state);
        this.setPlacesFormDefaults();
      }
    }
  }


  public onStateAddClick() {
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


  public onStateEditClick() {
    this.messagesService.emitRoute("nill");
    this.isStateEditOn = true;
    this.isStateAddOn = false;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateState = this.stateInView;
    this.setStatesForm();
    this.setStatesFormDefaults();
  }


  public onStateAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isStateAddOn == true) { this.isStateAddOn = false; }
    if (this.isStateEditOn == true) { this.isStateEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateState) { this.stateInView = this.tempAddUpdateState; }
  }


  public onSubmitStateAddUpdate() {

    this.removedState = null;
    this.messagesService.emitRoute("nill");
    let geostate: GeoData = this.prepareAddUpdateState();

    if (this.isStateAddOn && geostate) {

        // add new state
        this.geodataService.addGeoRecord(geostate)
          .subscribe((response: GeoData) => {
            // reset the others
            this.updatedState = null;
            this.removedState = null;
            // get the new state so we can display it when we come from the server
            this.addedState = response;
            // show success
            this.messagesService.emitProcessMessage("PMSASt");
            // get the new data from the server
            this.getGeoStates();

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitStateAdd"));

        // go back to view
        this.isStateAddOn = !this.isStateAddOn;
           
    }


    if (this.isStateEditOn && geostate) {
  
        // update state
        this.geodataService.updateGeoRecord(geostate)
          .subscribe((response: GeoData) => {
            // reset the others
            this.addedState = null;
            this.removedState = null;
            // get the saved state to pass it when we get the date from the server 
            this.updatedState = response;
            // show success
            this.messagesService.emitProcessMessage("PMSUSt"); 
            // get the new data from the server
            this.getGeoStates();

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitStateUpdate"));

        // go back to view
        this.isStateEditOn = !this.isStateEditOn;    
    }

  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdateState(): GeoData {

    const formModel = this.stateForm.value;

    let newAddUpdateState: GeoData = new GeoData();

    //if (this.isStateEditOn) { newAddUpdateState.id = this.stateInView.id; }
    newAddUpdateState.state = formModel.name as string;


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
  public isStateChanged(newState: GeoData, oldState: GeoData): boolean {
    if (newState.state === oldState.state) { return false; }
    return true;
  }


  public stateExists(state: GeoData): boolean {
    // is this the first state??
    if (this.states === null) { return false; }
    let m: number = 0;
    for (m = 0; m < this.states.length; m++) {
      if (state.state === this.states[m].state) { return true; }
    }
    return false;
  }


  public onStateDeleteClick() {
    this.stateToRemove = this.stateInView;
  }


  public onSubmitDeleteState(stateToRemove: GeoData) {

    this.geodataService.deleteGeoRecord(stateToRemove.id)
      .subscribe((response: GeoData) => {
        // reset the update and add
        this.addedState = null;
        this.updatedState = null;
        // show success
        this.messagesService.emitProcessMessage("PMSDSt");
        // get the new data from the server and start again
        this.getGeoStates();

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteState"));
  }




  //*****************************************************
  // SCREEN CHANGE PLACES 
  //*****************************************************
  public onViewPlaceChange(place: any) {
    this.messagesService.emitRoute("nill");
    let m: number = 0;
    for (m = 0; m < this.places.length; m++) {
      if (this.places[m].place === place.target.value) {
        //set places
        this.placeInView = this.places[m];
        this.tempAddUpdatePlace = this.places[m];
        this.setPlacesFormDefaults();

        // reset postcodes and suburbs       
        this.isPostcodeAddOn = false;
        this.isPostcodeEditOn = false;
        this.isSuburbAddOn = false;
        this.isSuburbEditOn = false;
        this.getPostcodesByPlaceNameAndStateCode(this.placeInView.place, this.stateInView.state);
        this.setPostcodesFormDefaults();
      }
    }
  }


  public onPlaceAddClick() {
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


  public onPlaceEditClick() {
    this.messagesService.emitRoute("nill");
    this.isPlaceEditOn = true;
    this.isPlaceAddOn = false;

    // if place in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdatePlace = this.placeInView;
    this.setPlacesForm();
    this.setPlacesFormDefaults();
  }


  public onPlaceAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isPlaceAddOn == true) { this.isPlaceAddOn = false; }
    if (this.isPlaceEditOn == true) { this.isPlaceEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdatePlace) { this.placeInView = this.tempAddUpdatePlace; }
  }


  public onSubmitPlaceAddUpdate() {

    this.messagesService.emitRoute("nill");
    let place: GeoData = this.prepareAddUpdatePlace();

    if (this.isPlaceAddOn && place) {

        // add new phone
        this.geodataService.addGeoRecord(place)
          .subscribe((response: GeoData) => {
            // reset the athers
            this.updatedPlace = null;
            this.removedPlace = null;
            // get the new added place so when we come back from the server we can display it in view
            this.addedPlace = response;
            // show success
            this.messagesService.emitProcessMessage("PMSAPl");
            // get the new data from the server
            this.getPlacesByStateCode(this.stateInView.state);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitPlaceAdd"));

        // go back to view
        this.isPlaceAddOn = !this.isPlaceAddOn;
     
    }


    if (this.isPlaceEditOn && place) {
             
        // update place
        this.geodataService.updateGeoRecord(place)
          .subscribe((response: GeoData) => {
            // reset the athers
            this.addedPlace = null;
            this.removedPlace = null;
            // get the saved place so when we can put it in view when we come back from the server
            this.updatedPlace = response;
            // show success
            this.messagesService.emitProcessMessage("PMSUPl");
            // get the new data from the server
            this.getPlacesByStateCode(this.stateInView.state);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitPlaceUpdate"));

        // go back to view
        this.isPlaceEditOn = !this.isPlaceEditOn;
  
    }
  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdatePlace(): GeoData {

    const formModel = this.placeForm.value;

    let newAddUpdatePlace: GeoData = new GeoData();

    if (this.isPlaceEditOn) { newAddUpdatePlace.id = this.placeInView.id; }
    newAddUpdatePlace.place = formModel.name as string;
    newAddUpdatePlace.state = this.stateInView.state;

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
  public isPlaceChanged(newPlace: GeoData, oldPlace: GeoData): boolean {

    if (newPlace.place === oldPlace.place) { return false; }
    return true;
  }


  public placeExists(place: GeoData): boolean {
    // is this the first place??
    if (this.places === null) { return false; }
    let m: number = 0;
    for (m = 0; m < this.places.length; m++) {
      if (place.place === this.places[m].place) { return true; }
    }
    return false;
  }


  public onPlaceDeleteClick() {
    this.placeToRemove = this.placeInView;
  }


  public onSubmitDeletePlace(placeToRemove: GeoData) {
  
    this.geodataService.deleteGeoRecord(placeToRemove.id)
      .subscribe((response: GeoData) => {
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
        this.getGeoStates();

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeletePlace"));
  }








  //*****************************************************
  // SCREEN CHANGE POSTCODE 
  //*****************************************************
  public onViewPostcodeChange(postcode: any) {
    this.messagesService.emitRoute("nill");
    let m: number = 0;
    for (m = 0; m < this.postcodes.length; m++) {

      if (this.postcodes[m].postcode === postcode.target.value) {
        // set postcodes
        this.postcodeInView = this.postcodes[m];
        this.tempAddUpdatePostcode = this.postcodes[m];
        this.setPostcodesFormDefaults();

        // reset set places
        this.isSuburbAddOn = false;
        this.isSuburbEditOn = false;
        this.getSuburbsByPostcodeNumberAndPlaceName(this.postcodeInView.postcode, this.placeInView.place);
        this.setSuburbsFormDefaults();
      }
    }
  }


  public onPostcodeAddClick() {
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


  public onPostcodeEditClick() {
    this.messagesService.emitRoute("nill");
    this.isPostcodeEditOn = true;
    this.isPostcodeAddOn = false;

    // if postcode in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdatePostcode = this.postcodeInView;
    this.setPostcodesForm();
    this.setPostcodesFormDefaults();
  }


  public onPostcodeAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isPostcodeAddOn == true) { this.isPostcodeAddOn = false; }
    if (this.isPostcodeEditOn == true) { this.isPostcodeEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdatePostcode) { this.postcodeInView = this.tempAddUpdatePostcode; }
  }


  public onSubmitPostcodeAddUpdate() {

    this.removedPostcode = null;
    this.messagesService.emitRoute("nill");
    let postcode: GeoData = this.prepareAddUpdatePostcode();

    if (this.isPostcodeAddOn && postcode) {

        // add new state
        this.geodataService.addGeoRecord(postcode)
          .subscribe((response: GeoData) => {
            // reset the others
            this.updatedPostcode = null;
            this.removedPostcode = null;
            // get the new state so we can display it when we come from the server
            this.addedPostcode = response;
            // show success
            this.messagesService.emitProcessMessage("PMSAPc");
            // get the new data from the server
            this.getPostcodesByPlaceNameAndStateCode(this.placeInView.place, this.stateInView.state);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitPostcodeAdd"));

        // go back to view
        this.isPostcodeAddOn = !this.isPostcodeAddOn;
     
    }


    if (this.isPostcodeEditOn && postcode) {

        // update state
        this.geodataService.updateGeoRecord(postcode)
          .subscribe((response: GeoData) => {
            // reset the others
            this.addedPostcode = null;
            this.removedPostcode = null;
            // get the saved state to pass it when we get the date from the server 
            this.updatedPostcode = response;
            // show success
            this.messagesService.emitProcessMessage("PMSUPc");
            // get the new data from the server
            this.getPostcodesByPlaceNameAndStateCode(this.placeInView.place, this.stateInView.state);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitPostcodeUpdate"));

        // go back to view
        this.isPostcodeEditOn = !this.isPostcodeEditOn;
     
    }

  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdatePostcode(): GeoData {

    const formModel = this.postcodeForm.value;

    let newAddUpdatePostcode: GeoData = new GeoData();

    if (this.isPostcodeEditOn) { newAddUpdatePostcode.id = this.postcodeInView.id; }
    newAddUpdatePostcode.postcode = formModel.number as string;
    newAddUpdatePostcode.place = this.placeInView.place;
    newAddUpdatePostcode.state = this.placeInView.state;


    // has anything beeing changed in the form and we are updating
    if (this.isPostcodeEditOn && !this.isPostcodeChanged(newAddUpdatePostcode, this.tempAddUpdatePostcode)) {
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
  public isPostcodeChanged(newPostcode: GeoData, oldPostcode: GeoData): boolean {
    if (newPostcode.postcode === oldPostcode.postcode ) { return false; }
    return true;
  }


  public postcodeExists(postcode: GeoData): boolean {
    // is this the first postcode??
    if (this.postcodes === null) { return false; }
    let m: number = 0;
    for (m = 0; m < this.postcodes.length; m++) {
      if (postcode.postcode === this.postcodes[m].postcode) { return true; }
    }
    return false;
  }


  public onPostcodeDeleteClick() {
    this.postcodeToRemove = this.postcodeInView;
  }


  public onSubmitDeletePostcode(postcodeToRemove: GeoData) {

    this.geodataService.deleteGeoRecord(postcodeToRemove.id)
      .subscribe((response: GeoData) => {
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
        this.getPlacesByStateCode(this.stateInView.state);

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeletePostcode"));
  }






  //*****************************************************
  // SCREEN CHANGE SUBURBS 
  //*****************************************************
  public onViewSuburbChange(suburb: any) {
    this.messagesService.emitRoute("nill");
    let m: number = 0;
    for (m = 0; m < this.suburbs.length; m++) {
      if (this.suburbs[m].suburb === suburb.target.value) {
        // set suburbs
        this.suburbInView = this.suburbs[m];
        this.tempAddUpdateSuburb = this.suburbs[m];
        this.setSuburbsFormDefaults();
      }
    }
  }


  public onSuburbAddClick() {
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


  public onSuburbEditClick() {
    this.messagesService.emitRoute("nill");
    this.isSuburbEditOn = true;
    this.isSuburbAddOn = false;

    // if place in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateSuburb = this.suburbInView;
    this.setSuburbsForm();
    this.setSuburbsFormDefaults();
  }


  public onSuburbAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isSuburbAddOn == true) { this.isSuburbAddOn = false; }
    if (this.isSuburbEditOn == true) { this.isSuburbEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateSuburb) { this.suburbInView = this.tempAddUpdateSuburb; }
  }


  public onSubmitSuburbAddUpdate() {

    this.messagesService.emitRoute("nill");
    let suburb: GeoData = this.prepareAddUpdateSuburb();

    if (this.isSuburbAddOn && suburb) {  

        // add new phone
        this.geodataService.addGeoRecord(suburb)
          .subscribe((response: GeoData) => {
            // reset the other
            this.updatedSuburb = null;
            this.removedSuburb = null;
            // get the new added place so when we come back from the server we can display it in view
            this.addedSuburb = response;
            // show success
            this.messagesService.emitProcessMessage("PMSASu");
            // get the new data from the server
            this.getSuburbsByPostcodeNumberAndPlaceName(this.postcodeInView.postcode, this.placeInView.place);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitSuburbAddUpdate"));

        // go back to view
        this.isSuburbAddOn = !this.isSuburbAddOn;

    }


    if (this.isSuburbEditOn && suburb) {

        // update place
        this.geodataService.updateGeoRecord(suburb)
          .subscribe((response: GeoData) => {
            // reset the athers
            this.addedSuburb = null;
            this.removedSuburb = null;
            // get the saved place so when we can put it in view when we come back from the server
            this.updatedSuburb = response;
            // show success
            this.messagesService.emitProcessMessage("PMSUSu");
            // get the new data from the server
            this.getSuburbsByPostcodeNumberAndPlaceName(this.postcodeInView.postcode, this.placeInView.place);

          }, (serviceError: Response) => this.onError(serviceError, "onSubmitSuburbAddUpdate"));

        // go back to view
        this.isSuburbEditOn = !this.isSuburbEditOn;
     
    }
  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdateSuburb(): GeoData {

    const formModel = this.suburbForm.value;

    let newAddUpdateSuburb: GeoData = new GeoData();

    if (this.isSuburbEditOn) { newAddUpdateSuburb.id = this.suburbInView.id; }
    newAddUpdateSuburb.suburb = formModel.name as string;
    newAddUpdateSuburb.postcode = this.postcodeInView.postcode;
    newAddUpdateSuburb.place = this.placeInView.place;
    newAddUpdateSuburb.state = this.stateInView.state;

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
  public isSuburbChanged(newSuburb: GeoData, oldSuburb: GeoData): boolean {

    if (newSuburb.suburb === oldSuburb.suburb) { return false; }
    return true;
  }


  public suburbExists(suburb: GeoData): boolean {
    // is this the first suburb??
    if (this.suburbs === null) { return false; }
    let m: number = 0;
    for (m = 0; m < this.suburbs.length; m++) {
      if (suburb.suburb === this.suburbs[m].suburb) { return true; }
    }
    return false;
  }


  public onSuburbDeleteClick() {
    this.suburbToRemove = this.suburbInView;
  }


  public onSubmitDeleteSuburb(suburbToRemove: GeoData) {

    this.geodataService.deleteGeoRecord(suburbToRemove.id)
      .subscribe((response: GeoData) => {
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
        this.getPostcodesByPlaceNameAndStateCode(this.placeInView.place, this.stateInView.state);

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteSuburb"));
  }





  //************************************************************
  // HELPER METHODS
  //************************************************************
  public getUserSession() {
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


  public initialiseComponent() {
    this.messagesService.emitRoute("nill");
    this.pageTitleService.emitPageTitle(new PageTitle("Categories"));
  }




  //****************************************************
  // LOGGING METHODS
  //****************************************************
  public onError(serviceError: any, operation: string) {

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



