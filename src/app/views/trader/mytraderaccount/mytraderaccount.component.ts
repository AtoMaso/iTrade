import { Component, Input, OnInit, OnChanges, Inject, Injectable, AfterViewInit } from '@angular/core';
import { IMyDpOptions, IMyDateModel, IMyDayLabels, IMyMonthLabels, IMyDate, IMyOptions } from 'mydatepicker';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators  } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import { PersonalDetailsService } from '../../../services/personaldetails/personaldetails.service';
import { AddressService } from '../../../services/address/address.service';
import { StatesService } from '../../../services/states/states.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import {UserSession, UserIdentity, Authentication, Trade, PageTitle, PersonalDetails, ContactDetails, SecurityDetails } from '../../../helpers/classes';
import { Address, State, Place, Postcode, Phone, AddressType, PreferredType } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-mytraderaccount',
  templateUrl: './mytraderaccount.component.html',
  styleUrls: ['./mytraderaccount.component.scss']
})
export class MyTraderAccountComponent implements OnInit {

  private selectDate: IMyDate = { year: 0, month: 0, day: 0 };
  private currentLocale: string = "en";
  private datePickerOptions: IMyOptions;

  private traderId: string;
  private isRequesting: boolean;
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private isAuthenticated: boolean = false;

  private personalDetails: PersonalDetails = null;
  private contactDetails: ContactDetails = null;
  private securityDetails: SecurityDetails = null;   

  private availableAddresses: Address[] = [];
  private availableAddressesCount: number = 0;
  private addressInView: Address; 

  private states: State[] = [];
  private cities: Place[] = [];
  private postcodes: Postcode[] = [];
  private addresstypes: AddressType[] = [];
  private availableaddtypes: AddressType[] = [];
  private preferredtypes: PreferredType[] = [];

  private personalForm: FormGroup;
  private addressForm: FormGroup;

  private selectedState: State = null;
  private selectedCity: Place = null;
  private selectedPostcode: Postcode = null;
  private selectedAddressType: AddressType = null;
  private selectedPreferredType: PreferredType = null;

  private defaultState: State = null;
  private defaultCity: Place = null;
  private defaultPostcode: Postcode = null;
  private defaultPreferredType: PreferredType = null;
  private defaultAddressType: AddressType = null;
  private defaultDateOfBirth: Date;

