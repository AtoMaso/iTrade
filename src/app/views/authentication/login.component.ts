﻿import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, } from '@angular/router';
import { Http, Response } from '@angular/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder} from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';
import { ValidationService } from '../../services/validation.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { ApplicationUser, Authentication, UserSession, UserIdentity, Role, PageTitle } from '../../helpers/classes';
import { ControlMessages } from '../controls/control-messages.component';

@Component({
    selector: 'login-view',
    templateUrl: './login.component.html',
    //directives: [ControlMessages, ROUTER_DIRECTIVES]
})


export class LoginComponent implements OnInit {
  private account: ApplicationUser = new ApplicationUser();
  private loginGroup: FormGroup;
  private isRequesting: boolean;

  //*****************************************************
  // CONSTRUCTOR IMPLEMENTAION
  //*****************************************************
  constructor( private _router: Router,
                    private _formBuilder: FormBuilder,
                    private _authenticationService: AuthenticationService,
                    private _pmService: ProcessMessageService,
                    private _pageTitleService: PageTitleService,
                    private _loggerService: LoggerService) {

    _pageTitleService.emitPageTitle(new PageTitle("Login"));
    _pmService.emitRoute("nill");
    
  }

  ngOnInit() {
    this.loginGroup = this._formBuilder.group({
      Email: new FormControl('', [Validators.required, ValidationService.emailValidator, ValidationService.emailDomainValidator]),
      Password: new FormControl('', Validators.compose([Validators.required, ValidationService.passwordValidator]))
    });

    //this.loginGroup = new FormGroup({
    //          Email: new FormControl('', [Validators.required, ValidationService.emailValidator, ValidationService.emailDomainValidator]),
    //          Password: new FormControl('', Validators.compose([Validators.required, ValidationService.passwordValidator]))
    //    });
  }


  //****************************************************
  // GET ACCOUNT
  //****************************************************
  private login() {
    this._authenticationService.login(this.loginGroup.controls.Email.value, this.loginGroup.controls.Password.value)
          .subscribe(res => this.onLoginSuccess(res)
          , error =>  this.onError(error));
  }



  //****************************************************
  // PRIVATE METHODS
  //****************************************************
  private onLoginSuccess(res:any) {    
      if (sessionStorage["UserSession"] != "null") {               
          this._router.navigate(['Home']);
          this.emitUserSession(res);
      }    
  }

  // get the next session from the session observable
  private emitUserSession(res:any) {
        this._authenticationService.emitUserSession(this._authenticationService.getUserSession());
  }


  //****************************************************
  // LOGGING METHODS
  //****************************************************
  // an error has occured
  private onError(err: any) {    

      let message: string;
      // stop the spinner
      this.isRequesting = false;
      // we will log the error in the server side by calling the logger, or that is already 
      // done on the server side if the error has been caught
      this._loggerService.logErrors(err, "login");

      // we will display a fiendly process message using the process message service        
      if (err.status !== 200 || err.status !== 300) {
        let data = err.json();
        if (data.error) {
              // login user
              message = data.error;
              this._pmService.emitProcessMessage("PME", message);
        }
        else {
                this._pmService.emitProcessMessage("PMG");
        }
      }      
  }
}

