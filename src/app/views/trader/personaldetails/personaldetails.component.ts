import { Component, Input, OnInit, OnChanges, Inject, Injectable, AfterViewInit, ViewChild } from '@angular/core';
import { IMyDpOptions, IMyDateModel, IMyDayLabels, IMyMonthLabels, IMyDate, IMyOptions } from 'mydatepicker';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators  } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import { PersonalDetailsService } from '../../../services/personaldetails/personaldetails.service';
import { AddressService } from '../../../services/address/address.service';
import {GeoDataService} from '../../../services/geodata/geodata.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import {UserSession, UserIdentity, Authentication, Trade, PageTitle, PersonalDetails, SecurityDetails } from '../../../helpers/classes';
import { Address, Email, Phone, SocialNetwork, AddressType, PreferredType, GeoData, State, Place, Postcode, Suburb } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-personaldetails',
  templateUrl: './personaldetails.component.html',
  styleUrls: ['./personaldetails.component.scss']
})
export class PersonalDetailsComponent implements OnInit {

  private selectDate: IMyDate = { year: 0, month: 0, day: 0 };
  private currentLocale: string = "au";
  private datePickerOptions: IMyOptions;

  private traderId: string;
  private isRequesting: boolean;
  private session: UserSession;

  private personalDetails: PersonalDetails;
  private tempAddUpdatePersonal: PersonalDetails;

  private availableAddresses: Address[] = [];
  private availableAddressesCount: number = 0;
  private addressInView: Address;
  private tempAddUpdateAddress: Address;

  //private geostates: GeoData[] = [];
  //private geoplaces: GeoData[] = [];
  //private geopostcodes: GeoData[] = [];
  //private geosuburbs: GeoData[] = [];

  private states: State[] = [];
  private places: Place[] = [];
  private postcodes: Postcode[] = [];
  private suburbs: Suburb[] = [];

  private alladdresstypes: AddressType[] = [];
  private existingaddresstypes: AddressType[] = [];
  private addresstypescanbeadded: AddressType[] = [];

  private allpreferredtypes: PreferredType[] = [];
  private existingpreferredtypes: PreferredType[] = [];
  private preferredtypestobeadded: PreferredType[] = [];

  private personalForm: FormGroup;
  private addressForm: FormGroup;

  private personalToRemove: PersonalDetails;
  private addressToRemove: Address;

  private selectedState: string = null;
  private selectedPlace: string = null;
  private selectedPostcode: string = null;
  private selectedSuburb: string = null;
  private selectedAddressType: AddressType = null;
  private selectedPreferredType: PreferredType = null;
  private defaultState: State = null;
  private defaultPlace: Place = null;
  private defaultPostcode: Postcode = null;
  private defaultSuburb: Suburb = null;

  private defaultPreferredType: PreferredType = null;
  private defaultAddressType: AddressType = null;
  private updatedAddress: Address = null;
  private addedAddress: Address = null;

  private isPersonalAddOn: boolean = false;
  private isPersonalEditOn: boolean = false;
  private isAddressAddOn: boolean = false;
  private isAddressEditOn: boolean = false;
  private isSaveAddressOn: boolean = false;


  private displayAddressTypeModal: string;
  private displayPreferredTypeModal: string;

  constructor(   
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private personalService: PersonalDetailsService,
    private addressService: AddressService,
    private geodataService: GeoDataService,
    private pageTitleService: PageTitleService,
    private messagesService: ProcessMessageService,
    private loggerService: LoggerService) { };


  public ngOnInit() {

    this.getUserSession();
    this.initialiseComponent();

   
    this.getStatesWithData();
    //this.setAddressForm();
    //this.setPersonalForm();  
   
  }

  // toggling done with jquery
  public ngAfterViewInit() {

    jQuery(document).ready(function () {

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

      jQuery("#addressTypeModal").on("click", function () {
        jQuery("#addresstype").val("").attr("selected", "selected");
      });

      jQuery("#preferredTypeModal").on("click", function () {
        jQuery("#preferredtype").val("").attr("selected", "selected");
      });

      // this will set the first item from of the select address type dropdown
      var counter = 0;
      if (jQuery('#atype option')) {
        jQuery('#atype option').each(function () {
          if (this.text != "" && counter == 1) { jQuery(this).attr("selected", "selected"); }
          counter = counter + 1;
        });
      }

    });

  }


