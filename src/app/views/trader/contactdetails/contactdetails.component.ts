import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators  } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import {PhonesService } from '../../../services/phones/phones.service';
import {EmailsService } from '../../../services/emails/emails.service';
import {SocialNetworksService } from '../../../services/socialnetworks/social-networks.service';

import { ValidationService } from '../../../services/validation/validation.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import { CapsPipe } from '../../../helpers/pipes';
import { UserSession, UserIdentity, Authentication, PageTitle,  Phone, PhoneType, Email, EmailType, SocialNetwork, SocialNetworkType, PreferredType} from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';



@Component({
  selector: 'app-contactdetails',
  templateUrl: './contactdetails.component.html',
  styleUrls: ['./contactdetails.component.scss']
})
export class ContactlDetailsComponent implements OnInit {

  private traderId: string;
  private isRequesting: boolean;
  private session: UserSession;
  private phoneForm: FormGroup;
  private emailForm: FormGroup;
  private socialForm: FormGroup;

  private isPhoneAddOn: boolean = false;
  private isPhoneEditOn: boolean = false;
  private isSavePhoneOn: boolean = false;

  private availablephones: Phone[] = [];
  private phoneInView: Phone;
  private tempAddUpdatePhone: Phone;
  private availablePhonesCount: number = 0;

  private allphonetypes: PhoneType[] = [];
  private existingphonetypes: PhoneType[] = [];
  private phonetypescanbeadded: PhoneType[] = [];

  private allpreferredphonetypes: PreferredType[] = [];
  private existingpreferredphonetypes: PreferredType[] = [];
  private preferredphonetypestobeadded: PreferredType[] = [];

  private updatedPhone: Phone;
  private addedPhone: Phone;
  private phoneToRemove: Phone;

  private defaultPhoneType: PhoneType;
  private defaultPreferredPhoneType: PreferredType;

  private displayPhoneTypeModal: string;
  private displayPreferredPhoneTypeModal: string;




  //EMAIL
  private isEmailAddOn: boolean = false;
  private isEmailEditOn: boolean = false;
  private isSaveEmailOn: boolean = false;

  private availableemails: Email[] = [];
  private emailInView: Email;
  private tempAddUpdateEmail: Email;
  private availableEmailsCount: number = 0;

  private allemailtypes: EmailType[] = [];
  private existingemailtypes: EmailType[] = [];
  private emailtypescanbeadded: EmailType[] = [];

  private allpreferredemailtypes: PreferredType[] = [];
  private existingpreferredemailtypes: PreferredType[] = [];
  private preferredemailtypestobeadded: PreferredType[] = [];

  private updatedEmail: Email;
  private addedEmail: Email;
  private emailToRemove: Email;

  private defaultEmailType: EmailType;
  private defaultPreferredEmailType: PreferredType;
  private displayEmailTypeModal: string;
  private displayPreferredEmailTypeModal: string;



  // SOCIAL
  private isSocialAddOn: boolean = false;
  private isSocialEditOn: boolean = false;
  private isSaveSociallOn: boolean = false;

  private availablesocials: SocialNetwork[] = [];
  private socialInView: SocialNetwork;
  private tempAddUpdateSocial: SocialNetwork;
  private availableSocialCount: number = 0;

  private allsocialtypes: SocialNetworkType[] = [];
  private existingsocialtypes: SocialNetworkType[] = [];
  private socialtypescanbeadded: SocialNetworkType[] = [];

  private allpreferredsocialtypes: PreferredType[] = [];
  private existingpreferredsocialtypes: PreferredType[] = [];
  private preferredsocialtypestobeadded: PreferredType[] = [];

  private updatedSocial: SocialNetwork;
  private addedSocial: SocialNetwork;
  private socialToRemove: SocialNetwork;