  private personalEdit: boolean = false;
  private addressEdit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private personalService: PersonalDetailsService,
    private addressService:AddressService,
    private statesService: StatesService,
    private pageTitleService: PageTitleService,
    private messagesService: ProcessMessageService,
    private loggerService: LoggerService) { };


 public ngOnInit() {
    this.getUseridentity();
    this.initialiseComponent();

    this.getPersonalDetails(this.traderId); 
   
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



  //************************************************************
  // GET DATA FOR THE FORMS
  //************************************************************
  private getPersonalDetails(traderId: string) {
    this.personalService.getPersonalDetailsByTraderId(traderId)
      .subscribe((personalResult: PersonalDetails) => {
        this.onSuccessPersonal(personalResult);
      }, (serviceError: Response) => this.onError(serviceError, "getPersonalDetails"));
  }


  private onSuccessPersonal(pd: PersonalDetails) {
    this.personalDetails = pd;        
    this.getStates();    
  }


  public getStates() {
    this.statesService.getStates()
      .subscribe((res: State[]) => {
        this.onSuccessStates(res);                        
      }
      , (error: Response) => this.onError(error, "getStates"));
  }


  private onSuccessStates(res: State[]) {
    this.states = res;     
    this.getAddressTypes();
  }


  public getAddressTypes() {
    this.addressService.getAddressTypes()
      .subscribe((res: AddressType[]) => {       
        this.onSuccessAddressTypes(res);
      }
      , (error: Response) => this.onError(error, "getAddressTypes"));
  }


  private onSuccessAddressTypes(types: AddressType[]) {
    this.addresstypes = types;   
    this.defineAddressesAndTypes();
    this.preparePreferredList();
    this.setPersonalForm();
    this.setAddressForm();
  }


  private defineAddressesAndTypes() {

    this.availableAddresses = this.personalDetails.addresses;
    this.addressInView = this.availableAddresses[0];    
    this.availableAddressesCount = this.availableAddresses.length;

    let m: number = 0;
    let n: number = 0;
    for (m = 0; m < this.addresstypes.length; m++) {
      for (n = 0; n < this.availableAddresses.length; n++) {
        if (this.addresstypes[m].addressType == this.availableAddresses[n].addressType) {
          this.availableaddtypes.push(this.addresstypes[m]);
        }
      }     
    }

  }


  private setPersonalForm() {
    this.personalForm = this.formBuilder.group({
      fname: new FormControl('', [Validators.required, ValidationService.firstNameValidator]),
      mname: new FormControl('', [ValidationService.middleNameValidator]),
      lname: new FormControl('', [Validators.required, ValidationService.lastNameValidator]),
      dbirth: new FormControl('', [ValidationService.dateValidator])
    });
  }


  private setAddressForm() {
    this.addressForm = this.formBuilder.group({

      preferredtype: new FormControl('', [ValidationService.preferredValidator]),
      addresstype: new FormControl('', [ValidationService.addresstypeValidator]),
      number: new FormControl('', [ValidationService.numberValidator]),
      unit: new FormControl('', [ValidationService.unitValidator]),
      street: new FormControl('', [ValidationService.streetValidator]),
      suburb: new FormControl('', [ValidationService.suburbValidator]),
      postcode: new FormControl('', [ValidationService.postcodeValidator]),
      city: new FormControl(this.cities[0], [ValidationService.placeValidator]),
      state: new FormControl('', [ValidationService.stateValidator]),

    });
  }


  private preparePreferredList() {
    let pre1: PreferredType = new PreferredType();
    pre1.id = 1;
    pre1.value = "Yes";
    let pre2: PreferredType = new PreferredType();
    pre2.id = 2;
    pre2.value = "No";
    this.preferredtypes.push(pre1);
    this.preferredtypes.push(pre2);
  }


  //*****************************************************
  //SET DEFAULTS
  //*****************************************************
  private setPersonalFormDefaults() {

    //setTimeout(() => {
      this.personalForm.setValue({
        fname: this.personalDetails.firstName,
        mname: this.personalDetails.middleName,
        lname: this.personalDetails.lastName,
        dbirth: this.personalDetails.dateOfBirth,
      });


      this.currentLocale = 'eu';
      this.datePickerOptions = {
        dateFormat: 'dd/mm/yyyy',
        firstDayOfWeek: 'mo',
        selectorWidth: '310px',
        width: '310px',
        minYear: 1900,
        maxYear: 2100,
        editableDateField: false
      };

      this.setDate(this.personalDetails.dateOfBirth);

    //}, 0);
  }

  private setAddressFormDefaults() {

    let m: number = 0;
    let localStates: State[] = [];
    let localCities: Place[] = [];
    let localPostcodes: Postcode[] = [];

    for (m = 0; m < this.states.length; m++) {
      if (this.states[m].name == this.addressInView.state) { this.defaultState = this.states[m]; }
    }
    localCities = this.defaultState.places;

    for (m = 0; m < localCities.length; m++) {
      if (localCities[m].name == this.addressInView.city) { this.defaultCity = localCities[m]; }
    }
    localPostcodes = this.defaultCity.postcodes;

    for (m = 0; m < localPostcodes.length; m++) {
      if (localPostcodes[m].number == this.addressInView.postcode) { this.defaultPostcode = localPostcodes[m]; }
    }

    for (m = 0; m < this.addresstypes.length; m++) {
      if (this.addresstypes[m].addressType == this.addressInView.addressType) { this.defaultAddressType = this.addresstypes[m]; }
    }

    for (m = 0; m < this.preferredtypes.length; m++) {
      if (this.preferredtypes[m].value == this.addressInView.preferredFlag) { this.defaultPreferredType = this.preferredtypes[m]; }
    }

    setTimeout(() => {

      this.addressForm.setValue({
        number: this.addressInView.number,
        unit: this.addressInView.unit,
        street: this.addressInView.street,
        suburb: this.addressInView.suburb,
        state: this.defaultState,
        city: this.defaultCity,
        postcode: this.defaultPostcode,
        addresstype: this.defaultAddressType,
        preferredtype: this.defaultPreferredType
      });

    }, 30);
  }


 private setDate(datetoset: Date): void {
    // Set today date using the patchValue function
   let date = new Date();
   date.setFullYear(datetoset.getFullYear());
   date.setMonth(datetoset.getMonth());
   date.setDate(datetoset.getDay());

    this.personalForm.patchValue({
      dbirth: { date: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } }
    });

    this.selectDate = {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    }
  }


  private onDateChanged(event: IMyDateModel) {
    // Update value of selDate variable
    this.selectDate = event.date;
  }


  private clearDate(): void {
    // Clear the date using the patchValue function
    this.personalForm.patchValue({ dbirth: null });
  }

  //*****************************************************
  //GET THE SCREEN INPUT
  //*****************************************************
  private onStateChange(state: State) {    
    this.postcodes = null;   
    this.cities = state.places;
  }


  private onCityChange(city: Place) {
    this.postcodes = city.postcodes;
  }


  private onViewAddressTypeChange(type:any) {
    let m: number = 0;
    for (m = 0; m < this.availableAddresses.length; m++) {
      if (this.availableAddresses[m].addressType == type.target.value) {
        this.addressInView = this.availableAddresses[m];
        this.setAddressFormDefaults();
      }
    }
  }


  //************************************************************
  // UPDATES
  //************************************************************
  private TogglePersonal() {
    this.personalEdit = !this.personalEdit;    
    if (this.personalEdit) { this.setPersonalFormDefaults();}
  }

  private ToggleAddress() {
    this.addressEdit = !this.addressEdit;
    if (this.addressEdit) {   
      this.setAddressFormDefaults();
      this.cities = null;
      this.postcodes = null;
    }
  }


  //*****************************************************
  // SAVe ADDRESS
  //*****************************************************
  private onSubmitPersonal() {
    let pd= this.prepareSavePersonal();
    this.personalService.updatePersonalDetails(pd).subscribe(

      /* error handling */
    );
    //this.ngOnChanges();
  }

  private prepareSavePersonal(): PersonalDetails {
    const formModel = this.personalForm.value;  

    const savePersonal: PersonalDetails = {
      personalDetailsId: this.personalDetails.personalDetailsId,
      dateOfBirth: this.personalDetails.dateOfBirth,
      addresses: this.personalDetails.addresses,   
      traderId: this.personalDetails.traderId,
      firstName: formModel.fname as string,
      middleName: formModel.mname as string,
      lastName: formModel.lname as string,          
    };
    return savePersonal;
  }

  private onSubmitAddress() {
    let address: Address = this.prepareSaveAddress();
    this.addressService.updateAddress(address).subscribe(

      /* error handling */
    );
    //this.ngOnChanges();
  }

  private prepareSaveAddress(): Address {
    const formModel = this.addressForm.value;

    //const saveAddress: Address = {

      //personalDetailsId: this.address.personalDetailsId, 
      //traderId: this.personalDetails.traderId,
      //number: formModel.number,             
      //unit: formModel.unit,       
      //street: formModel.street,       
      //suburb: formModel.suburb,       
      //city: formModel.city,       
      //postcode: formModel.postcode,       
      //state: formModel.state,       
      //preferred: formModel.preferred,
      //addressType: formModel.addresstype,
      
    //};
    return new Address();// saveAddress;
  }


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
