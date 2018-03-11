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

import { RegisterBindingModel, UserSession, UserIdentity, PageTitle } from '../../helpers/classes';
import { ControlMessages } from '../controls/controlmessages/control-messages.component';

@Component({
  selector: 'register-view',
  templateUrl: './register.component.html',
   styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  private registerModel = new RegisterBindingModel();
  private submitted = false;
  private registerGroup: any;
  private isRequesting: boolean = false;


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
      this.isRequesting = true;
      this.authenticationService.register(this.registerModel)
        .subscribe(res => this.onSucessRegistering(res)
        , (error: Response) => this.onError(error, "Register"));
    }
  }


  private ComparePasswords(passedtrader: RegisterBindingModel): boolean {
    if (passedtrader.Password === passedtrader.ConfirmPassword) { return true; }
    else {
      this.messagesService.emitProcessMessage("PMEPCP");
      return false;
    }
  }


  private onSucessRegistering(res: any) {
    this.isRequesting = false;
    this.submitted = true;
    this.messagesService.emitProcessMessage("PMSCTr");
  }



  // toggles the submitted flag which should disable the form and show the succes small form
  private onSubmit() { this.submitted = true; }


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