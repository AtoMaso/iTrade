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

import { Trader, UserSession, UserIdentity, PageTitle } from '../../helpers/classes';
import { ControlMessages } from '../controls/controlmessages/control-messages.component';

@Component({
    selector: 'register-view',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {
    
    private trader: Trader = new Trader();    
    private submitted = false;
    private registerGroup: any;
    private pagetitle; PageTitle;

    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
  constructor(private route: ActivatedRoute,
                    private formBuilder: FormBuilder,
                    private authenticationService: AuthenticationService,
                    private messageService: ProcessMessageService,
                    private titleService: PageTitleService,
                    private loggerService: LoggerService) {  }


  ngOnInit() {
    this.pagetitle = new PageTitle();
    this.pagetitle.title = "Register";
    this.titleService.emitPageTitle(this.pagetitle);

    this.messageService.emitRoute("nill");
    //this.user.Role = this.route.snapshot.params['role'];

    this.registerGroup = this.formBuilder.group({
          name: new FormControl('', [Validators.required, ValidationService.nameValidator]),
          email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
          password: new FormControl('', [Validators.required, ValidationService.passwordValidator]),
          confirmPassword: new FormControl('', [Validators.required, ValidationService.confirmPasswordValidator]),
    });

  }

    //****************************************************
    // GET ACCOUNT
    //****************************************************
  private register() {        

    this.trader.name = this.registerGroup.controls.name.value;
    this.trader.email = this.registerGroup.controls.email.value;
    this.trader.password = this.registerGroup.controls.password.value;
    this.trader.confirmPassword = this.registerGroup.controls.confirmPassword.value;

    if (this.ComparePasswords(this.trader)) {
      this.authenticationService.register(this.trader)
                .subscribe(res => this.onSucessRegistering(res)              
                , (err: Response) => this.onError(err));
        }
    }
  
    private ComparePasswords(passedtrader:Trader): boolean {
      if (passedtrader.password === passedtrader.confirmPassword) { return true; }
        else {
            this.messageService.emitProcessMessage("PMPNE");
            return false;
        }
    }

    private onSucessRegistering(res: any) {
        this.submitted = true;
        this.messageService.emitProcessMessage("PMRS");
    }

    // toggles the submitted flag which should disable the form and
    // show the succes small form
    private onSubmit() { this.submitted = true; }


    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    private onError(err: Response) {       
          let message: string = null;     

          // we will log the error in the server side by calling the logger, or that is already 
          // done on the server side if the error has been caught
          this.loggerService.addError(err, "register");      

          // we will display a fiendly process message using the process message service   
          if (err.status !== 200) {
                let data = err.json();

                if (data.ModelState) {
                      for (var key in data.ModelState) {
                            for (var i = 0; i < data.ModelState[key].length; i++) {                                
                                  if (message == null) { message = data.ModelState[key][i]; }
                                  else { message = message + data.ModelState[key][i]; } // end if else
                            }// end for
                      } // end for
                  this.messageService.emitProcessMessage("PME", message);
                } // end if
                else {
                  this.messageService.emitProcessMessage("PMG");
                }
          } //end if       
    }// end method
} // end class

