import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router, } from '@angular/router';
import { Http, Response } from '@angular/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { ValidationService } from '../../services/validation.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { ApplicationUser, UserSession, UserIdentity, Role, PageTitle } from '../../helpers/classes';
import { ControlMessages } from '../controls/control-messages.component';

@Component({
    selector: 'register-view',
    templateUrl: './register.component.html'   
})

export class RegisterComponent implements OnInit {
    
    private user: ApplicationUser = new ApplicationUser();    
    private submitted = false;
    private registerGroup: any;

    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
  constructor(private route: ActivatedRoute,
                    private formBuilder: FormBuilder,
                    private authenticationService: AuthenticationService,
                    private processMessageService: ProcessMessageService,
                    private pageTitleService: PageTitleService,
                    private loggerService: LoggerService) {  }


  ngOnInit() {

    this.pageTitleService.emitPageTitle(new PageTitle("Register"));
    this.processMessageService.emitRoute("nill");
    this.user.Role = this.route.snapshot.params['role'];

    this.registerGroup = this.formBuilder.group({
          name: new FormControl('', [Validators.required, ValidationService.nameValidator]),
          email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
          password: new FormControl('', [Validators.required, ValidationService.passwordValidator]),
          confirmpassword: new FormControl('', [Validators.required, ValidationService.confirmPasswordValidator]),
    });

  }

    //****************************************************
    // GET ACCOUNT
    //****************************************************
  private register() {        

    this.user.Name = this.registerGroup.controls.name.value;
    this.user.Email = this.registerGroup.controls.email.value;
    this.user.Password = this.registerGroup.controls.password.value;
    this.user.ConfirmPassword = this.registerGroup.controls.confirmpassword.value;

    if (this.ComparePasswords(this.user)) {
            this.authenticationService.register(this.user)
                .subscribe(res => this.onSucessRegistering(res)              
                , (err: Response) => this.onError(err));
        }
    }
  
    private ComparePasswords(passeduser:ApplicationUser): boolean {
        if (passeduser.Password === passeduser.ConfirmPassword) { return true; }
        else {
            this.processMessageService.emitProcessMessage("PMPNE");
            return false;
        }
    }

    private onSucessRegistering(res: any) {
        this.submitted = true;
        this.processMessageService.emitProcessMessage("PMRS");
    }

    //// toggles the submitted flag which should disable the form and
    //// show the succes small form
    //private onSubmit() { this.submitted = true; }


    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    private onError(err: Response) {       
          let message: string = null;     

          // we will log the error in the server side by calling the logger, or that is already 
          // done on the server side if the error has been caught
          this.loggerService.logErrors(err, "register");      

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
                  this.processMessageService.emitProcessMessage("PME", message);
                } // end if
                else {
                  this.processMessageService.emitProcessMessage("PMG");
                }
          } //end if       
    }// end method
} // end class

