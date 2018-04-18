import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import { ValidationService } from '../../services/validation/validation.service';
import { PhonesService } from '../../services/phones/phones.service';
import { AddressService } from '../../services/address/address.service';
import { EmailsService } from '../../services/emails/emails.service';
import { SocialNetworksService } from '../../services/socialnetworks/social-networks.service';
import { LoggerService } from '../../services/logger/logger.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';
import { ProcessMessageService } from '../../services/processmessage/processmessage.service';

// components
import { UserSession, PageTitle, PhoneType, AddressType, EmailType, SocialNetworkType } from '../../helpers/classes';
import { SpinnerOneComponent } from '../controls/spinner/spinnerone.component';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {

  public traderId: string;
  public isRequesting: boolean;
  public session: UserSession;

  public phoneTypesForm: FormGroup;
  public phonetypes: PhoneType[] = [];
  public phoneTypeInView: PhoneType;
  public tempAddUpdatePhoneType: PhoneType;
  public defaultPhoneType: PhoneType;
  public isPhoneTypeAddOn: boolean = false;
  public isPhoneTypeEditOn: boolean = false;
  public updatedPhoneType: PhoneType;
  public addedPhoneType: PhoneType;
  public removedPhoneType: PhoneType;
  public phoneTypeToRemove: PhoneType;


  public addressTypesForm: FormGroup;
  public addresstypes: AddressType[] = [];
  public addressTypeInView: AddressType;
  public tempAddUpdateAddressType: AddressType;
  public defaultAddressType: AddressType;
  public isAddressTypeAddOn: boolean = false;
  public isAddressTypeEditOn: boolean = false;
  public updatedAddressType: AddressType;
  public addedAddressType: AddressType;
  public removedAddressType: AddressType;
  public addressTypeToRemove: AddressType;


  public emailTypesForm: FormGroup;
  public emailtypes: EmailType[] = [];
  public emailTypeInView: EmailType;
  public tempAddUpdateEmailType: EmailType;
  public emailPhoneType: EmailType;
  public isEmailTypeAddOn: boolean = false;
  public isEmailTypeEditOn: boolean = false;
  public updatedEmailType: EmailType;
  public addedEmailType: EmailType;
  public removedEmailType: EmailType;
  public emailTypeToRemove: EmailType;


  public socialTypesForm: FormGroup;
  public socialtypes: SocialNetworkType[] = [];
  public socialTypeInView: SocialNetworkType;
  public tempAddUpdateSocialType: SocialNetworkType;
  public defaultSocialType: SocialNetworkType;
  public isSocialTypeAddOn: boolean = false;
  public isSocialTypeEditOn: boolean = false;
  public updatedSocialType: SocialNetworkType;
  public addedSocialType: SocialNetworkType;
  public removedSocialType: SocialNetworkType;
  public socialTypeToRemove: SocialNetworkType;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private phonesService: PhonesService,
    private addressService: AddressService,
    private emailsService: EmailsService,
    private socialsService: SocialNetworksService,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) { }



  ngOnInit() {
    this.getUserSession();
    this.initialiseComponent();

    this.getPhoneTypes();
    this.getAddressTypes();
    this.getEmailTypes();
    this.getSocialTypes();

    this.setPhoneTypesForm();
    this.setAddressTypesForm();
    this.setEmailTypesForm();
    this.setSocialTypesForm();
  }


  // toggling done with jquery
  public ngAfterViewInit() {

    jQuery(document).ready(function () {

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapsePhones").on("hide.bs.collapse", function () {
        jQuery(".phones").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Phone Types</span>  ');
      });
      jQuery("#collapsePhones").on("show.bs.collapse", function () {
        jQuery(".phones").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Phone Types</span>');
      });

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapseAddresses").on("hide.bs.collapse", function () {
        jQuery(".addresses").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Address Types</span>  ');
      });
      jQuery("#collapseAddresses").on("show.bs.collapse", function () {
        jQuery(".addresses").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Address Types</span>');
      });

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapseEmails").on("hide.bs.collapse", function () {
        jQuery(".emails").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Email Types</span>  ');
      });
      jQuery("#collapseEmails").on("show.bs.collapse", function () {
        jQuery(".emails").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Email Types</span>');
      });

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapseSocials").on("hide.bs.collapse", function () {
        jQuery(".socials").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Social Network Types</span>  ');
      });
      jQuery("#collapseSocials").on("show.bs.collapse", function () {
        jQuery(".socials").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Social Network Types</span>');
      });

      setTimeout(function () {

        // this will set the first item from of the select phone type dropdown
        var counter: number = 0;
        if (jQuery('#phonetype option')) {
          jQuery('#phonetype option').each(function () {
            if (this.text != "" && counter == 1) { jQuery(this).attr("selected", "selected"); }
            counter = counter + 1;
          });
        }
        counter = 0
        // this will set the first item from of the select email type dropdown     
        if (jQuery('#addresstype option')) {
          jQuery('#addresstype option').each(function () {
            if (this.text != "" && counter == 1) { jQuery(this).attr("selected", "selected"); }
            counter = counter + 1;
          });
        }


        // this will set the first item from of the select phone type dropdown
        var counter: number = 0;
        if (jQuery('#emailtype option')) {
          jQuery('#emailtype option').each(function () {
            if (this.text != "" && counter == 1) { jQuery(this).attr("selected", "selected"); }
            counter = counter + 1;
          });
        }
        counter = 0
        // this will set the first item from of the select email type dropdown     
        if (jQuery('#socialtype option')) {
          jQuery('#socialtype option').each(function () {
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
  public getPhoneTypes() {
    this.phonesService.getPhoneTypes()
      .subscribe((res: PhoneType[]) => {
        this.onSuccessPhoneTypes(res);
      }
      , (error: Response) => this.onError(error, "getPhonesTypes"));
  }

  public onSuccessPhoneTypes(phonetypes: PhoneType[]) {
    this.phonetypes = null;
    // collections return zero length when no record found as it is initialised
    if (phonetypes.length == 0) {
      this.phonetypes = null;
      this.phoneTypeInView = null;
    }
    else {
      this.phonetypes = phonetypes;
      if (this.updatedPhoneType) {
        this.phoneTypeInView = this.updatedPhoneType;
        this.updatedPhoneType = null;
      }
      else if (this.addedPhoneType) {
        this.phoneTypeInView = this.addedPhoneType;
        this.addedPhoneType = null;
      }    
      else { this.phoneTypeInView = this.phonetypes[0]; }
    }
  }



  public getAddressTypes() {
    this.addressService.getAddressTypes()
      .subscribe((res: AddressType[]) => {
        this.onSuccessAddressTypes(res);
      }
      , (error: Response) => this.onError(error, "getMessageTypes"));
  }

  public onSuccessAddressTypes(passedaddresstypes: AddressType[]) {

    this.addresstypes = null;
    // collections return zero length when no record found as it is initialised
    if (passedaddresstypes.length == 0) {
      this.addresstypes = null;
      this.addressTypeInView = null;
    }
    else {
      this.addresstypes = passedaddresstypes;
      if (this.updatedAddressType) {
        this.addressTypeInView = this.updatedAddressType;
        this.updatedAddressType = null;
      }
      else if (this.addedAddressType) {
        this.addressTypeInView = this.addedAddressType;
        this.addedAddressType = null;
      }
      else { this.addressTypeInView = this.addresstypes[0]; }
    }
  }



  public getEmailTypes() {
    this.emailsService.getEmailTypes()
      .subscribe((res: EmailType[]) => {
        this.onSuccessEmailTypes(res);
      }
      , (error: Response) => this.onError(error, "getEmailTypes"));
  }

  public onSuccessEmailTypes(passedemailtypes: EmailType[]) {

    this.emailtypes = null;
    // collections return zero length when no record found as it is initialised
    if (passedemailtypes.length == 0) {
      this.emailtypes = null;
      this.emailTypeInView = null;
    }
    else {
      this.emailtypes = passedemailtypes;
      if (this.updatedEmailType) {
        this.emailTypeInView = this.updatedEmailType;
        this.updatedEmailType = null;
      }
      else if (this.addedEmailType) {
        this.emailTypeInView = this.addedEmailType;
        this.addedEmailType = null;
      }
      else { this.emailTypeInView = this.emailtypes[0]; }
    }
  }



  public getSocialTypes() {
    this.socialsService.getSocialNetworkTypes()
      .subscribe((res: SocialNetworkType[]) => {
        this.onSuccessSocailTypes(res);
      }
      , (error: Response) => this.onError(error, "getSocialTypes"));
  }

  public onSuccessSocailTypes(passedsocialtypes: SocialNetworkType[]) {

    this.socialtypes = null;
    // collections return zero length when no record found as it is initialised
    if (passedsocialtypes.length == 0) {
      this.socialtypes = null;
      this.socialTypeInView = null;
    }
    else {
      this.socialtypes = passedsocialtypes;
      if (this.updatedSocialType) {
        this.socialTypeInView = this.updatedSocialType;
        this.updatedSocialType = null;
      }
      else if (this.addedSocialType) {
        this.socialTypeInView = this.addedSocialType;
        this.addedSocialType = null;
      }
      else { this.socialTypeInView = this.socialtypes[0]; }
    }
  }




  //************************************************************
  // SETUP FORM METHODS
  //************************************************************
  public setPhoneTypesForm() {
    this.phoneTypesForm = this.formBuilder.group({
      phonetypedescription: new FormControl('', [Validators.required, ValidationService.messageTypeDescriptionValidator]),
    });
  }

  public setAddressTypesForm() {
    this.addressTypesForm = this.formBuilder.group({
      addresstypedescription: new FormControl('', [Validators.required, ValidationService.messageTypeDescriptionValidator]),
    });
  }


  public setEmailTypesForm() {
    this.emailTypesForm = this.formBuilder.group({
      emailtypedescription: new FormControl('', [Validators.required, ValidationService.messageTypeDescriptionValidator]),
    });
  }

  public setSocialTypesForm() {
    this.socialTypesForm = this.formBuilder.group({
      socialtypedescription: new FormControl('', [Validators.required, ValidationService.messageTypeDescriptionValidator]),
    });
  }



  public setPhoneTypesFormDefaults() {
    setTimeout(() => {
      this.phoneTypesForm.setValue({
        phonetypedescription: this.phoneTypeInView.phoneType,
      });
    }, 30);
  }

  public setAddressTypesFormDefaults() {
    setTimeout(() => {
      this.addressTypesForm.setValue({
        addresstypedescription: this.addressTypeInView.addressType,
      });
    }, 30);
  }



  public setEmailTypesFormDefaults() {
    setTimeout(() => {
      this.emailTypesForm.setValue({
        emailtypedescription: this.emailTypeInView.emailType,
      });
    }, 30);
  }

  public setSocialTypesFormDefaults() {
    setTimeout(() => {
      this.socialTypesForm.setValue({
        socialtypedescription: this.socialTypeInView.socialType,
      });
    }, 30);
  }



  //*****************************************************
  // SCREEN CHANGE PHONE TYPES 
  //*****************************************************
  public onViewPhoneTypeChange(state: any) {
    let m: number = 0;
    for (m = 0; m < this.phonetypes.length; m++) {

      if (this.phonetypes[m].phoneType === state.target.value) {
        // reset types    
        this.isPhoneTypeAddOn = false;
        this.isPhoneTypeEditOn = false;
        // set phones
        this.phoneTypeInView = this.phonetypes[m];
        this.tempAddUpdatePhoneType = this.phonetypes[m];
        this.setPhoneTypesFormDefaults();
        break;
      }
    }
  }


  public onPhoneTypeAddClick() {
    this.messagesService.emitRoute("nill");
    this.isPhoneTypeAddOn = true;
    this.isPhoneTypeEditOn = false;
    this.setPhoneTypesForm();

    // if phone type in view take it as temp so we can go back if adding has been cancelled
    if (this.phoneTypeInView) {
      this.tempAddUpdatePhoneType = this.phoneTypeInView;
      this.phoneTypeInView = null;
    }
  }


  public onPhoneTypeEditClick() {
    this.messagesService.emitRoute("nill");
    this.isPhoneTypeEditOn = true;
    this.isPhoneTypeAddOn = false;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdatePhoneType = this.phoneTypeInView;
    this.setPhoneTypesForm();
    this.setPhoneTypesFormDefaults();
  }


  public onPhoneTypeAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isPhoneTypeAddOn == true) { this.isPhoneTypeAddOn = false; }
    if (this.isPhoneTypeEditOn == true) { this.isPhoneTypeEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdatePhoneType) { this.phoneTypeInView = this.tempAddUpdatePhoneType; }
  }


  public onSubmitPhoneTypeAddUpdate() {

    this.removedPhoneType = null;
    this.messagesService.emitRoute("nill");
    let phonetype: PhoneType = this.prepareAddUpdatePhoneType();

    if (this.isPhoneTypeAddOn && phonetype) {

      // add new state
      this.phonesService.addPhoneType(phonetype)
        .subscribe((response: PhoneType) => {
          // reset the others
          this.updatedPhoneType = null;
          this.removedPhoneType = null;
          // get the new state so we can display it when we come from the server
          this.addedPhoneType= response;
          // show success
          this.messagesService.emitProcessMessage("PMSAPht");
          // get the new data from the server
          this.getPhoneTypes();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitPhoneTypeAdd"));

      // go back to view
      this.isPhoneTypeAddOn = !this.isPhoneTypeAddOn;

    }



    if (this.isPhoneTypeEditOn && phonetype) {

      // update state
      this.phonesService.updatePhoneType(phonetype)
        .subscribe((response: PhoneType) => {
          // reset the others
          this.addedPhoneType = null;
          this.removedPhoneType = null;
          // get the saved state to pass it when we get the date from the server 
          this.updatedPhoneType = response;
          // show success
          this.messagesService.emitProcessMessage("PMSUPht");
          // get the new data from the server
          this.getPhoneTypes();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitPhoneTypeUpdate"));

      // go back to view
      this.isPhoneTypeEditOn = !this.isPhoneTypeEditOn;
    }

  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdatePhoneType(): PhoneType {

    const formModel = this.phoneTypesForm.value;

    let newAddUpdatePhoneType: PhoneType = new PhoneType();

    if (this.isPhoneTypeEditOn) { newAddUpdatePhoneType.phoneTypeId = this.phoneTypeInView.phoneTypeId; }      
    newAddUpdatePhoneType.phoneType = formModel.phonetypedescription;


    // has anything beeing changed in the form and we are updating
    if (this.isPhoneTypeEditOn && !this.isPhoneTypeChanged(newAddUpdatePhoneType, this.tempAddUpdatePhoneType)) {
      this.messagesService.emitProcessMessage("PMEUPht");
      return null;
    }
    if (this.phoneTypeExists(newAddUpdatePhoneType)) {
      this.messagesService.emitProcessMessage("PMEUPmtE");
      return null;
    }

    return newAddUpdatePhoneType;
  }

  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  public isPhoneTypeChanged(newPhoneType: PhoneType, oldPhoneType: PhoneType): boolean {
    if (newPhoneType.phoneType === oldPhoneType.phoneType) { return false; }
    return true;
  }


  public phoneTypeExists(phonetype: PhoneType): boolean {
    let m: number = 0;
    for (m = 0; m < this.phonetypes.length; m++) {
      if (phonetype.phoneType === this.phonetypes[m].phoneType) { return true; }
    }
    return false;
  }


  public onPhoneTypeDeleteClick() {
    this.phoneTypeToRemove = this.phoneTypeInView;
  }


  public onSubmitDeletePhoneType(phoneTypeToRemove: PhoneType) {

    this.phonesService.deletePhoneType(phoneTypeToRemove.phoneTypeId)
      .subscribe((response: PhoneType) => {
        // reset the update and add
        this.addedPhoneType = null;
        this.updatedPhoneType = null;
        // show success
        this.messagesService.emitProcessMessage("PMSDPht");
        // get the new data from the server and start again
        this.getPhoneTypes();

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeletePhoneType"));
  }





  //*****************************************************
  // SCREEN CHANGE ADDRESS TYPES 
  //*****************************************************
  public onViewAddressTypeChange(state: any) {
    let m: number = 0;
    for (m = 0; m < this.addresstypes.length; m++) {

      if (this.addresstypes[m].addressType === state.target.value) {
        // reset types    
        this.isAddressTypeAddOn = false;
        this.isAddressTypeEditOn = false;
        // set phones
        this.addressTypeInView = this.addresstypes[m];
        this.tempAddUpdateAddressType = this.addresstypes[m];
        this.setAddressTypesFormDefaults();
        break;
      }
    }
  }


  public onAddressTypeAddClick() {
    this.messagesService.emitRoute("nill");
    this.isAddressTypeAddOn = true;
    this.isAddressTypeEditOn = false;
    this.setAddressTypesForm();

    // if phone type in view take it as temp so we can go back if adding has been cancelled
    if (this.addressTypeInView) {
      this.tempAddUpdateAddressType = this.addressTypeInView;
      this.addressTypeInView = null;
    }
  }


  public onAddressTypeEditClick() {
    this.messagesService.emitRoute("nill");
    this.isAddressTypeEditOn = true;
    this.isAddressTypeAddOn = false;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateAddressType = this.addressTypeInView;
    this.setAddressTypesForm();
    this.setAddressTypesFormDefaults();
  }


  public onAddressTypeAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isAddressTypeAddOn == true) { this.isAddressTypeAddOn = false; }
    if (this.isAddressTypeEditOn == true) { this.isAddressTypeEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateAddressType) { this.addressTypeInView = this.tempAddUpdateAddressType; }
  }


  public onSubmitAddressTypeAddUpdate() {

    this.removedAddressType = null;
    this.messagesService.emitRoute("nill");
    let addresstype: AddressType = this.prepareAddUpdateAddressType();

    if (this.isAddressTypeAddOn && addresstype) {

      // add new state
      this.addressService.addAddressType(addresstype)
        .subscribe((response: AddressType) => {
          // reset the others
          this.updatedAddressType = null;
          this.removedAddressType = null;
          // get the new state so we can display it when we come from the server
          this.addedAddressType = response;
          // show success
          this.messagesService.emitProcessMessage("PMSAAdt");
          // get the new data from the server
          this.getAddressTypes();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitAddressTypeAdd"));

      // go back to view
      this.isAddressTypeAddOn = !this.isAddressTypeAddOn;

    }


    if (this.isAddressTypeEditOn && addresstype) {

      // update state
      this.addressService.updateAddressType(addresstype)
        .subscribe((response: AddressType) => {
          // reset the others
          this.addedAddressType = null;
          this.removedAddressType = null;
          // get the saved state to pass it when we get the date from the server 
          this.updatedAddressType = response;
          // show success
          this.messagesService.emitProcessMessage("PMSUAdt");
          // get the new data from the server
          this.getAddressTypes();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitAddressTypeUpdate"));

      // go back to view
      this.isAddressTypeEditOn = !this.isAddressTypeEditOn;
    }

  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdateAddressType(): AddressType {

    const formModel = this.addressTypesForm.value;

    let newAddUpdateAddressType: AddressType = new AddressType();

    if (this.isAddressTypeEditOn) { newAddUpdateAddressType.addressTypeId = this.addressTypeInView.addressTypeId; }
    newAddUpdateAddressType.addressType = formModel.addresstypedescription;


    // has anything beeing changed in the form and we are updating
    if (this.isAddressTypeEditOn && !this.isAddressTypeChanged(newAddUpdateAddressType, this.tempAddUpdateAddressType)) {
      this.messagesService.emitProcessMessage("PMEUAdt");
      return null;
    }
    if (this.addressTypeExists(newAddUpdateAddressType)) {
      this.messagesService.emitProcessMessage("PMEUPAdtE");
      return null;
    }

    return newAddUpdateAddressType;
  }

  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  public isAddressTypeChanged(newAddressType: AddressType, oldAddressType: AddressType): boolean {
    if (newAddressType.addressType === oldAddressType.addressType) { return false; }
    return true;
  }


  public addressTypeExists(addresstype: AddressType): boolean {
    let m: number = 0;
    for (m = 0; m < this.addresstypes.length; m++) {
      if (addresstype.addressType === this.addresstypes[m].addressType) { return true; }
    }
    return false;
  }


  public onAddressTypeDeleteClick() {
    this.addressTypeToRemove = this.addressTypeInView;
  }


  public onSubmitDeleteAddressType(addressTypeToRemove: AddressType) {

    this.addressService.deleteAddressType(addressTypeToRemove.addressTypeId)
      .subscribe((response: AddressType) => {
        // reset the update and add
        this.addedAddressType = null;
        this.updatedAddressType = null;
        // show success
        this.messagesService.emitProcessMessage("PMSDAdt");
        // get the new data from the server and start again
        this.getAddressTypes();

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteAddressType"));
  }

  



  //*****************************************************
  // SCREEN CHANGE EMAIL TYPES 
  //*****************************************************
  public onViewEmailTypeChange(state: any) {
    let m: number = 0;
    for (m = 0; m < this.emailtypes.length; m++) {

      if (this.emailtypes[m].emailType === state.target.value) {
        // reset types    
        this.isEmailTypeAddOn = false;
        this.isEmailTypeEditOn = false;
        // set phones
        this.emailTypeInView = this.emailtypes[m];
        this.tempAddUpdateEmailType = this.emailtypes[m];
        this.setEmailTypesFormDefaults();
        break;
      }
    }
  }


  public onEmailTypeAddClick() {
    this.messagesService.emitRoute("nill");
    this.isEmailTypeAddOn = true;
    this.isEmailTypeEditOn = false;
    this.setEmailTypesForm();

    // if phone type in view take it as temp so we can go back if adding has been cancelled
    if (this.emailTypeInView) {
      this.tempAddUpdateEmailType = this.emailTypeInView;
      this.emailTypeInView = null;
    }
  }


  public onEmailTypeEditClick() {
    this.messagesService.emitRoute("nill");
    this.isEmailTypeEditOn = true;
    this.isEmailTypeAddOn = false;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateEmailType = this.emailTypeInView;
    this.setEmailTypesForm();
    this.setEmailTypesFormDefaults();
  }


  public onEmailTypeAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isEmailTypeAddOn == true) { this.isEmailTypeAddOn = false; }
    if (this.isEmailTypeEditOn == true) { this.isEmailTypeEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateEmailType) { this.emailTypeInView = this.tempAddUpdateEmailType; }
  }


  public onSubmitEmailTypeAddUpdate() {

    this.removedEmailType = null;
    this.messagesService.emitRoute("nill");
    let emailtype: EmailType = this.prepareAddUpdateEmailType();

    if (this.isEmailTypeAddOn && emailtype) {

      // add new state
      this.emailsService.addEmailType(emailtype)
        .subscribe((response: EmailType) => {
          // reset the others
          this.updatedEmailType = null;
          this.removedEmailType = null;
          // get the new state so we can display it when we come from the server
          this.addedEmailType = response;
          // show success
          this.messagesService.emitProcessMessage("PMSAEmt");
          // get the new data from the server
          this.getEmailTypes();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitEmailTypeAdd"));

      // go back to view
      this.isEmailTypeAddOn = !this.isEmailTypeAddOn;

    }



    if (this.isEmailTypeEditOn && emailtype) {

      // update state
      this.emailsService.updateEmailType(emailtype)
        .subscribe((response: EmailType) => {
          // reset the others
          this.addedEmailType = null;
          this.removedEmailType = null;
          // get the saved state to pass it when we get the date from the server 
          this.updatedEmailType = response;
          // show success
          this.messagesService.emitProcessMessage("PMSUEmt");
          // get the new data from the server
          this.getEmailTypes();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitEmailTypeUpdate"));

      // go back to view
      this.isEmailTypeEditOn = !this.isEmailTypeEditOn;
    }

  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdateEmailType(): EmailType {

    const formModel = this.emailTypesForm.value;

    let newAddUpdateEmailType: EmailType = new EmailType();

    if (this.isEmailTypeEditOn) { newAddUpdateEmailType.emailTypeId = this.emailTypeInView.emailTypeId; }
    newAddUpdateEmailType.emailType = formModel.emailtypedescription;


    // has anything beeing changed in the form and we are updating
    if (this.isEmailTypeEditOn && !this.isEmailTypeChanged(newAddUpdateEmailType, this.tempAddUpdateEmailType)) {
      this.messagesService.emitProcessMessage("PMEUEmt");
      return null;
    }
    if (this.emailTypeExists(newAddUpdateEmailType)) {
      this.messagesService.emitProcessMessage("PMEUPmtE");
      return null;
    }

    return newAddUpdateEmailType;
  }

  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  public isEmailTypeChanged(newEmailType: EmailType, oldEmailType: EmailType): boolean {
    if (newEmailType.emailType === oldEmailType.emailType) { return false; }
    return true;
  }


  public emailTypeExists(emailtype: EmailType): boolean {
    let m: number = 0;
    for (m = 0; m < this.emailtypes.length; m++) {
      if (emailtype.emailType === this.emailtypes[m].emailType) { return true; }
    }
    return false;
  }


  public onEmailTypeDeleteClick() {
    this.emailTypeToRemove = this.emailTypeInView;
  }


  public onSubmitDeleteEmailType(emailTypeToRemove: EmailType) {

    this.emailsService.deleteEmailType(emailTypeToRemove.emailTypeId)
      .subscribe((response: EmailType) => {
        // reset the update and add
        this.addedEmailType = null;
        this.updatedEmailType = null;
        // show success
        this.messagesService.emitProcessMessage("PMSDEmt");
        // get the new data from the server and start again
        this.getEmailTypes();

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteEmailType"));
  }






  //*****************************************************
  // SCREEN CHANGE SOCIAL TYPES 
  //*****************************************************
  public onViewSocialTypeChange(state: any) {
    let m: number = 0;
    for (m = 0; m < this.socialtypes.length; m++) {

      if (this.socialtypes[m].socialType === state.target.value) {
        // reset types    
        this.isSocialTypeAddOn = false;
        this.isSocialTypeEditOn = false;
        // set phones
        this.socialTypeInView = this.socialtypes[m];
        this.tempAddUpdateSocialType = this.socialtypes[m];
        this.setSocialTypesFormDefaults();
        break;
      }
    }
  }


  public onSocialTypeAddClick() {
    this.messagesService.emitRoute("nill");
    this.isSocialTypeAddOn = true;
    this.isSocialTypeEditOn = false;
    this.setSocialTypesForm();

    // if phone type in view take it as temp so we can go back if adding has been cancelled
    if (this.socialTypeInView) {
      this.tempAddUpdateSocialType = this.socialTypeInView;
      this.socialTypeInView = null;
    }
  }


  public onSocialTypeEditClick() {
    this.messagesService.emitRoute("nill");
    this.isSocialTypeEditOn = true;
    this.isSocialTypeAddOn = false;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateSocialType = this.socialTypeInView;
    this.setSocialTypesForm();
    this.setSocialTypesFormDefaults();
  }


  public onSocialTypeAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isSocialTypeAddOn == true) { this.isSocialTypeAddOn = false; }
    if (this.isSocialTypeEditOn == true) { this.isSocialTypeEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateSocialType) { this.socialTypeInView = this.tempAddUpdateSocialType; }
  }


  public onSubmitSocialTypeAddUpdate() {

    this.removedSocialType = null;
    this.messagesService.emitRoute("nill");
    let socialtype: SocialNetworkType = this.prepareAddUpdateSocialType();

    if (this.isSocialTypeAddOn && socialtype) {

      // add new state
      this.socialsService.addSocialNetworkType(socialtype)
        .subscribe((response: SocialNetworkType) => {
          // reset the others
          this.updatedSocialType = null;
          this.removedSocialType = null;
          // get the new state so we can display it when we come from the server
          this.addedSocialType = response;
          // show success
          this.messagesService.emitProcessMessage("PMSASot");
          // get the new data from the server
          this.getSocialTypes();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitSocialTypeAdd"));

      // go back to view
      this.isSocialTypeAddOn = !this.isSocialTypeAddOn;

    }



    if (this.isSocialTypeEditOn && socialtype) {

      // update state
      this.socialsService.updateSocialNetworkType(socialtype)
        .subscribe((response: SocialNetworkType) => {
          // reset the others
          this.addedSocialType = null;
          this.removedSocialType = null;
          // get the saved state to pass it when we get the date from the server 
          this.updatedSocialType = response;
          // show success
          this.messagesService.emitProcessMessage("PMSUSot");
          // get the new data from the server
          this.getSocialTypes();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitSocialTypeUpdate"));

      // go back to view
      this.isSocialTypeEditOn = !this.isSocialTypeEditOn;
    }

  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdateSocialType(): SocialNetworkType {

    const formModel = this.socialTypesForm.value;

    let newAddUpdateSocialType: SocialNetworkType = new SocialNetworkType();

    if (this.isSocialTypeEditOn) { newAddUpdateSocialType.socialTypeId = this.socialTypeInView.socialTypeId; }
    newAddUpdateSocialType.socialType = formModel.socialtypedescription;


    // has anything beeing changed in the form and we are updating
    if (this.isSocialTypeEditOn && !this.isSocialypeChanged(newAddUpdateSocialType, this.tempAddUpdateSocialType)) {
      this.messagesService.emitProcessMessage("PMEUSot");
      return null;
    }
    if (this.socialTypeExists(newAddUpdateSocialType)) {
      this.messagesService.emitProcessMessage("PMEUSotE");
      return null;
    }

    return newAddUpdateSocialType;
  }

  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  public isSocialypeChanged(newSocialType: SocialNetworkType, oldSocialType: SocialNetworkType): boolean {
    if (newSocialType.socialType === oldSocialType.socialType) { return false; }
    return true;
  }


  public socialTypeExists(socialtype: SocialNetworkType): boolean {
    let m: number = 0;
    for (m = 0; m < this.socialtypes.length; m++) {
      if (socialtype.socialType === this.socialtypes[m].socialType) { return true; }
    }
    return false;
  }


  public onSocialTypeDeleteClick() {
    this.socialTypeToRemove = this.socialTypeInView;
  }


  public onSubmitDeleteSocialType(socialTypeToRemove: SocialNetworkType) {

    this.socialsService.deleteSocialNetworkType(socialTypeToRemove.socialTypeId)
      .subscribe((response: SocialNetworkType) => {
        // reset the update and add
        this.addedSocialType = null;
        this.updatedSocialType = null;
        // show success
        this.messagesService.emitProcessMessage("PMSDSot");
        // get the new data from the server and start again
        this.getSocialTypes();

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteSocialType"));
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
    this.pageTitleService.emitPageTitle(new PageTitle("Process Messages"));
  }




  //****************************************************
  // LOGGING METHODS
  //****************************************************
  public onError(serviceError: any, operation: string) {

    this.isRequesting = false;
    let message: string = "";

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.phone},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

    // PME used to pass the phone 
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