  //************************************************************
  // GET DATA FOR THE FORMS
  //************************************************************
  private getPersonalDetailsByTraderId(traderId: string) {

    this.personalService.getPersonalDetailsByTraderId(traderId)
      .subscribe((personalResult: PersonalDetails) => {
        this.onSuccessPersonal(personalResult);
      }, (serviceError: Response) => this.onError(serviceError, "getPersonalDetailsByTraderId"));
  }


  private onSuccessPersonal(pd: PersonalDetails) {
    // empty records returned 
    if (pd.id != 0) { this.personalDetails = pd; }

    this.getAddressesByTraderId(this.traderId);
  }


  private getAddressesByTraderId(traderId: string) {

    this.availableAddresses = [];
    this.availableAddressesCount = 0;

    this.addressService.getAddressesByTraderId(traderId)
      .subscribe((addressResult: Address[]) => {
        this.onSuccessAddresses(addressResult);
      }, (serviceError: Response) => this.onError(serviceError, "getAddresses"));
  }


  private onSuccessAddresses(addresses: Address[]) {
    // collections return zero length when no record found as it is initialised
    if (addresses.length == 0) {
      this.availableAddresses = null;
      this.addressInView = null;
    }
    else { this.availableAddresses = addresses; }

    this.getAddressTypes();
  }


  private getAddressTypes() {

    this.alladdresstypes = [];

    this.addressService.getAddressTypes()
      .subscribe((res: AddressType[]) => {
        this.onSuccessAddressTypes(res);
      }
      , (error: Response) => this.onError(error, "getAddressTypes"));
  }


  private onSuccessAddressTypes(types: AddressType[]) {
    this.isRequesting = false;

    // collections return zero length when no record found as it is initialised
    if (types.length === 0) { this.alladdresstypes = null; }
    else { this.alladdresstypes = types; }

    // get preferred types
    if (this.allpreferredtypes.length === 0) { this.getPreferredTypes(); }

    // handle no records returned for either of these
    if (this.alladdresstypes && this.availableAddresses && this.allpreferredtypes) { this.setAddressInViewAnAddressTypesAndPreferredTypes(); }
    else {
      if (this.alladdresstypes) {
        // add all address types if they exist
        this.addresstypescanbeadded = this.alladdresstypes;
        this.existingaddresstypes = [];
      }
      if (this.allpreferredtypes) {
        this.preferredtypestobeadded = this.allpreferredtypes;
        this.existingpreferredtypes = [];
      }
    }
  }


  private getPreferredTypes() {

    let pre1: PreferredType = new PreferredType();
    pre1.id = 1;
    pre1.value = "Yes";
    let pre2: PreferredType = new PreferredType();
    pre2.id = 2;
    pre2.value = "No";
    this.allpreferredtypes.push(pre1);
    this.allpreferredtypes.push(pre2);
  }


  private setAddressInViewAnAddressTypesAndPreferredTypes() {

    if (this.updatedAddress) { this.addressInView = this.updatedAddress }
    else if (this.addedAddress) { this.addressInView = this.addedAddress; }
    else { this.addressInView = this.availableAddresses[0]; }

    this.availableAddressesCount = this.availableAddresses.length;
    this.addedAddress = null;
    this.updatedAddress = null;

    this.existingaddresstypes = [];
    this.addresstypescanbeadded = [];
    this.existingpreferredtypes = [];
    this.preferredtypestobeadded = [];


    let m: number = 0;
    let n: number = 0;
    // get the existing address types
    for (m = 0; m < this.alladdresstypes.length; m++) {
      for (n = 0; n < this.availableAddresses.length; n++) {
        if (this.alladdresstypes[m].addressType == this.availableAddresses[n].addressType) {
          this.existingaddresstypes.push(this.alladdresstypes[m]);
        }
      }
    }


    let exist: boolean = false;
    // get the addres types which can be added
    for (m = 0; m < this.alladdresstypes.length; m++) {
      for (n = 0; n < this.existingaddresstypes.length; n++) {
        if (this.alladdresstypes[m].addressType == this.existingaddresstypes[n].addressType) {
          exist = true;
          break;
        }
      }
      if (!exist) { this.addresstypescanbeadded.push(this.alladdresstypes[m]); }
      exist = false;
    }


    // get the existing preferred types
    for (m = 0; m < this.allpreferredtypes.length; m++) {
      for (n = 0; n < this.availableAddresses.length; n++) {
        if (this.allpreferredtypes[m].value == this.availableAddresses[n].preferredFlag) {
          this.existingpreferredtypes.push(this.allpreferredtypes[m]);
        }
      }
    }


    // get the preferred types which can be added
    for (m = 0; m < this.allpreferredtypes.length; m++) {
      for (n = 0; n < this.existingpreferredtypes.length; n++) {
        if (this.allpreferredtypes[m].value == this.existingpreferredtypes[n].value) {
          exist = true;
          break;
        }
      }
      if (!exist) { this.preferredtypestobeadded.push(this.allpreferredtypes[m]); }
      exist = false;
    }

    // get the states data
    //this.getStatesWithData();
 
  }


