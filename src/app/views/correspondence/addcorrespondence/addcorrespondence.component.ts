import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

import { CorrespondenceService } from '../../../services/correspondence/correspondence.service';
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { PersonalDetailsService } from '../../../services/personaldetails/personaldetails.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';

import { UserSession, Authentication, Correspondence, Trade, PersonalDetails, PageTitle } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-addcorrespondence',
  templateUrl: './addcorrespondence.component.html',
  styleUrls: ['./addcorrespondence.component.scss']
})
export class AddCorrespondenceComponent implements OnInit {
  private actualTrade: Trade; 
  private tradeId: number;
  private traderName: string; 
  private traderIdReceiver: string;

  private loggedOnTraderPersonal: PersonalDetails;
  private traderId: string;
  private addCorresForm: any;
  private session: UserSession;
  private isRequesting: boolean = false; 
  private isSubmited: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private corresService: CorrespondenceService,     
    private tradeapiService: TradeApiService,
    private personalService: PersonalDetailsService,    
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) {

  };

  ngOnInit() { 
    // initialise the view
    this.getUserSession();
    this.initialiseComponent();

     // get the query string
    this.route.queryParams.subscribe(params => {
      this.tradeId = params['id'];
      this.getTradeDetails(this.tradeId);    
    });

     // prepare the form
      this.addCorresForm = this.formBuilder.group({
        message: new FormControl("", [Validators.required, ValidationService.messageValidator]),
        content: new FormControl('', [Validators.required, ValidationService.contentValidator]),
      });
  }


  // jquery code to have number of characters counted backward
  ngAfterViewInit() {

    jQuery(document).ready(function () {

     
      // set the text of the counter 
      var input = jQuery('#content'), display = jQuery('#characterCount'), count = 0, limit = 500;
      // initalise the counter
      count = input.val().length;
      var remaining = limit - count;
      update(remaining);

      // on input key up event update the counter
      input.keyup(function (e) {

            count = jQuery(this).val().length;
            remaining = limit - count;

            update(remaining);

            // change the button to enabled when chararcter is entered or disbaled it when no char in it
            if (jQuery(this).val() != '') { jQuery('#Send').removeAttr('disabled'); }
            else { jQuery('#Send').attr('disabled', 'disabled'); }

          });


      // update the character counter
      function update(count) {
        var txt = (Math.abs(count) === 1) ? count + ' Character Remaining' : count + ' Characters Remaining'
        display.html(txt);
      }

    });
  }

  

  //*****************************************************
  // TRADE DETAIL
  //*****************************************************
  private getTradeDetails(tradeId: number) {
    this.isRequesting = true;
    this.tradeapiService.getSingleTrade(tradeId)
      .subscribe((response: Trade) => {
        this.onSuccessGetTrade(response);
      },
      (serviceError: Response) => this.onError(serviceError, "getTradeDetails"));
  }


  private onSuccessGetTrade(trade: Trade) {
    this.actualTrade = trade;

    // get the personal details
    this.getPersonalDetails(this.traderId);
  }


  //*****************************************************
  // PERSONAL DETAIL
  //*****************************************************
  private getPersonalDetails(traderId: string) {
    this.personalService.getPersonalDetailsByTraderId(traderId)
      .subscribe((response: PersonalDetails) => {
        this.onSuccessGetPersonal(response);
      },
      (serviceError: Response) => this.onError(serviceError, "getPersonalDetails"));
  }


  private onSuccessGetPersonal(personal: PersonalDetails) {
    this.isRequesting = false;
    this.loggedOnTraderPersonal = personal;
  }


  //*****************************************************
  // ADD CORRESPONDENCE METHOD
  //*****************************************************
  private sendRequest() {
    let corr = this.saveCorresRequest();

    if (corr) {  

      if (this.addCorresForm.dirty && this.addCorresForm.valid) {

        this.isRequesting = true;
        this.corresService.addCorres(corr)
          .subscribe(response => {
            if (response) {
              this.isRequesting = false;
              this.isSubmited = true;
              this.messagesService.emitProcessMessage("PMSSCo");
            }
          },
          (serviceError: Response) => this.onError(serviceError, "addCorrespondence"));
      }
    }
  }


  private saveCorresRequest(): Correspondence {
    let request = new Correspondence();
        
    request.traderIdReceiver = this.actualTrade.traderId; 
    request.statusSender = "Sent";     

    request.tradeId = this.actualTrade.tradeId;
    request.traderIdSender = this.traderId
    request.subject = this.actualTrade.name;
    request.statusReceiver = "New";    
    request.dateSent = new Date(); 
    request.message = this.addCorresForm.controls.message.value;
    request.content = this.addCorresForm.controls.content.value;

    return request;
  }



  //*****************************************************
  // HELPER METHODS
  //*****************************************************
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

  // initialise component
  private initialiseComponent() {
    this.pageTitleService.emitPageTitle(new PageTitle("Send a Request"));
    this.messagesService.emitRoute("nill");
  }



  //****************************************************
  // LOGGING METHODS
  //****************************************************
  private onError(serviceError: any, operation: string) {

    this.isRequesting = false;

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

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
