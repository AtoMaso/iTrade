import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators  } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import { TraderApiService } from '../../../services/traderapi/traderapi.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import { CapsPipe } from '../../../helpers/pipes';
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

  private trader: Trader = new Trader();
  private updatedTrader: Trader;
  private traderToRemove: Trader;

  private changePasswordInfo: ChangePasswordBindingModel;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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


  private onChangePasswordClick() {
    this.isChangePasswordOn = true;
  }

  private onChangePasswordCancel() {
    this.isChangePasswordOn = false;
  }

  private onChangePasswordSubmit() {

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

}