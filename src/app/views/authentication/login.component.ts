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
  private keeplogin: boolean;
  private loginGroup: any;
  private isRequesting: boolean;
 
  //*****************************************************
  // CONSTRUCTOR IMPLEMENTAION
  //*****************************************************
  constructor( private router: Router,
                    private formBuilder: FormBuilder,
                    private authenticationService: AuthenticationService,
                    private messagesService: ProcessMessageService,
                    private titleService: PageTitleService,
                    private loggerService: LoggerService) {}

  ngOnInit() {
      
    this.titleService.emitPageTitle(new PageTitle("Login"));
    this.messagesService.emitRoute("nill");

    this.loginGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
      password: new FormControl('', [Validators.required, ValidationService.passwordValidator]),
      keeplogin: new FormControl('', []),
    });
  }


  //****************************************************
  // GET ACCOUNT
  //****************************************************
  private login() {
    this.trader = new LoginModel();
    this.trader.UserName = this.loginGroup.controls.email.value;
    this.trader.Password = this.loginGroup.controls.password.value;
    this.keeplogin = this.loginGroup.controls.keeplogin.value;

    if (this.loginGroup.dirty && this.loginGroup.valid) {
      this.authenticationService.loginClient(this.trader)
          .subscribe(res => this.onLoginSuccess(res)
           , (error: Response) => this.onError(error, "Login"));
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
  private onError(serviceError: any, operation: string) {

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

    // PME used to pass the message
    if (serviceError.error.ModelState !== undefined) { this.messagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }    
    else if (serviceError.status === 400 && serviceError.error.substring("password") !== null ) { this.messagesService.emitProcessMessage("PMEPUI"); }
    else if (serviceError.error !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error); }
    else { this.messagesService.emitProcessMessage("PMUEO"); } // unexpected error

  }
}

