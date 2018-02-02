import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router, } from '@angular/router';
import { Http, Response } from '@angular/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ValidationService } from '../../services/validation/validation.service';
import { LoggerService } from '../../services/logger/logger.service';
import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';

import { TraderDetails, RegisterBindingModel, UserSession, UserIdentity, PageTitle } from '../../helpers/classes';
import { ControlMessages } from '../controls/controlmessages/control-messages.component';

@Component({
  selector: 'register-view',
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {

  private trader: TraderDetails = new TraderDetails();
  private registerModel = new RegisterBindingModel();
  private submitted = false;
  private registerGroup: any;


  //*****************************************************
  // CONSTRUCTOR IMPLEMENTAION
  //*****************************************************
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private messagesService: ProcessMessageService,
    private titleService: PageTitleService,
    private loggerService: LoggerService) { }


  ngOnInit() {

    this.titleService.emitPageTitle(new PageTitle("Register"));
    this.messagesService.emitRoute("nill");
    //this.user.Role = this.route.snapshot.params['role'];

    this.registerGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
      password: new FormControl('', [Validators.required, ValidationService.passwordValidator]),
      confirmPassword: new FormControl('', [Validators.required, ValidationService.confirmPasswordValidator]),
    });

  }

  //****************************************************
  // GET ACCOUNT
  //****************************************************
  private register() {

    this.registerModel.Email = this.registerGroup.controls.email.value;
    this.registerModel.Password = this.registerGroup.controls.password.value;
    this.registerModel.ConfirmPassword = this.registerGroup.controls.confirmPassword.value;
    this.registerModel.Role = "Trader";

    if (this.ComparePasswords(this.registerModel)) {

      this.authenticationService.register(this.registerModel)
        .subscribe(res => this.onSucessRegistering(res)
        , (err: Response) => this.onError(err, "Register"));
    }
  }


  private ComparePasswords(passedtrader: RegisterBindingModel): boolean {
    if (passedtrader.Password === passedtrader.ConfirmPassword) { return true; }
    else {
      this.messagesService.emitProcessMessage("PMPNE");
      return false;
    }
  }


  private onSucessRegistering(res: any) {
    this.submitted = true;
    this.messagesService.emitProcessMessage("PMRS");
  }



  // toggles the submitted flag which should disable the form and show the succes small form
  private onSubmit() { this.submitted = true; }



  //****************************************************
  // LOGGING METHODS
  //****************************************************
  private onError(serviceError: any, operation: string) {

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

    if (serviceError.error.ModelState !== undefined) { this.messagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }
    else if (serviceError.status === 400) { this.messagesService.emitProcessMessage("PMEPI", serviceError.error); }
    else if (serviceError.error !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error); }
    else { this.messagesService.emitProcessMessage("PMG"); }


    // TODO !!!!  to be used if we decide to have multiple messages in the ModelState passed from the web api
    //  let message: string = null;
    //  // we will log the error in the server side by calling the logger, or that is already 
    //  // done on the server side if the error has been caught
    //  this.loggerService.addError(serviceError, "register");
    //  if (serviceError.status !== 200 || serviceError.status !== 300) {
    //    let data = serviceError.json();
    //    if (data.ModelState) {
    //      for (var key in data.ModelState) {
    //        for (var i = 0; i < data.ModelState[key].length; i++) {
    //          if (message == null) { message = data.ModelState[key][i]; }
    //          else { message = message + data.ModelState[key][i]; }
    //        }
    //      }
    //      this.messagesService.emitProcessMessage("PME", message);
    //    }
    //    else { this.messagesService.emitProcessMessage("PMG"); }
    //}
  }
}