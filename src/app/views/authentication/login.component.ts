import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router, } from '@angular/router';
import { Http, Response } from '@angular/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';
import { ValidationService } from '../../services/validation.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { Trader, UserSession, UserIdentity, PageTitle } from '../../helpers/classes';
import { ControlMessages } from '../controls/control-messages.component';

@Component({
    selector: 'login-view',
    templateUrl: './login.component.html',
})


export class LoginComponent implements OnInit {
  private trader: Trader;
  private loginGroup: any;
  private isRequesting: boolean;
  private pagetitle: PageTitle;
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
   
    this.pagetitle = new PageTitle();
    this.pagetitle.title = "Login";
    this.titleService.emitPageTitle(this.pagetitle);
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
    this.trader.email = this.loginGroup.controls.email.value;
    this.trader.password = this.loginGroup.controls.password.value;

    if (this.loginGroup.dirty && this.loginGroup.valid) {
      this.authenticationService.login(this.trader)
                  .subscribe(res => this.onLoginSuccess(res)
                  , error => this.onError(error));
    }  
  }


  //****************************************************
  // PRIVATE METHODS
  //****************************************************
  private onLoginSuccess(res:any) {    
      if (sessionStorage["UserSession"] != "null") {               
          this.router.navigate(['Home']);
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

      let message: string;
      // stop the spinner
      this.isRequesting = false;
      // we will log the error in the server side by calling the logger, or that is already 
      // done on the server side if the error has been caught
      this.loggerService.logErrors(err, "login");

      // we will display a fiendly process message using the process message service        
      if (err.status !== 200 || err.status !== 300) {
        let data = err.json();
        if (data.error) {
              // login user
              message = data.error;
              this.messageService.emitProcessMessage("PME", message);
        }
        else {
              this.messageService.emitProcessMessage("PMG");
        }
      }      
  }
}

