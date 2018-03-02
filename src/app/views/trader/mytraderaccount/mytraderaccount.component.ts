import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';
// services
import { PersonalDetailsService } from '../../../services/personaldetails/personaldetails.service';
import { StatesService } from '../../../services/states/states.service';

import { ContactDetailsService } from '../../../services/contactdetails/contactdetails.service';
import { SecurityDetailsService } from '../../../services/securitydetails/securitydetails.service';
import { ValidationService } from '../../../services/validation/validation.service';

import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';

// components
import { UserSession, UserIdentity, Authentication, Trade, PageTitle, PersonalDetails, ContactDetails, SecurityDetails, Address, State, Place, Postcode} from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-mytraderaccount',
  templateUrl: './mytraderaccount.component.html',
  styleUrls: ['./mytraderaccount.component.scss']
})
export class MyTraderAccountComponent implements OnInit {

  private traderId: string;
  private isRequesting: boolean;
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private isAuthenticated: boolean = false;

  private personalDetails: PersonalDetails = new PersonalDetails();
  private contactDetails: ContactDetails = new ContactDetails();
  private securityDetails: SecurityDetails = new SecurityDetails();  
  private addresses: Address[] = [];
  private address: Address = new Address();
  private states: State[] = [];
  private cities: Place[] = [];
  private postcodes: Postcode[] = [];

  private personalGroup: any;
  private addressGroup: any;

  private selectedState: State = null;
  private selectedCity: Place = null;
  private selectedPostcode: Postcode = null;

  private defaultState: State = null;
  private defaultCity: Place = null;
  private defaultPostcode: Postcode = null;

