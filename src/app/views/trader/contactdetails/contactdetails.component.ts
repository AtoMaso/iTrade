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
import { UserSession, PageTitle,  Phone, PhoneType, Email, EmailType, SocialNetwork, SocialNetworkType, PreferredType} from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';



@Component({
  selector: 'app-contactdetails',
  templateUrl: './contactdetails.component.html',
  styleUrls: ['./contactdetails.component.scss']
})
export class ContactlDetailsComponent implements OnInit {

  public traderId: string;
  public isRequesting: boolean;
  public session: UserSession;
  public phoneForm: FormGroup;
  public emailForm: FormGroup;
  public socialForm: FormGroup;

  public isPhoneAddOn: boolean = false;
  public isPhoneEditOn: boolean = false;
  public isSavePhoneOn: boolean = false;

  public availablephones: Phone[] = [];
  public phoneInView: Phone;
  public tempAddUpdatePhone: Phone;
  public availablePhonesCount: number = 0;

  public allphonetypes: PhoneType[] = [];
  public existingphonetypes: PhoneType[] = [];
  public phonetypescanbeadded: PhoneType[] = [];

  public allpreferredphonetypes: PreferredType[] = [];
  public existingpreferredphonetypes: PreferredType[] = [];
  public preferredphonetypestobeadded: PreferredType[] = [];

  public updatedPhone: Phone;
  public addedPhone: Phone;
  public phoneToRemove: Phone;

  public defaultPhoneType: PhoneType;
  public defaultPreferredPhoneType: PreferredType;
  public displayPhoneTypeModal: string;
  public displayPreferredPhoneTypeModal: string;




  //EMAIL
  public isEmailAddOn: boolean = false;
  public isEmailEditOn: boolean = false;
  public isSaveEmailOn: boolean = false;

  public availableemails: Email[] = [];
  public emailInView: Email;
  public tempAddUpdateEmail: Email;
  public availableEmailsCount: number = 0;

  public allemailtypes: EmailType[] = [];
  public existingemailtypes: EmailType[] = [];
  public emailtypescanbeadded: EmailType[] = [];

  public allpreferredemailtypes: PreferredType[] = [];
  public existingpreferredemailtypes: PreferredType[] = [];
  public preferredemailtypestobeadded: PreferredType[] = [];

  public updatedEmail: Email;
  public addedEmail: Email;
  public emailToRemove: Email;

  public defaultEmailType: EmailType;
  public defaultPreferredEmailType: PreferredType;
  public displayEmailTypeModal: string;
  public displayPreferredEmailTypeModal: string;



  // SOCIAL
  public isSocialAddOn: boolean = false;
  public isSocialEditOn: boolean = false;
  public isSaveSocialOn: boolean = false;

  public availablesocials: SocialNetwork[] = [];
  public socialInView: SocialNetwork;
  public tempAddUpdateSocial: SocialNetwork;
  public availableSocialCount: number = 0;

  public allsocialtypes: SocialNetworkType[] = [];
  public existingsocialtypes: SocialNetworkType[] = [];
  public socialtypescanbeadded: SocialNetworkType[] = [];

  public allpreferredsocialtypes: PreferredType[] = [];
  public existingpreferredsocialtypes: PreferredType[] = [];
  public preferredsocialtypestobeadded: PreferredType[] = [];

  public updatedSocial: SocialNetwork;
  public addedSocial: SocialNetwork;
  public socialToRemove: SocialNetwork;

  public defaultSocialType: SocialNetworkType;
  public defaultPreferredSocialType: PreferredType;
  public displaySocialTypeModal: string;
  public displayPreferredSocialTypeModal: string;



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


