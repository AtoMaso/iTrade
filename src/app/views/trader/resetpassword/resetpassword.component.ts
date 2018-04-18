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
import { UserSession, PageTitle, Trader, ResetPasswordBindingModel } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public isRequesting: boolean = false;
  public isSubmitted: boolean = false;
  public code: string = "";
  public resetPasswordForm: FormGroup;
  public model: ResetPasswordBindingModel = new ResetPasswordBindingModel();

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService, 
    private pageTitleService: PageTitleService,
    private messagesService: ProcessMessageService,
    private loggerService: LoggerService) {
  };


  ngOnInit() { 
    this.route.queryParams.subscribe(params => { this.code = params['code']; });

    this.initialiseComponent();
 
    this.setResetPasswordForm();

  }


  public setResetPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({     
      email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
      newpassword: new FormControl('', [Validators.required, ValidationService.passwordValidator]),
      confirmpassword: new FormControl('', [Validators.required, ValidationService.confirmPasswordValidator]),
    });
  }


  public onResetPasswordSubmit() {
    this.isRequesting = true;
    this.model.Email = this.resetPasswordForm.controls.email.value;
    this.model.NewPassword = this.resetPasswordForm.controls.newpassword.value;
    this.model.ConfirmPassword = this.resetPasswordForm.controls.confirmpassword.value;
    this.model.Code = this.code
    this.isRequesting = true;

    this.authenticationService.resetPassword(this.model)
      .subscribe(res => {
        this.onSucessSendRequest(res);
      }
      , (error: Response) => this.onError(error, "onResetPasswordSubmit"));

  }


  public onSucessSendRequest(res: any) {
    this.isRequesting = false;
    this.isSubmitted = true;
    //this.messagesService.emitProcessMessage("PMSCPa");
  }



  //************************************************************
  // HELPER METHODS SECTION
  //************************************************************
  public initialiseComponent() {
    this.messagesService.emitRoute("nill");
    this.pageTitleService.emitPageTitle(new PageTitle("Reset Password"));
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