  private personalEdit: boolean = false;
  private addressEdit: boolean = false;
  private emailEdit: boolean = false;
  private phoneEdit: boolean = false;
  private socialEdit: boolean = false;
  private securityEdit: boolean = false;
  private passwordEdit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private personalService: PersonalDetailsService,
    private contactService: ContactDetailsService,
    private securityService: SecurityDetailsService,
    private statesService: StatesService,
    private pageTitleService: PageTitleService,
    private messagesService: ProcessMessageService,
    private loggerService: LoggerService) { };


  ngOnInit() {
    this.getUseridentity();
    this.initialiseComponent();

    this.getPersonalDetails(this.traderId);
    this.getStates();        

    this.setPersonalForm();   
    this.setAddressForm();             
  }


  public ngAfterViewInit() {

    jQuery(document).ready(function () {

      // toggling the chevrons up and down    
      jQuery("#collapsePersonal").on("hide.bs.collapse", function () {
        jQuery(".personal").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Personal Details</span>  ');
      });
      jQuery("#collapsePersonal").on("show.bs.collapse", function () {
        jQuery(".personal").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Personal Details</span>');
      });

      jQuery("#collapseAddress").on("hide.bs.collapse", function () {
        jQuery(".address").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Address Details</span>  ');
      });
      jQuery("#collapseAddress").on("show.bs.collapse", function () {
        jQuery(".address").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Address Details</span>');
      });

    }); // end of document function

  }


  private setPersonalForm() {
    this.personalGroup = this.formBuilder.group({
      fname: new FormControl('', [Validators.required, ValidationService.firstNameValidator]),
      mname: new FormControl('', [ValidationService.middleNameValidator]),
      lname: new FormControl('', [Validators.required, ValidationService.lastNameValidator])

    });
  }


  private setAddressForm() {

    this.addressGroup = this.formBuilder.group({
      number: new FormControl('', [ValidationService.numberValidator]),
      unit: new FormControl('', [ValidationService.unitValidator]),
      street: new FormControl('', [ValidationService.streetValidator]),
      suburb: new FormControl('', [ValidationService.suburbValidator]),
      postcode: new FormControl('', [ValidationService.postcodeValidator]),
      city: new FormControl(this.cities[0], [ValidationService.placeValidator]),
      state: new FormControl('', [ValidationService.stateValidator])
    });

  }


  //************************************************************
  // DETAILS
  //************************************************************
  private getPersonalDetails(traderId: string) {
    this.personalService.getPersonalDetailsByTraderId(traderId)
      .subscribe((personalResult: PersonalDetails) => {
        this.onSuccessPersonal(personalResult);

      }, (serviceError: Response) => this.onError(serviceError, "getPersonalDetails"));
  }


  private onSuccessPersonal(pd: PersonalDetails) {
    this.personalDetails = pd;    
    this.addresses = pd.addresses;
    this.address = pd.addresses[0];    
    this.getContactDetails(this.traderId);
  }


  private getContactDetails(traderId: string) {
    this.contactService.getContactDetailsByTraderId(traderId)
      .subscribe((contactResult: ContactDetails) => {       
        this.onSuccessContact(contactResult);
      }, (serviceError: Response) => this.onError(serviceError, "getContactDetails"));
  }


  private onSuccessContact(cd: ContactDetails) {
    this.contactDetails = cd;
    this.getSecurityDetails(this.traderId);
  }


  private getSecurityDetails(traderId: string) {
    this.securityService.getSecurityDetailsByTraderId(traderId)
      .subscribe((securityResult: SecurityDetails) => {
        this.securityDetails = securityResult;       
      }, (serviceError: Response) => this.onError(serviceError, "getSecurityDetails"));
  }

  

  //*****************************************************
  // GET STATES
  //*****************************************************
  public getStates() {
    this.statesService.getStates()
      .subscribe((res: State[]) => {
        this.states = res;                       
      }
      , (error: Response) => this.onError(error, "getStates"));
  }

 
  //*****************************************************
  //SET DEFAULTS
  //*****************************************************
  private setPersonalDefaults() {
    this.personalGroup.setValue({
      fname: this.personalDetails.firstName,
      mname: this.personalDetails.middleName,
      lname: this.personalDetails.lastName,
    });
  }


  private setAddressDefaults() {

    let m: number = 0;
    let localStates: State[] = [];
    let localCities: Place[] = [];
    let localPostcodes: Postcode[] = [];   

    for (m = 0; m < this.states.length; m++) {
      if (this.states[m].name == this.address.state) { this.defaultState = this.states[m]; }
    }
    localCities = this.defaultState.places;

    for (m = 0; m < localCities.length; m++) {
      if (localCities[m].name == this.address.city) { this.defaultCity = localCities[m]; }
    }
    localPostcodes = this.defaultCity.postcodes;

    for (m = 0; m < localPostcodes.length; m++) {
      if (localPostcodes[m].number == this.address.postcode) { this.defaultPostcode = localPostcodes[m]; }
    }

    this.addressGroup.setValue({
      number: this.address.number,
      unit: this.address.unit,
      street: this.address.street,
      suburb: this.address.suburb,
      state: this.defaultState,
      postcode: this.defaultPostcode,
      city: this.defaultCity,

    });
  }


  //*****************************************************
  //GET THE INPUT IDS
  //*****************************************************
  private onStateChange(state: State) {    
    this.postcodes = null;   
    this.cities = state.places;
  }

  private onCityChange(city: Place) {
    this.postcodes = city.postcodes;
  }


  //************************************************************
  // UPDATES
  //************************************************************
  private enablePersonalEdit() {
    this.personalEdit = true;    
    this.setPersonalDefaults();
  }
  private disablePersonalEdit() {
    this.personalEdit = false;
  }
  private enableAddressEdit(address: Address) {
    this.addressEdit = true;
    this.cities = null;
    this.postcodes = null;
    this.setAddressDefaults();
  }
  private disableAddressEdit(address: Address) {
    this.addressEdit = false;
  }

  private enableEmailEdit() { this.emailEdit = true; }

  private disableEmailEdit() { this.emailEdit = false; }

  private enablePhoneEdit() { this.phoneEdit = true; }

  private disablePhoneEdit() { this.phoneEdit = false; }

  private enableSocialEdit() { this.socialEdit = true; }

  private disableSocialEdit() { this.socialEdit = false; }

  private enableSecurityEdit() { this.securityEdit = true; }

  private disableSecurityEdit() { this.securityEdit = false; }

  private enablePasswordEdit() { this.passwordEdit = true; }

  private disablePasswordEdit() { this.passwordEdit = false; }


  //************************************************************
  // HELPER METHODS
  //************************************************************
  private getUseridentity() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.isAuthenticated = this.session.authentication.isAuthenticated;   
        this.traderId = this.session.userIdentity.userId;
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  private initialiseComponent() {
    this.messagesService.emitRoute("nill");
    this.isRequesting = true;
    this.pageTitleService.emitPageTitle(new PageTitle("My Account"));
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
          else if (serviceError.error !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error); }
          else { this.messagesService.emitProcessMessage("PMEUEO"); } // unexpected error
    }

}
