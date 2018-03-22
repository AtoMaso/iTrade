import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

import { CorrespondenceService } from '../../../services/correspondence/correspondence.service';
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';

import { UserSession, Authentication, Correspondence, Trade, PageTitle } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-addcorrespondence',
  templateUrl: './addcorrespondence.component.html',
  styleUrls: ['./addcorrespondence.component.scss']
})
export class AddCorrespondenceComponent implements OnInit {
  private actualTrade: Trade;
  private tradeId: number;
  private name: string; 
  private traderIdReciver: string;
  private traderId: string;
  private addCorresForm: any;
  private session: UserSession;
  private isRequesting: boolean = false;
  private newCorres: Correspondence;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private corresService: CorrespondenceService,     
    private tradeapiService: TradeApiService,
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
        message: new FormControl("", [Validators.required]),
        content: new FormControl('', [Validators.required]),
      });

  }

  //*****************************************************
  // TRADE DETAIL
  //*****************************************************
  private getTradeDetails(traderId) {
    this.tradeapiService.getSingleTrade(traderId)
      .subscribe(response => {
        this.onSuccessGetTrade(response);
      },
      (serviceError: Response) => this.onError(serviceError, "addCorrespondence"));
  }


  private onSuccessGetTrade(trade: Trade) {
    this.actualTrade = trade;
  }


  //*****************************************************
  // ADD CORRESPONDENCE METHOD
  //*****************************************************
  private addCorrespondence() {
    let corr = this.saveCorrespondence();

    if (corr) {
      this.corresService.addCorres(corr)
        .subscribe(response => {
          if (response) { this.messagesService.emitProcessMessage(""); }
        },
        (serviceError: Response) => this.onError(serviceError, "addCorrespondence"));
    }
  }


  private saveCorrespondence(): Correspondence {
    let newCorres = new Correspondence();

    newCorres.tradeId = this.tradeId;
    newCorres.sender = this.traderId;
    newCorres.receiver = this.traderIdReciver;
    newCorres.statusReceiver = "New";
    newCorres.statusSender = "New";   
    newCorres.dateSent = new Date();
    newCorres.subject = this.addCorresForm.controls.subject.value;
    newCorres.message = this.addCorresForm.controls.message.value;
    newCorres.content = this.addCorresForm.controls.content.value;

    return newCorres;
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
    this.pageTitleService.emitPageTitle(new PageTitle("Send Request"));
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
