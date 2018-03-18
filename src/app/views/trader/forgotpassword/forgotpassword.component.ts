import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';

// components
import { UserSession, PageTitle, ForgotPasswordBindingModel } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  private isRequesting: boolean = false;
  private isSubmited: boolean = false;
  private forgotForm: FormGroup;
  private model: ForgotPasswordBindingModel = new ForgotPasswordBindingModel();

  constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private pageTitleService: PageTitleService,
        private messagesService: ProcessMessageService,
        private loggerService: LoggerService) { }


  ngOnInit() {  
    this.initialiseComponent();
    this.setForgotForm();
  }


  private setForgotForm() {
    this.forgotForm = this.formBuilder.group({
      emailaccount: new FormControl('', [Validators.required, ValidationService.emailValidator]),    
    });
  }

  private onForgotPasswordRequest() {

    this.model.Email = this.forgotForm.controls.emailaccount.value;
    this.isRequesting = true;

    this.authenticationService.forgotMyPasswod(this.model)
      .subscribe(res => {
        this.onSucessSednRequest(res);
      }
      , (error: Response) => this.onError(error, "forgotPasswordRequest"));

  }


  private onSucessSednRequest(res: any) {
    this.isRequesting = false; 
    this.isSubmited = true; 
  }


  //************************************************************
  // HELPER METHODS
  //************************************************************
  private initialiseComponent() {
    this.messagesService.emitRoute("nill");
    this.pageTitleService.emitPageTitle(new PageTitle("Forgot Password"));
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