  private defaultSocialType: SocialNetworkType;
  private defaultPreferredSocialType: PreferredType;
  private displaySocialTypeModal: string;
  private displayPreferredSocialTypeModal: string;



  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private phonesService: PhonesService,
    private emailsService: EmailsService,
    private socialsService: SocialNetworksService,
    private pageTitleService: PageTitleService,
    private messagesService: ProcessMessageService,
    private loggerService: LoggerService) {
  };


  ngOnInit() {
    this.getUserSession();
    this.initialiseComponent();

    this.getPhonesByTraderId(this.traderId);
    this.getEmailsByTraderId(this.traderId);
    this.getSocialsByTraderId(this.traderId);

    this.setPhoneForm();
    this.setEmailForm();
    this.setSocialForm();
  }


  // toggling done with jquery
  public ngAfterViewInit() {

    jQuery(document).ready(function () {

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapsePhones").on("hide.bs.collapse", function () {
        jQuery(".phones").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Phones</span>  ');
      });
      jQuery("#collapsePhones").on("show.bs.collapse", function () {
        jQuery(".phones").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Phones</span>');
      });

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapseEmails").on("hide.bs.collapse", function () {
        jQuery(".emails").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Emails</span>  ');
      });
      jQuery("#collapseEmails").on("show.bs.collapse", function () {
        jQuery(".emails").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Emails</span>');
      });

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapseSocials").on("hide.bs.collapse", function () {
        jQuery(".socials").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Socials</span>  ');
      });
      jQuery("#collapseSocials").on("show.bs.collapse", function () {
        jQuery(".socials").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Socials</span>');
      });




      // this will remove the selected phone type which is not allowed
      jQuery("#phoneTypeModal").on("click", function () {
        jQuery("#phonetype").val("").attr("selected", "selected");
      });

      // this will remove the selected preferred phone type which is not allowed
      jQuery("#preferredPhoneTypeModal").on("click", function () {
        jQuery("#preferredphonetype").val("").attr("selected", "selected");
      });

      // this will remove the selected email type which is not allowed
      jQuery("#emailTypeModal").on("click", function () {
        jQuery("#emailtype").val("").attr("selected", "selected");
      });

      // this will remove the selected preferred type which is not allowed
      jQuery("#preferredEmailTypeModal").on("click", function () {
        jQuery("#preferredemailtype").val("").attr("selected", "selected");
      });

      // this will remove the selected address type which is not allowed
      jQuery("#socialTypeModal").on("click", function () {
        jQuery("#socialtype").val("").attr("selected", "selected");
      });

      // this will remove the selected preferred type which is not allowed
      jQuery("#preferredSocialTypeModal").on("click", function () {
        jQuery("#preferredsocialtype").val("").attr("selected", "selected");
      });



      // this will set the first item from of the select phone type dropdown
      var counter = 0;
      if (jQuery('#phtype option')) {
        jQuery('#phtype option').each(function () {
          if (this.text != "" && counter == 1) {
            jQuery(this).attr("selected", "selected");
          }
          counter = counter + 1;
        });
      }

      // this will set the first item from of the select email type dropdown
      var counter = 0;
      if (jQuery('#emtype option')) {
        jQuery('#emtype option').each(function () {
          if (this.text != "" && counter == 1) {
            jQuery(this).attr("selected", "selected");
          }
          counter = counter + 1;
        });
      }

      // this will set the first item from of the select social type dropdown
      var counter = 0;
      if (jQuery('#sltype option')) {
        jQuery('#sltype option').each(function () {
          if (this.text != "" && counter == 1) {
            jQuery(this).attr("selected", "selected");
          }
          counter = counter + 1;
        });
      }
    });
  }



  //********************************************************************
  //  PHONES SECTION
  //********************************************************************
  private getPhonesByTraderId(traderId: string) {
    this.phonesService.getPhonesByTraderId(traderId)
      .subscribe((phonesResult: Phone[]) => {
        this.onSuccessPhones(phonesResult);
      }, (serviceError: Response) => this.onError(serviceError, "getPhonesByTraderId"));

  }


  private onSuccessPhones(phones: Phone[]) {
    // collections return zero length when no record found as it is initialised
    if (phones.length == 0) {
      this.availablephones = null;
      this.phoneInView = null;
    }
    else { this.availablephones = phones; }

    this.getPhoneTypes();
  }

  // get all address types from the server
  private getPhoneTypes() {

    this.allphonetypes = [];

    this.phonesService.getPhoneTypes()
      .subscribe((res: PhoneType[]) => {
        this.onSuccessPhoneTypes(res);
      }
      , (error: Response) => this.onError(error, "getPhoneTypes"));
  }


  private onSuccessPhoneTypes(types: PhoneType[]) {
    this.isRequesting = false;

    // collections return zero length when no record found as it is initialised
    if (types.length === 0) { this.allphonetypes = null; }
    else { this.allphonetypes = types; }

    // get preferred types
    if (this.allpreferredphonetypes.length === 0) { this.getPreferredPhoneTypes(); }

    // handle no records returned for either of these
    if (this.allphonetypes && this.availablephones && this.allpreferredphonetypes) { this.setPhoneInViewPhoneTypesAndPreferredPhoneTypes(); }
    else {
      if (this.allphonetypes) {
        // add all address types if they exist
        this.phonetypescanbeadded = this.allphonetypes;
        this.existingphonetypes = [];
      }
      if (this.allpreferredphonetypes) {
        this.preferredphonetypestobeadded = this.allpreferredphonetypes;
        this.existingpreferredphonetypes = [];
      }
    }
  }

  // get preferred types
  private getPreferredPhoneTypes() {

    let pre1: PreferredType = new PreferredType();
    pre1.id = 1;
    pre1.value = "Yes";
    let pre2: PreferredType = new PreferredType();
    pre2.id = 2;
    pre2.value = "No";
    this.allpreferredphonetypes.push(pre1);
    this.allpreferredphonetypes.push(pre2);
  }


  private setPhoneInViewPhoneTypesAndPreferredPhoneTypes() {

    if (this.updatedPhone) { this.phoneInView = this.updatedPhone }
    else if (this.addedPhone) { this.phoneInView = this.addedPhone; }
    else { this.phoneInView = this.availablephones[0]; }

    this.availablePhonesCount = this.availablephones.length;
    this.addedPhone = null;
    this.updatedPhone = null;

    this.existingphonetypes = [];
    this.phonetypescanbeadded = [];
    this.existingpreferredphonetypes = [];
    this.preferredphonetypestobeadded = [];


    let m: number = 0;
    let n: number = 0;
    // get the existing address types
    for (m = 0; m < this.allphonetypes.length; m++) {
      for (n = 0; n < this.availablephones.length; n++) {
        if (this.allphonetypes[m].phoneType == this.availablephones[n].phoneType) {
          this.existingphonetypes.push(this.allphonetypes[m]);
        }
      }
    }


    let exist: boolean = false;
    // get the addres types which can be added
    for (m = 0; m < this.allphonetypes.length; m++) {
      for (n = 0; n < this.existingphonetypes.length; n++) {
        if (this.allphonetypes[m].phoneType == this.existingphonetypes[n].phoneType) {
          exist = true;
          break;
        }
      }
      if (!exist) { this.phonetypescanbeadded.push(this.allphonetypes[m]); }
      exist = false;
    }


    // get the existing preferred types
    for (m = 0; m < this.allpreferredphonetypes.length; m++) {
      for (n = 0; n < this.availablephones.length; n++) {
        if (this.allpreferredphonetypes[m].value == this.availablephones[n].preferredFlag) {
          this.existingpreferredphonetypes.push(this.allpreferredphonetypes[m]);
        }
      }
    }


    // get the preferred types which can be added
    for (m = 0; m < this.allpreferredphonetypes.length; m++) {
      for (n = 0; n < this.existingpreferredphonetypes.length; n++) {
        if (this.allpreferredphonetypes[m].value == this.existingpreferredphonetypes[n].value) {
          exist = true;
          break;
        }
      }
      if (!exist) { this.preferredphonetypestobeadded.push(this.allpreferredphonetypes[m]); }
      exist = false;
    }

  }


  private setPhoneForm() {
    this.phoneForm = this.formBuilder.group({
      preferredphone: new FormControl('', [Validators.required, ValidationService.preferredValidator]),
      phonetype: new FormControl('', [ValidationService.phonetypeValidator]),
      phonenumber: new FormControl('', [Validators.required, ValidationService.phoneValidator]),
      citycode: new FormControl('', [ValidationService.citycodeValidator]),
      countrycode: new FormControl('', [ValidationService.countrycodeValidator])

    });
  }


  private setPhoneFormDefaults() {

    let m: number = 0;

    for (m = 0; m < this.allphonetypes.length; m++) {
      if (this.allphonetypes[m].phoneType == this.phoneInView.phoneType) { this.defaultPhoneType = this.allphonetypes[m]; }
    }

    for (m = 0; m < this.allpreferredphonetypes.length; m++) {
      if (this.allpreferredphonetypes[m].value == this.phoneInView.preferredFlag) { this.defaultPreferredPhoneType = this.allpreferredphonetypes[m]; }
    }

    setTimeout(() => {

      this.phoneForm.setValue({
        preferredphone: this.defaultPreferredPhoneType,
        phonetype: this.defaultPhoneType,
        phonenumber: this.phoneInView.number,
        citycode: this.phoneInView.cityCode || "",
        countrycode: this.phoneInView.countryCode || "",


      });

    }, 30);
  }


  private onViewPhoneTypeChange(type:any) {
    let m: number = 0;
    for (m = 0; m < this.availablephones.length; m++) {
      if (this.availablephones[m].phoneType === type.target.value) {
        this.phoneInView = this.availablephones[m];
        this.tempAddUpdatePhone = this.availablephones[m];
        this.setPhoneFormDefaults();
      }
    }
  }


  private onPreferredPhoneTypeChange(preferredphonetype: PreferredType) {
    // only check it when we are adding address
    if (this.isPhoneEditOn && !this.isSavePhoneOn) {
      if (preferredphonetype.value == "Yes" && this.tempAddUpdatePhone.preferredFlag != "Yes") {
        let m: number = 0;
        for (m = 0; m < this.existingpreferredphonetypes.length; m++) {
          if (this.existingpreferredphonetypes[m].value == preferredphonetype.value) {
            this.openPreferredPhoneTypeModal();
          }
        }
      }
    }

    if (this.isPhoneAddOn && this.existingpreferredphonetypes != []) {
      if (preferredphonetype.value == "Yes") {
        let m: number = 0;
        for (m = 0; m < this.existingpreferredphonetypes.length; m++) {
          if (this.existingpreferredphonetypes[m].value == preferredphonetype.value) {
            this.openPreferredPhoneTypeModal();
          }
        }
      }
    }
  }


  private openPreferredPhoneTypeModal() {
    this.displayPreferredPhoneTypeModal = "block";
  }


  private onClosePreferredPhoneHandled() {
    this.displayPreferredPhoneTypeModal = "none";
    this.phoneForm.patchValue({ preferredtype: null });
  }


  private onPhoneTypeChange(type: PhoneType) {
    if (this.isPhoneEditOn) {
      // check when we adding or when updating is there already existing addres
      if (this.phoneInView.phoneType != type.phoneType) {
        let m: number = 0;
        for (m = 0; m < this.existingphonetypes.length; m++) {
          if (this.existingphonetypes[m].phoneType == type.phoneType) {
            this.openPhoneTypeModal();
          }
        }
      }
    }

    if (this.isPhoneAddOn && this.existingphonetypes != []) {
      let m: number = 0;
      for (m = 0; m < this.existingphonetypes.length; m++) {
        if (this.existingphonetypes[m].phoneType == type.phoneType) {
          this.openPhoneTypeModal();
        }
      }
    }
  }


  private openPhoneTypeModal() {
    this.displayPhoneTypeModal = "block";
  }


  private onClosePhoneHandled() {
    this.displayPhoneTypeModal = "none";
    this.phoneForm.patchValue({ phonetype: null });
  }


  private onPhoneAddClick() {
    this.messagesService.emitRoute("nill");
    this.isPhoneAddOn = true;
    this.setPhoneForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.phoneInView) {
      this.tempAddUpdatePhone = this.phoneInView;
      this.phoneInView = null;
    }
  }


  private onPhoneEditClick() {
    this.messagesService.emitRoute("nill");
    this.isPhoneEditOn = true;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdatePhone = this.phoneInView;
    this.setPhoneForm();
    this.setPhoneFormDefaults();
  }


  private onPhoneAddEditCancel() {
    this.messagesService.emitRoute(null);
    if (this.isPhoneAddOn == true) { this.isPhoneAddOn = false; }
    if (this.isPhoneEditOn == true) { this.isPhoneEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdatePhone) { this.phoneInView = this.tempAddUpdatePhone; }
  }


  private onPhonesDeleteClick(phoneInView: Phone) {
    this.phoneToRemove = phoneInView;
  }


  private onSubmitDeletePhone(phoneToRemove: Phone) {
    // delete phone here 
    this.phonesService.deletePhone(phoneToRemove)
      .subscribe((phoneResult: Phone) => {

        this.getPhonesByTraderId(this.traderId);
      }, (serviceError: Response) => this.onError(serviceError, "onSubmitPhoneAddUpdate"));
  }



  private onSubmitPhoneAddUpdate() {

    this.messagesService.emitRoute("nill");
    let phone: Phone = this.prepareAddUpdatePhone();

    if (this.isPhoneAddOn) {

      // add new phone
      this.phonesService.addPhone(phone).subscribe((res: Phone) => {

        this.addedPhone = res;
        // show success
        this.messagesService.emitProcessMessage("PMSAPn");  // TODO new message here
        // get the new data from the server
        this.getPhonesByTraderId(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "onAddPhone"));

      // go back to view
      this.isPhoneAddOn = !this.isPhoneAddOn;
    }


    if (this.isPhoneEditOn) {

      if (phone) { // if phone changed

        // update phoens
        this.phonesService.updatePhone(phone).subscribe((res: Phone) => {

          // get the saved address so when we 
          this.updatedPhone = res;
          // show success
          this.messagesService.emitProcessMessage("PMSUAd");
          // get the new data from the server
          this.getPhonesByTraderId(this.traderId);

        }, (serviceError: Response) => this.onError(serviceError, "onUpdatePhone"));

        // go back to view
        this.isPhoneEditOn = !this.isPhoneEditOn;
      }
    }
  }


  // prepare the new add or update data - get it from the form
  private prepareAddUpdatePhone(): Phone {

    const formModel = this.phoneForm.value;

    let preferredflag: PreferredType = formModel.preferredphone;
    let phonetype: PhoneType = formModel.phonetype;

    let newAddUpdatePhone: Phone = new Phone();

    if (this.isPhoneEditOn) { newAddUpdatePhone.id = this.phoneInView.id; }
    newAddUpdatePhone.traderId = this.traderId as string;
    newAddUpdatePhone.number = formModel.phonenumber as string;  
    newAddUpdatePhone.cityCode = formModel.citycode;
    newAddUpdatePhone.countryCode = formModel.countrycode;
    newAddUpdatePhone.preferredFlag = preferredflag.value;
    newAddUpdatePhone.phoneTypeId = phonetype.phoneTypeId;

    // has anything beeing changed in the form and we are updating
    if (this.isPhoneEditOn && this.comparePhones(newAddUpdatePhone, this.tempAddUpdatePhone)) { this.messagesService.emitProcessMessage("PMEUPh"); return null; } // TODO new process message here

    return newAddUpdatePhone;
  }


  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  private comparePhones(newPhone: Phone, oldPhone: Phone): boolean {

    if (newPhone.phoneTypeId === oldPhone.phoneTypeId &&   
      newPhone.cityCode === oldPhone.cityCode &&
      newPhone.number === oldPhone.number &&
      newPhone.countryCode === oldPhone.countryCode &&
      newPhone.preferredFlag === oldPhone.preferredFlag ) {
      return true;
    }

    return false;
  }




  //************************************************************
  // EMAILS SECTION
  //************************************************************
  private getEmailsByTraderId(traderId: string) {
    this.emailsService.getEmailsByTraderId(traderId)
      .subscribe((emailsResult: Email[]) => {
        this.onSuccessEmails(emailsResult);
      }, (serviceError: Response) => this.onError(serviceError, "getEmailsByTraderId"));

  }


  private onSuccessEmails(emails: Email[]) {
    // collections return zero length when no record found as it is initialised
    if (emails.length == 0) {
      this.availableemails = null;
      this.emailInView = null;
    }
    else { this.availableemails = emails; }

    this.getEmailTypes();
  }


  // get all address types from the server
  private getEmailTypes() {

    this.allemailtypes = [];

    this.emailsService.getEmailTypes()
      .subscribe((res: EmailType[]) => {
        this.onSuccessEmailTypes(res);
      }
      , (error: Response) => this.onError(error, "getEmailTypes"));
  }


  private onSuccessEmailTypes(types: EmailType[]) {
    this.isRequesting = false;

    // collections return zero length when no record found as it is initialised
    if (types.length === 0) { this.allemailtypes = null; }
    else { this.allemailtypes = types; }

    // get preferred types
    if (this.allpreferredemailtypes.length === 0) { this.getPreferredEmailTypes(); }

    // handle no records returned for either of these
    if (this.allemailtypes && this.availableemails && this.allpreferredemailtypes) { this.setEmailInViewEmailTypesAndPreferredEmailTypes(); }
    else {
      if (this.allemailtypes) {
        // add all address types if they exist
        this.emailtypescanbeadded = this.allemailtypes;
        this.existingemailtypes = [];
      }
      if (this.allpreferredemailtypes) {
        this.preferredemailtypestobeadded = this.allpreferredemailtypes;
        this.existingpreferredemailtypes = [];
      }
    }
  }

  // get preferred types
  private getPreferredEmailTypes() {

    let pre1: PreferredType = new PreferredType();
    pre1.id = 1;
    pre1.value = "Yes";
    let pre2: PreferredType = new PreferredType();
    pre2.id = 2;
    pre2.value = "No";
    this.allpreferredemailtypes.push(pre1);
    this.allpreferredemailtypes.push(pre2);
  }


  private setEmailInViewEmailTypesAndPreferredEmailTypes() {

    if (this.updatedEmail) { this.emailInView = this.updatedEmail }
    else if (this.addedEmail) { this.emailInView = this.addedEmail; }
    else { this.emailInView = this.availableemails[0]; }

    this.availableEmailsCount = this.availableemails.length;
    this.addedEmail = null;
    this.updatedEmail = null;

    this.existingemailtypes = [];
    this.emailtypescanbeadded = [];
    this.existingpreferredemailtypes = [];
    this.preferredemailtypestobeadded = [];


    let m: number = 0;
    let n: number = 0;
    // get the existing address types
    for (m = 0; m < this.allemailtypes.length; m++) {
      for (n = 0; n < this.availableemails.length; n++) {
        if (this.allemailtypes[m].emailType == this.availableemails[n].emailType) {
          this.existingemailtypes.push(this.allemailtypes[m]);
        }
      }
    }


    let exist: boolean = false;
    // get the addres types which can be added
    for (m = 0; m < this.allemailtypes.length; m++) {
      for (n = 0; n < this.existingemailtypes.length; n++) {
        if (this.allemailtypes[m].emailType == this.existingemailtypes[n].emailType) {
          exist = true;
          break;
        }
      }
      if (!exist) { this.emailtypescanbeadded.push(this.allemailtypes[m]); }
      exist = false;
    }


    // get the existing preferred types
    for (m = 0; m < this.allpreferredemailtypes.length; m++) {
      for (n = 0; n < this.availableemails.length; n++) {
        if (this.allpreferredemailtypes[m].value == this.availableemails[n].preferredFlag) {
          this.existingpreferredemailtypes.push(this.allpreferredemailtypes[m]);
        }
      }
    }


    // get the preferred types which can be added
    for (m = 0; m < this.allpreferredemailtypes.length; m++) {
      for (n = 0; n < this.existingpreferredemailtypes.length; n++) {
        if (this.allpreferredemailtypes[m].value == this.existingpreferredemailtypes[n].value) {
          exist = true;
          break;
        }
      }
      if (!exist) { this.preferredemailtypestobeadded.push(this.allpreferredemailtypes[m]); }
      exist = false;
    }

  }


  private setEmailForm() {
    this.emailForm = this.formBuilder.group({
      emailaccount: new FormControl('', [Validators.required, ValidationService.emailValidator]),       
      emailtype: new FormControl('', [ValidationService.emailtypeValidator]),
      preferredemail: new FormControl('', [Validators.required, ValidationService.preferredValidator]),

    });
  }


  private setEmailFormDefaults() {

    let m: number = 0;

    for (m = 0; m < this.allemailtypes.length; m++) {
      if (this.allemailtypes[m].emailType == this.emailInView.emailType) { this.defaultEmailType = this.allemailtypes[m]; }
    }

    for (m = 0; m < this.allpreferredemailtypes.length; m++) {
      if (this.allpreferredemailtypes[m].value == this.emailInView.preferredFlag) { this.defaultPreferredEmailType = this.allpreferredemailtypes[m]; }
    }

    setTimeout(() => {

      this.emailForm.setValue({
        emailaccount: this.emailInView.account,       
        emailtype: this.defaultEmailType,
        preferredemail: this.defaultPreferredEmailType
      });

    }, 30);
  }


  private onViewEmailTypeChange(event) {
  }

  private onPreferredEmailTypeChange(event: any) {
  }

  private onEmailTypeChange(event: any) {
  }

  private onEmailAddClick() {
  }

  private onEmailEditClick() {
  }

  private onEmailAddEditCancel() {
  }

  private onSubmitEmailAddUpdate() {
  }

  private onEmailDeleteClick(phone: Phone) {
  }

  private onCloseEmailHandled() {
  }

  private onClosePreferredEmailHandled() {
  }

  private onSubmitDeleteEmail(emailToRemove: Email) {
  }






  //************************************************************
  // SOCIALS
  //************************************************************
  private getSocialsByTraderId(traderId: string) {
    this.socialsService.getSocialNetworksByTraderId(traderId)
      .subscribe((socialsResult: SocialNetwork[]) => {
        this.onSuccessSocials(socialsResult);
      }, (serviceError: Response) => this.onError(serviceError, "getSocialsByTraderId"));

  }

  private onSuccessSocials(socials: SocialNetwork[]) {
    // collections return zero length when no record found as it is initialised
    if (socials.length == 0) {
      this.availablesocials = null;
      this.phoneInView = null;
    }
    else { this.availablesocials = socials; }

    this.getSocialNetworkTypes();
  }


  // get all address types from the server
  private getSocialNetworkTypes() {

    this.allsocialtypes = [];

    this.socialsService.getSocialNetworkTypes()
      .subscribe((res: SocialNetworkType[]) => {
        this.onSuccessSocialNetworkTypes(res);
      }
      , (error: Response) => this.onError(error, "getPhoneTypes"));
  }


  private onSuccessSocialNetworkTypes(types: SocialNetworkType[]) {
    this.isRequesting = false;

    // collections return zero length when no record found as it is initialised
    if (types.length === 0) { this.allsocialtypes = null; }
    else { this.allsocialtypes = types; }

    // get preferred types
    if (this.allpreferredsocialtypes.length === 0) { this.getPreferredSocialTypes(); }

    // handle no records returned for either of these
    if (this.allsocialtypes && this.availablesocials && this.allpreferredsocialtypes) { this.setSocialInViewSocialTypesAndPreferredSocialTypes(); }
    else {
      if (this.allsocialtypes) {
        // add all address types if they exist
        this.socialtypescanbeadded = this.allsocialtypes;
        this.existingsocialtypes = [];
      }
      if (this.allpreferredsocialtypes) {
        this.preferredsocialtypestobeadded = this.allpreferredsocialtypes;
        this.existingpreferredsocialtypes = [];
      }
    }
  }

  // get preferred types
  private getPreferredSocialTypes() {

    let pre1: PreferredType = new PreferredType();
    pre1.id = 1;
    pre1.value = "Yes";
    let pre2: PreferredType = new PreferredType();
    pre2.id = 2;
    pre2.value = "No";
    this.allpreferredsocialtypes.push(pre1);
    this.allpreferredsocialtypes.push(pre2);
  }



  private setSocialInViewSocialTypesAndPreferredSocialTypes() {

    if (this.updatedSocial) { this.socialInView = this.updatedSocial }
    else if (this.addedSocial) { this.socialInView = this.addedSocial; }
    else { this.socialInView = this.availablesocials[0]; }

    this.availableSocialCount = this.availablesocials.length;
    this.addedSocial = null;
    this.updatedSocial = null;

    this.existingsocialtypes = [];
    this.socialtypescanbeadded = [];
    this.existingpreferredsocialtypes = [];
    this.preferredsocialtypestobeadded = [];


    let m: number = 0;
    let n: number = 0;
    // get the existing address types
    for (m = 0; m < this.allsocialtypes.length; m++) {
      for (n = 0; n < this.availablesocials.length; n++) {
        if (this.allsocialtypes[m].socialType == this.availablesocials[n].socialType) {
          this.existingsocialtypes.push(this.allsocialtypes[m]);
        }
      }
    }


    let exist: boolean = false;
    // get the addres types which can be added
    for (m = 0; m < this.allsocialtypes.length; m++) {
      for (n = 0; n < this.existingsocialtypes.length; n++) {
        if (this.allsocialtypes[m].socialType == this.existingsocialtypes[n].socialType) {
          exist = true;
          break;
        }
      }
      if (!exist) { this.socialtypescanbeadded.push(this.allsocialtypes[m]); }
      exist = false;
    }


    // get the existing preferred types
    for (m = 0; m < this.allpreferredsocialtypes.length; m++) {
      for (n = 0; n < this.availablesocials.length; n++) {
        if (this.allpreferredsocialtypes[m].value == this.availablesocials[n].preferredFlag) {
          this.existingpreferredsocialtypes.push(this.allpreferredsocialtypes[m]);
        }
      }
    }


    // get the preferred types which can be added
    for (m = 0; m < this.allpreferredsocialtypes.length; m++) {
      for (n = 0; n < this.existingpreferredsocialtypes.length; n++) {
        if (this.allpreferredsocialtypes[m].value == this.existingpreferredsocialtypes[n].value) {
          exist = true;
          break;
        }
      }
      if (!exist) { this.preferredsocialtypestobeadded.push(this.allpreferredsocialtypes[m]); }
      exist = false;
    }

  }



  //********************************************************************
  // FORM SECTION
  //********************************************************************
  private setSocialForm() {
    this.socialForm = this.formBuilder.group({
  
      socialaccount: new FormControl('', [Validators.required, ValidationService.emailValidator]),    
      socialtype: new FormControl('', [ValidationService.socialtypeValidator]),
      preferredsocial: new FormControl('', [Validators.required, ValidationService.preferredValidator]),

    });
  }


  private setSocialFormDefaults() {

    let m: number = 0;

    for (m = 0; m < this.allsocialtypes.length; m++) {
      if (this.allsocialtypes[m].socialType == this.socialInView.socialType) { this.defaultSocialType = this.allsocialtypes[m]; }
    }

    for (m = 0; m < this.allpreferredsocialtypes.length; m++) {
      if (this.allpreferredsocialtypes[m].value == this.socialInView.preferredFlag) { this.defaultPreferredSocialType = this.allpreferredsocialtypes[m]; }
    }

    setTimeout(() => {

      this.phoneForm.setValue({
        socialaccount: this.socialInView.account,    
        socialtype: this.defaultSocialType,
        preferredsocial: this.defaultPreferredSocialType
      });

    }, 30);
  }


  //********************************************************************
  // SCREEN INPUT
  //********************************************************************

  private onViewSocialTypeChange(event) {
  }

  private onPreferredSocialTypeChange(event: any) {
  }

  private onSocialTypeChange(event: any) {
  }

  private onSocialAddClick() {
  }

  private onSocialEditClick() {
  }

  private onSocialAddEditCancel() {
  }

  private onSubmitSocialAddUpdate() {
  }

  private onSocialDeleteClick(Social: SocialNetwork) {
  }

  private onCloseSocialHandled() {
  }

  private onClosePreferredSocialHandled() {
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
    this.isRequesting = true;
    this.pageTitleService.emitPageTitle(new PageTitle("My Contact Details"));
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