      setTimeout( function() {

        // this will set the first item from of the select phone type dropdown
        var counter: number = 0;
        if (jQuery('#phtype option')) {
          jQuery('#phtype option').each(function () {
            if (this.text != "" && counter == 1) { jQuery(this).attr("selected", "selected"); }
            counter = counter + 1;
          });
        }

        // this will set the first item from of the select email type dropdown
        let mcounter: number = 0;
        if (jQuery('#emtype option')) {
          jQuery('#emtype option').each(function () {
            if (this.text != "" && mcounter == 1) { jQuery(this).attr("selected", "selected"); }
            mcounter = mcounter + 1;
          });
        }

        // this will set the first item from of the select social type dropdown
        let ncounter: number = 0;
        if (jQuery('#sltype option')) {
          jQuery('#sltype option').each(function () {
            if (this.text != "" && ncounter == 1) { jQuery(this).attr("selected", "selected"); }
            ncounter = ncounter + 1;
          });
        }

      }, 200);

    });
  }



  //********************************************************************
  //  PHONES SECTION
  //********************************************************************
  public getPhonesByTraderId(traderId: string) {
    this.phonesService.getPhonesByTraderId(traderId)
      .subscribe((phonesResult: Phone[]) => {
        this.onSuccessPhones(phonesResult);
      }, (serviceError: Response) => this.onError(serviceError, "getPhonesByTraderId"));

  }


  public onSuccessPhones(phones: Phone[]) {
    // collections return zero length when no record found as it is initialised
    if (phones.length == 0) {
      this.availablephones = null;
      this.phoneInView = null;
    }
    else { this.availablephones = phones; }

    this.getPhoneTypes();
  }

  // get all address types from the server
  public getPhoneTypes() {

    this.allphonetypes = [];

    this.phonesService.getPhoneTypes()
      .subscribe((res: PhoneType[]) => {
        this.onSuccessPhoneTypes(res);
      }
      , (error: Response) => this.onError(error, "getPhoneTypes"));
  }


  public onSuccessPhoneTypes(types: PhoneType[]) {
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
  public getPreferredPhoneTypes() {

    let pre1: PreferredType = new PreferredType();
    pre1.id = 1;
    pre1.value = "Yes";
    let pre2: PreferredType = new PreferredType();
    pre2.id = 2;
    pre2.value = "No";
    this.allpreferredphonetypes.push(pre1);
    this.allpreferredphonetypes.push(pre2);
  }


  public setPhoneInViewPhoneTypesAndPreferredPhoneTypes() {

    if (this.updatedPhone) { this.phoneInView = this.updatedPhone;   }
    else if (this.addedPhone) { this.phoneInView = this.addedPhone;   }
    else { this.phoneInView = this.availablephones[0]; }
    // reset everything
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


  public setPhoneForm() {
    this.phoneForm = this.formBuilder.group({
      preferredphone: new FormControl('', [Validators.required, ValidationService.preferredValidator]),
      phonetype: new FormControl('', [Validators.required,ValidationService.phonetypeValidator]),
      phonenumber: new FormControl('', [Validators.required, ValidationService.phoneValidator]),
      citycode: new FormControl('', [Validators.required, ValidationService.citycodeValidator]),
      countrycode: new FormControl('', [Validators.required, ValidationService.countrycodeValidator])

    });
  }


  public setPhoneFormDefaults() {

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


  public onViewPhoneTypeChange(type:any) {
    let m: number = 0;
    for (m = 0; m < this.availablephones.length; m++) {
      if (this.availablephones[m].phoneType === type.target.value) {
        this.phoneInView = this.availablephones[m];
        this.tempAddUpdatePhone = this.availablephones[m];
        this.setPhoneFormDefaults();
        break;     
      }
    }
  }


  public onPreferredPhoneTypeChange(preferredphonetype: PreferredType) {
    // only check it when we are adding address
    if (this.isPhoneEditOn && !this.isSavePhoneOn) {
      if (preferredphonetype.value == "Yes" && this.tempAddUpdatePhone.preferredFlag != "Yes") {
        let m: number = 0;
        for (m = 0; m < this.existingpreferredphonetypes.length; m++) {
          if (this.existingpreferredphonetypes[m].value == preferredphonetype.value) {
            this.openPreferredPhoneTypeModal();
            break;     
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
            break;     
          }
        }
      }
    }
  }


  public openPreferredPhoneTypeModal() {
    this.displayPreferredPhoneTypeModal = "block";
  }


  public onClosePreferredPhoneHandled() {
    this.displayPreferredPhoneTypeModal = "none";
    this.phoneForm.patchValue({ preferredphone: null });
  }


  public onPhoneTypeChange(type: PhoneType) {
    if (this.isPhoneEditOn) {
      // check when we adding or when updating is there already existing addres
      if (this.phoneInView.phoneType != type.phoneType) {
        let m: number = 0;
        for (m = 0; m < this.existingphonetypes.length; m++) {
          if (this.existingphonetypes[m].phoneType == type.phoneType) {
            this.openPhoneTypeModal();
            break;     
          }
        }
      }
    }

    if (this.isPhoneAddOn && this.existingphonetypes != []) {
      let m: number = 0;
      for (m = 0; m < this.existingphonetypes.length; m++) {
        if (this.existingphonetypes[m].phoneType == type.phoneType) {
          this.openPhoneTypeModal();
          break;     
        }
      }
    }
  }


  public openPhoneTypeModal() {
    this.displayPhoneTypeModal = "block";
  }


  public onClosePhoneHandled() {
    this.displayPhoneTypeModal = "none";
    this.phoneForm.patchValue({ phonetype: null });
  }


  public onPhoneAddClick() {
    this.messagesService.emitRoute("nill");
    this.isPhoneAddOn = true;
    this.isPhoneEditOn = false;
    this.setPhoneForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.phoneInView) {
      this.tempAddUpdatePhone = this.phoneInView;
      this.phoneInView = null;
    }
  }


  public onPhoneEditClick() {
    this.messagesService.emitRoute("nill");
    this.isPhoneEditOn = true;
    this.isPhoneAddOn = false;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdatePhone = this.phoneInView;
    this.setPhoneForm();
    this.setPhoneFormDefaults();
  }


  public onPhoneAddEditCancel() {
    this.messagesService.emitRoute(null);
    if (this.isPhoneAddOn == true) { this.isPhoneAddOn = false; }
    if (this.isPhoneEditOn == true) { this.isPhoneEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdatePhone) { this.phoneInView = this.tempAddUpdatePhone; }
  }


  public onPhoneDeleteClick() {
    this.phoneToRemove = this.phoneInView;
  }


  public onSubmitDeletePhone(phoneToRemove: Phone) {
    // delete phone here 
    this.phonesService.deletePhone(phoneToRemove)
      .subscribe((phoneResult: Phone) => {
        this.messagesService.emitProcessMessage("PMSDPh");

        this.getPhonesByTraderId(this.traderId);
      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeletePhone"));
  }


  public onSubmitPhoneAddUpdate() {

    this.messagesService.emitRoute("nill");
    let phone: Phone = this.prepareAddUpdatePhone();

    if (this.isPhoneAddOn) {

      this.updatedPhone = null;
      // add new phone
      this.phonesService.addPhone(phone).subscribe((response: Phone) => {

        this.addedPhone = response;
        // show success
        this.messagesService.emitProcessMessage("PMSAPh");  // TODO new message here
        // get the new data from the server
        this.getPhonesByTraderId(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "onAddPhone"));

      // go back to view
      this.isPhoneAddOn = !this.isPhoneAddOn;
    }


    if (this.isPhoneEditOn) {

      if (phone) { // if phone changed

        this.addedPhone = null;

        // update phoens
        this.phonesService.updatePhone(phone).subscribe((response: Phone) => {

          // get the saved address so when we 
          this.updatedPhone = response;
          // show success
          this.messagesService.emitProcessMessage("PMSUPh");
          // get the new data from the server
          this.getPhonesByTraderId(this.traderId);

        }, (serviceError: Response) => this.onError(serviceError, "onUpdatePhone"));

        // go back to view
        this.isPhoneEditOn = !this.isPhoneEditOn;
      }
    }
  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdatePhone(): Phone {

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
    if (this.isPhoneEditOn && this.comparePhones(newAddUpdatePhone, this.tempAddUpdatePhone)) {
      this.messagesService.emitProcessMessage("PMEUPh");
      return null;
    } 

    return newAddUpdatePhone;
  }


  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  public comparePhones(newPhone: Phone, oldPhone: Phone): boolean {

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
  public getEmailsByTraderId(traderId: string) {
    this.emailsService.getEmailsByTraderId(traderId)
      .subscribe((emailsResult: Email[]) => {
        this.onSuccessEmails(emailsResult);
      }, (serviceError: Response) => this.onError(serviceError, "getEmailsByTraderId"));

  }


  public onSuccessEmails(emails: Email[]) {
    // collections return zero length when no record found as it is initialised
    if (emails.length == 0) {
      this.availableemails = null;
      this.emailInView = null;
    }
    else { this.availableemails = emails; }

    this.getEmailTypes();
  }


  // get all address types from the server
  public getEmailTypes() {

    this.allemailtypes = [];

    this.emailsService.getEmailTypes()
      .subscribe((res: EmailType[]) => {
        this.onSuccessEmailTypes(res);
      }
      , (error: Response) => this.onError(error, "getEmailTypes"));
  }


  public onSuccessEmailTypes(types: EmailType[]) {
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
  public getPreferredEmailTypes() {

    let pre1: PreferredType = new PreferredType();
    pre1.id = 1;
    pre1.value = "Yes";
    let pre2: PreferredType = new PreferredType();
    pre2.id = 2;
    pre2.value = "No";
    this.allpreferredemailtypes.push(pre1);
    this.allpreferredemailtypes.push(pre2);
  }


  public setEmailInViewEmailTypesAndPreferredEmailTypes() {

    if (this.updatedEmail) { this.emailInView = this.updatedEmail }
    else if (this.addedEmail) { this.emailInView = this.addedEmail; }
    else { this.emailInView = this.availableemails[0]; }
    // reset everything
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


  public setEmailForm() {
    this.emailForm = this.formBuilder.group({
      emailaccount: new FormControl('', [Validators.required, ValidationService.emailValidator]),       
      emailtype: new FormControl('', [Validators.required, ValidationService.emailtypeValidator]),
      preferredemail: new FormControl('', [Validators.required, ValidationService.preferredValidator]),

    });
  }


  public setEmailFormDefaults() {

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


  public onViewEmailTypeChange(type:any) {
    let m: number = 0;
    for (m = 0; m < this.availableemails.length; m++) {
      if (this.availableemails[m].emailType === type.target.value) {
        this.emailInView = this.availableemails[m];
        this.tempAddUpdateEmail = this.availableemails[m];
        this.setEmailFormDefaults();
        break;     
      }
    }
  }


  public onPreferredEmailTypeChange(preferredemailtype: PreferredType) {
    // only check it when we are adding address
    if (this.isEmailEditOn) {
      if (preferredemailtype.value == "Yes" && this.tempAddUpdateEmail.preferredFlag != "Yes") {
        let m: number = 0;
        for (m = 0; m < this.existingpreferredemailtypes.length; m++) {
          if (this.existingpreferredemailtypes[m].value == preferredemailtype.value) {
            this.openPreferredEmailTypeModal();
            break;     
          }
        }
      }
    }

    if (this.isEmailAddOn && this.existingpreferredemailtypes != []) {
      if (preferredemailtype.value == "Yes") {
        let m: number = 0;
        for (m = 0; m < this.existingpreferredemailtypes.length; m++) {
          if (this.existingpreferredemailtypes[m].value == preferredemailtype.value) {
            this.openPreferredEmailTypeModal();
            break;     
          }
        }
      }
    }
  }


  public openPreferredEmailTypeModal() {
    this.displayPreferredEmailTypeModal = "block";
  }


  public onClosePreferredEmailHandled() {
    this.displayPreferredEmailTypeModal = "none";
    this.emailForm.patchValue({ preferredemail: null });
  }


  public onEmailTypeChange(type: EmailType) {
    if (this.isEmailEditOn) {
      // check when we adding or when updating is there already existing addres
      if (this.emailInView.emailType != type.emailType) {
        let m: number = 0;
        for (m = 0; m < this.existingemailtypes.length; m++) {
          if (this.existingemailtypes[m].emailType == type.emailType) {
            this.openEmailTypeModal();
            break;     
          }
        }
      }
    }

    if (this.isEmailAddOn && this.existingemailtypes != []) {
      let m: number = 0;
      for (m = 0; m < this.existingemailtypes.length; m++) {
        if (this.existingemailtypes[m].emailType == type.emailType) {
          this.openEmailTypeModal();
          break;     
        }
      }
    }
  }


  public openEmailTypeModal() {
    this.displayEmailTypeModal = "block";
  }


  public onCloseEmailHandled() {
    this.displayEmailTypeModal = "none";
    this.emailForm.patchValue({ emailtype: null });
  }


  public onEmailAddClick() {
    this.messagesService.emitRoute("nill");
    this.isEmailAddOn = true;
    this.isEmailEditOn = false;
    this.setEmailForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.emailInView) {
      this.tempAddUpdateEmail = this.emailInView;
      this.emailInView = null;
    }
  }


  public onEmailEditClick() {
    this.messagesService.emitRoute("nill");
    this.isEmailEditOn = true;
    this.isEmailAddOn = false;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateEmail = this.emailInView;
    this.setEmailForm();
    this.setEmailFormDefaults();
  }


  public onEmailAddEditCancel() {
    this.messagesService.emitRoute(null);
    if (this.isEmailAddOn == true) { this.isEmailAddOn = false; }
    if (this.isEmailEditOn == true) { this.isEmailEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateEmail) { this.emailInView = this.tempAddUpdateEmail; }
  }


  public onEmailDeleteClick() {
    this.emailToRemove =this.emailInView;
  }


  public onSubmitDeleteEmail(emailToRemove: Email) {
    // delete phone here 
    this.emailsService.deleteEmail(emailToRemove)
      .subscribe((emailResult: Email) => {

        this.messagesService.emitProcessMessage("PMSDEm");
        this.getEmailsByTraderId(this.traderId);
      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteEmail"));
  }



  public onSubmitEmailAddUpdate() {
    this.messagesService.emitRoute("nill");
    let email: Email = this.prepareAddUpdateEmail();

    if (this.isEmailAddOn) {

      // add new phone
      this.emailsService.addEmail(email).subscribe((res: Email) => {

        this.addedEmail = res;
        // show success
        this.messagesService.emitProcessMessage("PMSAEm"); 
        // get the new data from the server
        this.getEmailsByTraderId(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "onAddEmail"));

      // go back to view
      this.isEmailAddOn = !this.isEmailAddOn;
    }


    if (this.isEmailEditOn) {

      if (email) { // if phone changed

        // update phoens
        this.emailsService.updateEmail(email).subscribe((res: Email) => {

          // get the saved address so when we 
          this.updatedEmail = res;
          // show success
          this.messagesService.emitProcessMessage("PMSUEm"); 
          // get the new data from the server
          this.getEmailsByTraderId(this.traderId);

        }, (serviceError: Response) => this.onError(serviceError, "onUpdateEmail"));

        // go back to view
        this.isEmailEditOn = !this.isEmailEditOn;
      }
    }
  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdateEmail(): Email {

    const formModel = this.emailForm.value;

    let preferredflag: PreferredType = formModel.preferredemail;
    let emtype: EmailType = formModel.emailtype;

    let newAddUpdateEmail: Email = new Email();

    if (this.isEmailEditOn) { newAddUpdateEmail.id = this.emailInView.id; }
    newAddUpdateEmail.traderId = this.traderId as string;
    newAddUpdateEmail.account = formModel.emailaccount as string;    
    newAddUpdateEmail.preferredFlag = preferredflag.value;
    newAddUpdateEmail.emailTypeId = emtype.emailTypeId;      

    // has anything beeing changed in the form and we are updating
    if (this.isEmailEditOn && this.compareEmails(newAddUpdateEmail, this.tempAddUpdateEmail)) {
      this.messagesService.emitProcessMessage("PMEUEm");
      return null;
    } 

    return newAddUpdateEmail;
  }


  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  public compareEmails(newEmail: Email, oldEmail: Email): boolean {

    if (newEmail.emailTypeId === oldEmail.emailTypeId &&    
      newEmail.traderId === oldEmail.traderId &&
      newEmail.account === oldEmail.account &&  
      newEmail.preferredFlag === oldEmail.preferredFlag) {
      return true;
    }

    return false;
  }





  //************************************************************
  // SOCIALS
  //************************************************************
  public getSocialsByTraderId(traderId: string) {
    this.socialsService.getSocialNetworksByTraderId(traderId)
      .subscribe((socialsResult: SocialNetwork[]) => {
        this.onSuccessSocials(socialsResult);
      }, (serviceError: Response) => this.onError(serviceError, "getSocialsByTraderId"));

  }


  public onSuccessSocials(socials: SocialNetwork[]) {
    // collections return zero length when no record found as it is initialised
    if (socials.length == 0) {
      this.availablesocials = null;
      this.phoneInView = null;
    }
    else { this.availablesocials = socials; }

    this.getSocialNetworkTypes();
  }


  // get all address types from the server
  public getSocialNetworkTypes() {

    this.allsocialtypes = [];

    this.socialsService.getSocialNetworkTypes()
      .subscribe((res: SocialNetworkType[]) => {
        this.onSuccessSocialNetworkTypes(res);
      }
      , (error: Response) => this.onError(error, "getPhoneTypes"));
  }


  public onSuccessSocialNetworkTypes(types: SocialNetworkType[]) {
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
  public getPreferredSocialTypes() {

    let pre1: PreferredType = new PreferredType();
    pre1.id = 1;
    pre1.value = "Yes";
    let pre2: PreferredType = new PreferredType();
    pre2.id = 2;
    pre2.value = "No";
    this.allpreferredsocialtypes.push(pre1);
    this.allpreferredsocialtypes.push(pre2);
  }


  public setSocialInViewSocialTypesAndPreferredSocialTypes() {

    if (this.updatedSocial) { this.socialInView = this.updatedSocial }
    else if (this.addedSocial) { this.socialInView = this.addedSocial; }
    else { this.socialInView = this.availablesocials[0]; }
    // reset everything
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


  public setSocialForm() {
    this.socialForm = this.formBuilder.group({
  
      socialaccount: new FormControl('', [Validators.required, ValidationService.emailValidator]),    
      socialtype: new FormControl('', [Validators.required, ValidationService.socialtypeValidator]),
      preferredsocial: new FormControl('', [Validators.required, ValidationService.preferredValidator]),

    });
  }


  public setSocialFormDefaults() {

    let m: number = 0;

    for (m = 0; m < this.allsocialtypes.length; m++) {
      if (this.allsocialtypes[m].socialType == this.socialInView.socialType) { this.defaultSocialType = this.allsocialtypes[m]; }
    }

    for (m = 0; m < this.allpreferredsocialtypes.length; m++) {
      if (this.allpreferredsocialtypes[m].value == this.socialInView.preferredFlag) { this.defaultPreferredSocialType = this.allpreferredsocialtypes[m]; }
    }

    setTimeout(() => {

      this.socialForm.setValue({
        socialaccount: this.socialInView.account,    
        socialtype: this.defaultSocialType,
        preferredsocial: this.defaultPreferredSocialType
      });

    }, 30);
  }


  public onViewSocialTypeChange(type: any) {
    let m: number = 0;
    for (m = 0; m < this.availablesocials.length; m++) {
      if (this.availablesocials[m].socialType === type.target.value) {
        this.socialInView = this.availablesocials[m];
        this.tempAddUpdateSocial = this.availablesocials[m];
        this.setSocialFormDefaults();
        break;     
      }
    }
  }


  public onPreferredSocialTypeChange(preferredsocialtype: PreferredType) {
    // only check it when we are adding address
    if (this.isSocialEditOn && !this.isSaveSocialOn) {
      if (preferredsocialtype.value == "Yes" && this.tempAddUpdateSocial.preferredFlag != "Yes") {
        let m: number = 0;
        for (m = 0; m < this.existingpreferredsocialtypes.length; m++) {
          if (this.existingpreferredsocialtypes[m].value == preferredsocialtype.value) {
            this.openPreferredSocialTypeModal();
            break;     
          }
        }
      }
    }

    if (this.isSocialAddOn && this.existingpreferredsocialtypes != []) {
      if (preferredsocialtype.value == "Yes") {
        let m: number = 0;
        for (m = 0; m < this.existingpreferredsocialtypes.length; m++) {
          if (this.existingpreferredsocialtypes[m].value == preferredsocialtype.value) {
            this.openPreferredSocialTypeModal();
            break;     
          }
        }
      }
    }
  }


  public openPreferredSocialTypeModal() {
    this.displayPreferredSocialTypeModal = "block";
  }


  public onClosePreferredSocialHandled() {
    this.displayPreferredSocialTypeModal = "none";
    this.socialForm.patchValue({ preferredsocial: null });
  }


  public onSocialTypeChange(type: SocialNetworkType) {
    if (this.isSocialEditOn) {
      // check when we adding or when updating is there already existing addres
      if (this.socialInView.socialType != type.socialType) {
        let m: number = 0;
        for (m = 0; m < this.existingsocialtypes.length; m++) {
          if (this.existingsocialtypes[m].socialType == type.socialType) {
            this.openSocialTypeModal();
            break;     
          }
        }
      }
    }

    if (this.isSocialAddOn && this.existingsocialtypes != []) {
      let m: number = 0;
      for (m = 0; m < this.existingsocialtypes.length; m++) {
        if (this.existingsocialtypes[m].socialType == type.socialType) {
          this.openSocialTypeModal();
          break;     
        }
      }
    }
  }


  public openSocialTypeModal() {
    this.displaySocialTypeModal = "block";
  }


  public onCloseSocialHandled() {
    this.displaySocialTypeModal = "none";
    this.socialForm.patchValue({ socialltype: null });
  }


  public onSocialAddClick() {
    this.messagesService.emitRoute("nill");
    this.isSocialAddOn = true;
    this.isSocialEditOn = false;
    this.setSocialForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.socialInView) {
      this.tempAddUpdateSocial = this.socialInView;
      this.socialInView = null;
    }
  }


  public onSocialEditClick() {
    this.messagesService.emitRoute("nill");
    this.isSocialEditOn = true;
    this.isSocialAddOn = false;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateSocial = this.socialInView;
    this.setSocialForm();
    this.setSocialFormDefaults();
  }


  public onSocialAddEditCancel() {
    this.messagesService.emitRoute(null);
    if (this.isSocialAddOn == true) { this.isSocialAddOn = false; }
    if (this.isSocialEditOn == true) { this.isSocialEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateSocial) { this.socialInView = this.tempAddUpdateSocial; }
  }


  public onSocialDeleteClick() {
    this.socialToRemove = this.socialInView;
  }


  public onSubmitDeleteSocial(socialToRemove: SocialNetwork) {
    // delete phone here 
    this.socialsService.deleteSocialNetwork(socialToRemove)
      .subscribe((socialResult: SocialNetwork) => {

        this.messagesService.emitProcessMessage("PMSDSo");

        this.getSocialsByTraderId(this.traderId);
      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteSocial"));
  }


  public onSubmitSocialAddUpdate() {
    this.messagesService.emitRoute("nill");
    let social: SocialNetwork = this.prepareAddUpdateSocial();

    if (this.isSocialAddOn) {

      // add new phone
      this.socialsService.addSocialNetwork(social).subscribe((res: SocialNetwork) => {

        this.addedSocial = res;
        // show success
        this.messagesService.emitProcessMessage("PMSASo");  // TODO new message here
        // get the new data from the server
        this.getSocialsByTraderId(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "onAddSocial"));

      // go back to view
      this.isSocialAddOn = !this.isSocialAddOn;
    }


    if (this.isSocialEditOn) {

      if (social) { // if phone changed

        // update phoens
        this.socialsService.updateSocialNetwork(social).subscribe((res: SocialNetwork) => {

          // get the saved address so when we 
          this.updatedSocial = res;
          // show success
          this.messagesService.emitProcessMessage("PMSUSo"); 
          // get the new data from the server
          this.getSocialsByTraderId(this.traderId);

        }, (serviceError: Response) => this.onError(serviceError, "onUpdateSocial"));

        // go back to view
        this.isSocialEditOn = !this.isSocialEditOn;
      }
    }
  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdateSocial(): SocialNetwork {

    const formModel = this.socialForm.value;

    let preferredflag: PreferredType = formModel.preferredsocial;
    let socialtype: SocialNetworkType = formModel.socialtype;

    let newAddUpdateSocial: SocialNetwork = new SocialNetwork();

    if (this.isSocialEditOn) { newAddUpdateSocial.id = this.socialInView.id; }
    newAddUpdateSocial.traderId = this.traderId as string;
    newAddUpdateSocial.account = formModel.socialaccount as string;
    newAddUpdateSocial.preferredFlag = preferredflag.value;
    newAddUpdateSocial.socialTypeId = socialtype.socialTypeId;
    //newAddUpdateSocial.socialType = socialtype.socialType;

    // has anything beeing changed in the form and we are updating
    if (this.isSocialEditOn && this.compareSocials(newAddUpdateSocial, this.tempAddUpdateSocial)) {
      this.messagesService.emitProcessMessage("PMEUSo");
      return null;
    } 
    return newAddUpdateSocial;
  }


  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  public compareSocials(newSocial: SocialNetwork, oldSocial: SocialNetwork): boolean {

    if (newSocial.socialTypeId === oldSocial.socialTypeId &&
      newSocial.socialType === oldSocial.socialType &&
      newSocial.account === oldSocial.account &&
      newSocial.preferredFlag === oldSocial.preferredFlag) {
      return true;
    }

    return false;
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
    this.pageTitleService.emitPageTitle(new PageTitle("My Contact Details"));
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


