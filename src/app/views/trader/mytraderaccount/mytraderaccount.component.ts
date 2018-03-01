import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';
// services
import { PersonalDetailsService } from '../../../services/personaldetails/personaldetails.service';
import { ContactDetailsService } from '../../../services/contactdetails/contactdetails.service';
import { SecurityDetailsService } from '../../../services/securitydetails/securitydetails.service';
import { ValidationService } from '../../../services/validation/validation.service';

import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';

// components
import { UserSession, UserIdentity, Authentication, Trade, PageTitle, PersonalDetails, ContactDetails, SecurityDetails } from '../../../helpers/classes';
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
  private personalGroup: any;
  private edit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private personalService: PersonalDetailsService,
    private contactService: ContactDetailsService,
    private securityService: SecurityDetailsService,
    private pageTitleService: PageTitleService,
    private messagesService: ProcessMessageService,
    private loggerService: LoggerService) {
  };


  ngOnInit() {
    this.getUseridentity();
    this.initialiseComponent();

    this.personalGroup = this.formBuilder.group({

      fname: new FormControl('', [Validators.required, ValidationService.firstNameValidator]),
      mname: new FormControl('', [ValidationService.middleNameValidator]),
      lname: new FormControl('', [Validators.required, ValidationService.lastNameValidator])

    });

    this.getPersonalDetails(this.traderId);

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

  //************************************************************
  // UPDATES
  //************************************************************
  private enableEdit() { this.edit = true;}
  private disableEdit() { this.edit = false; }


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
