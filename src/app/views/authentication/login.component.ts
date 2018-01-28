import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router, } from '@angular/router';
import { Http, Response } from '@angular/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ValidationService } from '../../services/validation/validation.service';
import { LoggerService } from '../../services/logger/logger.service';
import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';

import { TraderDetails, LoginModel, UserSession, UserIdentity, PageTitle } from '../../helpers/classes';
import { ControlMessages } from '../controls/controlmessages/control-messages.component';

@Component({
    selector: 'login-view',
     templateUrl: './login.component.html'
})


export class LoginComponent implements OnInit {
  private trader: LoginModel;
  private loginGroup: any;
  private isRequesting: boolean;
 
  //*****************************************************
  // CONSTRUCTOR IMPLEMENTAION
  //*****************************************************
  constructor( private router: Router,
                    private formBuilder: FormBuilder,
                    private authenticationService: AuthenticationService,
                    private messageService: ProcessMessageService,
                    private titleService: PageTitleService,
                    private loggerService: LoggerService) {}

  ngOnInit() {
      
    this.titleService.emitPageTitle(new PageTitle("Login"));
    this.messageService.emitRoute("nill");

    this.loginGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
      password: new FormControl('', [Validators.required, ValidationService.passwordValidator]),
    });
  }


  //****************************************************
  // GET ACCOUNT
  //****************************************************
  private login() {
    this.trader = new LoginModel();
    this.trader.UserName = this.loginGroup.controls.email.value;
    this.trader.Password = this.loginGroup.controls.password.value;

    if (this.loginGroup.dirty && this.loginGroup.valid) {
      this.authenticationService.loginClient(this.trader)
                  .subscribe(res => this.onLoginSuccess(res)
                  , error => this.onError(error));
    }  
  }


  //****************************************************
  // PRIVATE METHODS
  //****************************************************
  private onLoginSuccess(res:any) {    
      if (sessionStorage["UserSession"] != "null") {               
        this.router.navigate(['/traderhome']);     
        this.emitUserSession(res);
      }    
  }

  // get the next session from the session observable
  private emitUserSession(res:any) {
        this.authenticationService.emitUserSession(this.authenticationService.getUserSession());
  }


  //****************************************************
  // LOGGING METHODS
  //****************************************************
  // an error has occured
  private onError(err: any) {

    // stop the spinner
    this.isRequesting = false;
    // we will log the error in the server side by calling the logger, or that is already 
    // done on the server side if the error has been caught
    this.loggerService.addError(err, "login");

    // we will display a fiendly process message using the process message service        
    if (err.status !== 200 || err.status !== 300) {
      if (err.status === 400) { this.messageService.emitProcessMessage("PMEPI"); }
      else {
        if (err.error !== null) { this.messageService.emitProcessMessage("PME", err.error); }
        else { this.messageService.emitProcessMessage("PMG"); }
      }
    }
  }
}

