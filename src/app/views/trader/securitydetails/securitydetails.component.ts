import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators  } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { TraderApiService } from '../../../services/traderapi/traderapi.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import { UserSession, PageTitle, Trader, ChangePasswordBindingModel } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';



@Component({
  selector: 'app-securitydetails',
  templateUrl: './securitydetails.component.html',
  styleUrls: ['./securitydetails.component.scss']
})
export class SecurityDetailsComponent implements OnInit {

  private traderId: string;
  private isRequesting: boolean;
  private session: UserSession;

  private changePasswordForm: FormGroup;

  private isChangePasswordOn: boolean = false;
  private isSavePasswordOn: boolean = false;

  private trader: Trader;
  private updatedTrader: Trader;
  private traderToRemove: Trader;

  private changePasswordInfo: ChangePasswordBindingModel;


  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private traderService: TraderApiService,
    private pageTitleService: PageTitleService,
    private messagesService: ProcessMessageService,
    private loggerService: LoggerService) {
  };


  ngOnInit() {
    this.getUserSession();
    this.initialiseComponent();

    this.getTraderInfo();
    this.setChangePasswordForm();

  }


  // toggling done with jquery
  public ngAfterViewInit() {

    jQuery(document).ready(function () {

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapseLoginDetails").on("hide.bs.collapse", function () {
        jQuery(".logindetails").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Login Details</span>  ');
      });
      jQuery("#collapseLoginDetails").on("show.bs.collapse", function () {
        jQuery(".logindetails").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Login Details</span>');
      });
    });

  }

  //************************************************************
  // GET DATA SECTION
  //************************************************************
  private getTraderInfo() {
    this.traderService.getTraderByTraderId(this.traderId)
      .subscribe((response: Trader) => {       
        this.onSuccessUserInfo(response); 
      });
  }


  private onSuccessUserInfo(response: Trader) {
    this.trader = response;       
    this.trader.password = "***************";     
  }

  private setChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      oldpassword: new FormControl('', [Validators.required, ValidationService.passwordValidator]),
      newpassword: new FormControl('', [Validators.required, ValidationService.passwordValidator]),
      confirmpassword: new FormControl('', [Validators.required, ValidationService.confirmPasswordValidator]),  
    });
  }


  //************************************************************
  // SCREEN INPUT SECTION
  //************************************************************
  private onChangePasswordClick() {
    this.isChangePasswordOn = true;
  }

  private onChangePasswordCancel() {
    this.isChangePasswordOn = false;
  }

  private onChangePasswordSubmit() {
    this.changePasswordInfo = new ChangePasswordBindingModel();
    this.changePasswordInfo.OldPassword = this.changePasswordForm.controls.oldpassword.value;
    this.changePasswordInfo.NewPassword = this.changePasswordForm.controls.newpassword.value;
    this.changePasswordInfo.ConfirmPassword = this.changePasswordForm.controls.confirmpassword.value;  



    if (this.ComparePasswords(this.changePasswordInfo)) {

      this.isRequesting = true;

      this.authenticationService.changeUserPassword(this.changePasswordInfo)
        .subscribe((response: Trader) => {
          this.isRequesting = false;
          this.trader = response;
          this.trader.password = "************";
          if (this.trader) {
            this.messagesService.emitProcessMessage("PMSUPas");
            this.isChangePasswordOn = false;
          }
        },
        (res: Response) => this.onError(res, "changeUserPassword"));
    }
  }


  private ComparePasswords(passedtrader: ChangePasswordBindingModel): boolean {
    if (passedtrader.NewPassword === passedtrader.ConfirmPassword) { return true; }
    else {
      this.messagesService.emitProcessMessage("PMEPNM");
      return false;
    }
  }


  //************************************************************
  // HELPER METHODS SECTION
  //************************************************************
  private getUserSession() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.traderId = this.session.userIdentity.userId;
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  private initialiseComponent() {
    this.messagesService.emitRoute("nill"); 
    this.pageTitleService.emitPageTitle(new PageTitle("My Security Details"));
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