  public getStatesWithData() {
    this.isRequesting = true;
    this.states = [];

    this.geodataService.getStatesWithData()
      .subscribe((res: State[]) => {
        this.onSuccessStates(res);
      }
      , (error: Response) => this.onError(error, "getStates"));
  }


  private onSuccessStates(res: State[]) {
    // collections return zero length when no record found as it is initialised
    if (res.length == 0) { this.states = null; }
    else { this.states = res; }  

    this.getPersonalDetailsByTraderId(this.traderId);
  }


  //*****************************************************
  //SET FORMS and DEFAULTS
  //*****************************************************
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

      preferredtype: new FormControl('', [Validators.required, ValidationService.preferredValidator]),
      addresstype: new FormControl('', [Validators.required, ValidationService.addresstypeValidator]),
      number: new FormControl('', [Validators.required, ValidationService.numberValidator]),
      unit: new FormControl('', [ValidationService.unitValidator]),
      street: new FormControl('', [Validators.required, ValidationService.streetValidator]),
      state: new FormControl('', [Validators.required, ValidationService.stateTradeValidator]),
      place: new FormControl('', [Validators.required, ValidationService.placeTradeValidator]),    
      postcode: new FormControl('', [Validators.required, ValidationService.postcodeTradeValidator]),
      suburb: new FormControl('', [Validators.required, ValidationService.suburbTradeValidator]),
          
    });
  }

  private setPersonalFormDefaults() {

  
      this.personalForm.setValue({
        fname: this.personalDetails.firstName,
        mname: this.personalDetails.middleName,
        lname: this.personalDetails.lastName,
        dbirth: new Date(this.personalDetails.dateOfBirth)
      });


      this.currentLocale = 'au';
      this.datePickerOptions = {
        dateFormat: 'dd/mm/yyyy',
        firstDayOfWeek: 'mo',
        selectorWidth: 'auto',
        width: 'auto',
        minYear: 1900,
        maxYear: 2100,
        editableDateField: false
      };

      this.setDate(this.personalDetails.dateOfBirth);

  }

  private setDate(datetoset: string) {

    var value = new Date(datetoset);
    this.personalForm.patchValue({
      dbirth: { value: { year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() } }
    });

    this.selectDate = {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate()
    }
  }

  private setAddressFormDefaults() {

    let m: number = 0;

    for (m = 0; m < this.alladdresstypes.length; m++) {
      if (this.alladdresstypes[m].addressType == this.addressInView.addressType) { this.defaultAddressType = this.alladdresstypes[m]; break; }
    }

    for (m = 0; m < this.allpreferredtypes.length; m++) {
      if (this.allpreferredtypes[m].value == this.addressInView.preferredFlag) { this.defaultPreferredType = this.allpreferredtypes[m]; break; }
    }

    for (m = 0; m < this.states.length; m++) {
      if (this.states[m].state == this.addressInView.state) { this.defaultState = this.states[m]; }
    }

    this.places = this.defaultState.places;
    for (m = 0; m < this.places.length; m++) {
      if (this.places[m].place == this.addressInView.place) { this.defaultPlace = this.places[m]; break; }
    }

    this.postcodes = this.defaultPlace.postcodes;
    for (m = 0; m < this.postcodes.length; m++) {
      if (this.postcodes[m].postcode == this.addressInView.postcode) { this.defaultPostcode = this.postcodes[m]; break; }
    }

    this.suburbs = this.defaultPostcode.suburbs;
    for (m = 0; m < this.suburbs.length; m++) {
      if (this.suburbs[m].suburb == this.addressInView.suburb) { this.defaultSuburb = this.suburbs[m]; break; }
    }


    // set the default valuse
    setTimeout(() => {

      this.addressForm.setValue({
        preferredtype: this.defaultPreferredType,
        addresstype: this.defaultAddressType,
        number: this.addressInView.number,
        unit: this.addressInView.unit || "",
        street: this.addressInView.street,
        state: this.defaultState,
        place: this.defaultPlace,
        postcode: this.defaultPostcode,
        suburb: this.defaultSuburb
      });

    }, 50);
  }
 

  //*****************************************************
  //GET THE SCREEN INPUT
  //*****************************************************
  private onDateChanged(event: IMyDateModel) {
    this.selectDate = event.date;
  }


  private clearDate(): void {
    this.personalForm.patchValue({ dbirth: null });
  }


  private onStateChange(singlestate: State) {  
      this.selectedState = singlestate.state;
      this.places = singlestate.places;
      this.postcodes = null;
      this.suburbs = null;
  }


  private onPlaceChange(singleplace: Place) {  
    this.selectedPlace = singleplace.place; 
    this.postcodes = singleplace.postcodes;
    this.suburbs = null;   
  }


  private onPostcodeChange(singleopostcode: Postcode) {   
    this.selectedPostcode = singleopostcode.postcode;      
    this.suburbs = singleopostcode.suburbs;
  }


  private onSuburbChange(singlesuburb: Suburb) {  
    this.selectedSuburb = singlesuburb.suburb;      
  }


  private onPreferredTypeChange(preferredtype: PreferredType) {
    if (this.isAddressEditOn) {
      if (preferredtype.value == "Yes" && this.tempAddUpdateAddress.preferredFlag != "Yes") {
        let m: number = 0;
        for (m = 0; m < this.existingpreferredtypes.length; m++) {
          if (this.existingpreferredtypes[m].value == preferredtype.value) {
            this.openPreferredTypeModal();
            break;     
          }
        }
      }
    }

    if (this.isAddressAddOn && this.existingpreferredtypes != []) {
      if (preferredtype.value == "Yes") {
        let m: number = 0;
        for (m = 0; m < this.existingpreferredtypes.length; m++) {
          if (this.existingpreferredtypes[m].value == preferredtype.value) {
            this.openPreferredTypeModal();
            break;     
          }
        }
      }
    }
  }


  private openPreferredTypeModal() {
    this.displayPreferredTypeModal = "block";
  }


  private onClosePreferredHandled() {
    this.displayPreferredTypeModal = "none";
    this.addressForm.patchValue({ preferredtype: null });
  }



  //*****************************************************
  // PERSONAL ADD UPDATE AND  PERSONAL SCREEN SECTION
  //*****************************************************
  private onPersonalAddClick() {
    this.messagesService.emitRoute("nill");
    this.isPersonalAddOn = true;
    this.setPersonalForm();
  }


  private onPersonalEditClick() {
    this.messagesService.emitRoute("nill");
    this.isPersonalEditOn = true;
    this.setPersonalForm();
    this.setPersonalFormDefaults();
    this.tempAddUpdatePersonal = this.personalDetails;
  }


  private onPersonalAddEditCancel() {
    this.messagesService.emitRoute(null);
    if (this.isPersonalAddOn == true) { this.isPersonalAddOn = false; }
    if (this.isPersonalEditOn == true) { this.isPersonalEditOn = false; }
  }


  private onPersonalDeleteClick(personalDetails: PersonalDetails) {
    this.personalToRemove = personalDetails
  }


  private onSubmitDeletePersonal(personalToRemove: PersonalDetails) {
    this.personalService.deletePersonaDetails(personalToRemove)
      .subscribe((personalResult: PersonalDetails) => {
        if (personalResult) {
          this.messagesService.emitProcessMessage("PMSDPD");
        }
        this.getPersonalDetailsByTraderId(this.traderId);
      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeletePersonal"));

  }


  private onSubmitPersonalAddUpdate() {

    this.messagesService.emitRoute("nill");
    let pd = this.prepareAddUpdatePersonal();

    if (this.isPersonalAddOn) {
      // add new address   
      this.personalService.addPersonalDetails(pd).subscribe((res: PersonalDetails) => {
        // get the new data from the server
        this.getPersonalDetailsByTraderId(this.traderId);
        // show the success
        this.messagesService.emitProcessMessage("PMSAPd");

      }, (serviceError: Response) => this.onError(serviceError, "onAddPersonal"));

      // go back to view
      this.isPersonalAddOn != this.isPersonalAddOn;
    }

    if (this.isPersonalEditOn) {

      if (pd) { // is anything changed

        // update address     
        this.personalService.updatePersonalDetails(pd).subscribe((res: PersonalDetails) => {
          // show success
          this.messagesService.emitProcessMessage("PMSUPd");
          // grab the details from server              
          this.getPersonalDetailsByTraderId(this.traderId);

        }, (serviceError: Response) => this.onError(serviceError, "onUpdatePersonal"));

        // go back to view
        this.isPersonalEditOn = !this.isPersonalEditOn;
      }
    }
  }


  // prepare for add or update - get the data from the form
  private prepareAddUpdatePersonal(): PersonalDetails {

    const formModel = this.personalForm.value;
    let addUpdatePersonal: PersonalDetails = new PersonalDetails();

    if (this.isPersonalEditOn) { addUpdatePersonal.id = this.personalDetails.id; }
    addUpdatePersonal.traderId = this.traderId;
    addUpdatePersonal.firstName = formModel.fname as string;
    addUpdatePersonal.middleName = formModel.mname as string;
    addUpdatePersonal.lastName = formModel.lname as string;
    addUpdatePersonal.dateOfBirth = formModel.dbirth.jsdate;

    // is anything changed in the form when we are updating
    if (this.isPersonalEditOn && this.comparePersonal(addUpdatePersonal, this.tempAddUpdatePersonal)) { this.messagesService.emitProcessMessage("PMEUPd"); return null; }

    return addUpdatePersonal;
  }


  private comparePersonal(newPersonal: PersonalDetails, oldPersonal: PersonalDetails) {

    if (oldPersonal.firstName == newPersonal.firstName &&
      oldPersonal.middleName == newPersonal.middleName &&
      oldPersonal.lastName == newPersonal.lastName &&
      Date.parse(oldPersonal.dateOfBirth) == Date.parse(newPersonal.dateOfBirth)) { return true; }

    return false;
  }



  //********************************************************************
  // ADDRESS ADD UPDATE AND  ADDRESS SCREEN SECTION
  //********************************************************************
  private onAddressTypeChange(type: AddressType) {

    if (this.isAddressEditOn) {
      // check when we adding or when updating is there already existing addres
      if (this.addressInView.addressType != type.addressType) {
        let m: number = 0;
        for (m = 0; m < this.existingaddresstypes.length; m++) {
          if (this.existingaddresstypes[m].addressType == type.addressType) {
            this.openAddressTypeModal();
            break;     
          }
        }
      }
    }

    if (this.isAddressAddOn && this.existingaddresstypes != []) {
      let m: number = 0;
      for (m = 0; m < this.existingaddresstypes.length; m++) {
        if (this.existingaddresstypes[m].addressType == type.addressType) {
          this.openAddressTypeModal();
          break;     
        }
      }
    }

  }


  private openAddressTypeModal() {
    this.displayAddressTypeModal = "block";
  }


  private onCloseAddressHandled() {
    this.displayAddressTypeModal = "none";
    this.addressForm.patchValue({ addresstype: null });
  }


  private onViewAddressTypeChange(type: any) {
    let m: number = 0;
    for (m = 0; m < this.availableAddresses.length; m++) {
      if (this.availableAddresses[m].addressType === type.target.value) {
        this.addressInView = this.availableAddresses[m];
        this.tempAddUpdateAddress = this.availableAddresses[m];
        this.setAddressFormDefaults();
        break;     
      }
    }
  }


  private onAddressAddClick() {
    this.messagesService.emitRoute("nill");
    this.isAddressAddOn = true;  
    this.places = [];
    this.postcodes = [];
    this.suburbs = [];
    this.setAddressForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.addressInView) {
      this.tempAddUpdateAddress = this.addressInView;
      this.addressInView = null;
    }
  }


  private onAddressEditClick() {

    this.messagesService.emitRoute("nill");

    setTimeout(() => {
      this.isAddressEditOn = true;
      // if address in view take it as temp so we can go back if editing has been cancelled
      this.tempAddUpdateAddress = this.addressInView;

      this.setAddressForm();
      this.setAddressFormDefaults();
    }, 100);
  }


  private onAddressAddEditCancel() {
    this.messagesService.emitRoute(null);
    if (this.isAddressAddOn == true) { this.isAddressAddOn = false; }
    if (this.isAddressEditOn == true) { this.isAddressEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateAddress) { this.addressInView = this.tempAddUpdateAddress; }

  }


  private onAddressDeleteClick(addressInView: Address) {
    this.addressToRemove = addressInView;
  }


  private onSubmitDeleteAddress(addressToRemove: Address) {
    this.addressService.deleteAddress(addressToRemove)
      .subscribe((addressResult: Address) => {

        this.getAddressesByTraderId(this.traderId);
      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteAddress"));
  }


  private onSubmitAddressAddUpdate() {

    this.messagesService.emitRoute("nill");
    let address: Address = this.prepareAddUpdateAddress();

    if (this.isAddressAddOn) {

      // add new address
      this.addressService.addAddress(address).subscribe((res: Address) => {
        this.updatedAddress = null;
        this.addedAddress = res;
        // show success
        this.messagesService.emitProcessMessage("PMSAAd");
        // get the new data from the server
        this.getAddressesByTraderId(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "onAddAddress"));

      // go back to view
      this.isAddressAddOn = !this.isAddressAddOn;
    }


    if (this.isAddressEditOn) {

      if (address) { // if address changed

        // update address
        this.addressService.updateAddress(address).subscribe((res: Address) => {
          this.addedAddress = null;
          // get the saved address so when we 
          this.updatedAddress = res;
          // show success
          this.messagesService.emitProcessMessage("PMSUAd");
          // get the new data from the server
          this.getAddressesByTraderId(this.traderId);

        }, (serviceError: Response) => this.onError(serviceError, "onUpdateAddress"));

        // go back to view
        this.isAddressEditOn = !this.isAddressEditOn;
      }
    }
  }


  // prepare the new add or update data - get it from the form
  private prepareAddUpdateAddress(): Address {

    const formModel = this.addressForm.value;

    let geostate: GeoData = formModel.state;
    let geoplace: GeoData = formModel.place;
    let geopostcode: GeoData = formModel.postcode;
    let geosuburb: GeoData = formModel.suburb;
    let preferredflag: PreferredType = formModel.preferredtype;
    let addresstype: AddressType = formModel.addresstype;

    let newAddUpdateAddress: Address = new Address();

    if (this.isAddressEditOn) { newAddUpdateAddress.id = this.addressInView.id; }
    newAddUpdateAddress.traderId = this.traderId as string,
    newAddUpdateAddress.addressTypeId = addresstype.addressTypeId;
    newAddUpdateAddress.country = "";
    newAddUpdateAddress.number = formModel.number as string;
    newAddUpdateAddress.unit = formModel.unit as string;
    newAddUpdateAddress.street = formModel.street as string;
    newAddUpdateAddress.state = geostate.state as string;
    newAddUpdateAddress.place = geoplace.place as string;
    newAddUpdateAddress.suburb = geosuburb.suburb as string;  
    newAddUpdateAddress.postcode = geopostcode.postcode as string;
    newAddUpdateAddress.preferredFlag = preferredflag.value;

    // has anything beeing changed in the form and we are updating
    if (this.isAddressEditOn && this.compareAddresses(newAddUpdateAddress, this.tempAddUpdateAddress)) { this.messagesService.emitProcessMessage("PMEUAd"); return null; }

    return newAddUpdateAddress;
  }


  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  private compareAddresses(newAddress: Address, oldAddress: Address): boolean {

    if (newAddress.addressTypeId == oldAddress.addressTypeId &&    
      newAddress.number == oldAddress.number &&
      newAddress.unit == oldAddress.unit &&
      newAddress.street == oldAddress.street &&
      newAddress.state == oldAddress.state &&
      newAddress.place == oldAddress.place &&
      newAddress.postcode == oldAddress.postcode &&
      newAddress.suburb === oldAddress.suburb &&
      newAddress.addressTypeId == oldAddress.addressTypeId &&
      newAddress.preferredFlag == oldAddress.preferredFlag ) {
      return true;
    }

    return false;
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
    this.pageTitleService.emitPageTitle(new PageTitle("Personal & Address Details"));
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