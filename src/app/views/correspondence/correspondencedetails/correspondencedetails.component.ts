import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
import { CorrespondenceService } from '../../../services/correspondence/correspondence.service';

import { UserSession, UserIdentity, Authentication, Correspondence, PageTitle } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';

@Component({
  selector: 'app-correspondencedetails',
  templateUrl: './correspondencedetails.component.html',
  styleUrls: ['./correspondencedetails.component.scss']
})

export class CorrespondenceDetailsComponent implements OnInit {

  private recievedCorres: Correspondence = new Correspondence();
  private corresId: number;
  private hasCorres: boolean = false;  
  private session: UserSession = new UserSession();
  private identity: UserIdentity = new UserIdentity();
  private isAuthenticated: boolean = false;
  private isRequesting: boolean = false;
  private content: string = "";
  private sendCorresGroup: any;

  constructor(      
    private corresService: CorrespondenceService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private loggerService: LoggerService) {

  };

  /*******************************************************/
  // Component events
  /*******************************************************/
  ngOnInit() {

    this.sendCorresGroup = this.formBuilder.group({
      content: new FormControl('', [Validators.required]),  
    });

    this.route.queryParams.subscribe(params => { this.corresId = params['id']; });

    this.getUseridentity();   

    this.initialiseComponent();

    this.getACorrespondence(this.corresId );
  }


  // jquery code to have number of characters counted backward
  ngAfterViewInit() {

    jQuery(document).ready(function () {  

        // get the value from the hidden inut and pass it to the div in html format 
        // if this is not in a timout function the value is not picked up
        setTimeout((function () {
          var hid = jQuery('#hiddencontrol').val();        
          var html = jQuery.parseHTML(hid);
          var inp = jQuery('#receivedContent');
          inp.append(html);
        }), 100);

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



  /*******************************************************/
  // GET A TRADE
  /*******************************************************/
  private getACorrespondence(corresId: number) {

    this.corresService.getSingleCorres(corresId)
      .subscribe((corresResult: Correspondence) => {
        this.hasCorres = true;
        this.recievedCorres = corresResult;

      }, (serviceError: Response) => this.onError(serviceError, "getACorrespondence"));
  }


  private sendCorres() {
    let sendCorres = new Correspondence();
    let dt: Date = new Date();

    sendCorres.subject = this.recievedCorres.subject;
    sendCorres.content = "&nbsp" + this.sendCorresGroup.controls.content.value.replace(/\n\r?/g, '&nbsp; <br />  &nbsp');   // replace the normal escape characters with html ones
    sendCorres.dateSent = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds());
    sendCorres.message = "Reply to your message";
    sendCorres.status = "New";
    sendCorres.traderIdReciever = this.recievedCorres.traderIdSender;
    sendCorres.traderIdSender = this.recievedCorres.traderIdReciever;
    sendCorres.tradeId = this.recievedCorres.tradeId;

    this.corresService.addCorres(sendCorres)
      .subscribe(returnedCorres => this.onCorresSuccess(returnedCorres)
        , (error: Response) => this.onError(error, "sendCorres Method"));      
  }


  private onCorresSuccess(passedCorres: Correspondence) {
    if (passedCorres !== null) { this.messagesService.emitProcessMessage("PMSACo"); }
  }



  //*****************************************************
  // HELPER METHODS
  //*****************************************************
  private getUseridentity() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.isAuthenticated = this.session.authentication.isAuthenticated;   
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }

  // initialise component
  private initialiseComponent() {
    this.pageTitleService.emitPageTitle(new PageTitle("Correspondence Details"));
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
    else if (serviceError.error !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error); }
    else { this.messagesService.emitProcessMessage("PMEUEO"); } // unexpected error


  }

}