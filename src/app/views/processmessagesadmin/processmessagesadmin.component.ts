import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import { ValidationService } from '../../services/validation/validation.service';
import { LoggerService } from '../../services/logger/logger.service';
import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';
// components
import { UserSession, PageTitle, ProcessMessage, ProcessMessageType} from '../../helpers/classes';
import { SpinnerOneComponent } from '../controls/spinner/spinnerone.component';

@Component({
  selector: 'app-processmessagesadmin',
  templateUrl: './processmessagesadmin.component.html',
  styleUrls: ['./processmessagesadmin.component.scss']
})
export class ProcessMessagesAdminComponent implements OnInit {

  public traderId: string;
  public isRequesting: boolean;
  public session: UserSession;

  public messagesForm: FormGroup;
  public messages: ProcessMessage[] = [];
  public messageInView: ProcessMessage;
  public tempAddUpdateMessage: ProcessMessage;
  public defaultMessage: ProcessMessage;
  public isMessageAddOn: boolean = false;
  public isMessageEditOn: boolean = false;
  public updatedMessage: ProcessMessage;
  public addedMessage: ProcessMessage;
  public removedMessage: ProcessMessage;
  public messageToRemove: ProcessMessage;
 


  public typesForm: FormGroup;
  public types: ProcessMessageType[] = [];
  public typeInView: ProcessMessageType;
  public tempAddUpdateType: ProcessMessageType;
  public defaultType: ProcessMessageType;
  public isTypeAddOn: boolean = false;
  public isTypeEditOn: boolean = false;
  public updatedType: ProcessMessageType;
  public addedType: ProcessMessageType;
  public removedType: ProcessMessageType;
  public typeToRemove: ProcessMessageType;



  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private processMessagesService: ProcessMessageService,    
    private pageTitleService: PageTitleService,   
    private loggerService: LoggerService) { }



  ngOnInit() {
    this.getUserSession();
    this.initialiseComponent();

    this.getMessages();

    this.setMessagesForm();
    this.setMessageTypesForm();
  }


  // toggling done with jquery
  public ngAfterViewInit() {

    jQuery(document).ready(function () {

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapseMessages").on("hide.bs.collapse", function () {
        jQuery(".messages").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Messages</span>  ');
      });
      jQuery("#collapseMessages").on("show.bs.collapse", function () {
        jQuery(".messages").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Messages</span>');
      });

      // toggling the chevrons up and down of the colapsable panel   
      jQuery("#collapseTypes").on("hide.bs.collapse", function () {
        jQuery(".types").html('<span class="glyphicon glyphicon-plus"></span> <span class="textlightcoral medium text-uppercase"> Message Types</span>  ');
      });
      jQuery("#collapseTypes").on("show.bs.collapse", function () {
        jQuery(".types").html('<span class="glyphicon glyphicon-minus"></span>  <span class="textlightcoral medium text-uppercase"> Message Types</span>');
      });



      setTimeout(function () {

        // this will set the first item from of the select phone type dropdown
        var counter: number = 0;
        if (jQuery('#message option')) {
          jQuery('#message option').each(function () {
            if (this.text != "" && counter == 1) { jQuery(this).attr("selected", "selected"); }
            counter = counter + 1;
          });
        }
        counter = 0
        // this will set the first item from of the select email type dropdown     
        if (jQuery('#type option')) {
          jQuery('#type option').each(function () {
            if (this.text != "" && counter == 1) { jQuery(this).attr("selected", "selected"); }
            counter = counter + 1;
          });
        }

      }, 100);

    });
  }

  //************************************************************
  // GET DATA METHODS
  //************************************************************
  public getMessages() {
    this.processMessagesService.getProcessMessagesFromRepository()
      .subscribe((res: ProcessMessage[]) => {
        this.onSuccessMessages(res);
      }
      , (error: Response) => this.onError(error, "getProcessMessages"));
  }

  public onSuccessMessages(messages: ProcessMessage[]) {
    this.messages = null;
    // collections return zero length when no record found as it is initialised
    if (messages.length == 0) {
      this.messages = null;
      this.messageInView = null;
    }
    else {
      this.messages = messages;
      if (this.updatedMessage) {
        this.messageInView = this.updatedMessage;
        this.updatedMessage = null;
      }
      else if (this.addedMessage) {
        this.messageInView = this.addedMessage;
        this.addedMessage = null;
      }
      else if (this.removedType) {
        this.messageInView = this.removedMessage;
        this.removedType = null;
      }
      else { this.messageInView = this.messages[0]; }

      // get the message types for this state
      this.getMessageTypes();
    }
  }



  public getMessageTypes() {
    this.processMessagesService.getMessageTypes()
      .subscribe((res: ProcessMessageType[]) => {
        this.onSuccessTypes(res);
      }
      , (error: Response) => this.onError(error, "getMessageTypes"));
  }

  public onSuccessTypes(passedtypes: ProcessMessageType[]) {

    this.types = null;
    // collections return zero length when no record found as it is initialised
    if (passedtypes.length == 0) {
      this.types = null;
      this.typeInView = null;
    }
    else {
      this.types = passedtypes;
      if (this.updatedType) {
        this.typeInView = this.updatedType;
        this.updatedType = null;
      }
      else if (this.addedType) {
        this.typeInView = this.addedType;
        this.addedType = null;
      }  
      else { this.typeInView = this.types[0]; }
    }
  }




  //************************************************************
  // SETUP FORM METHODS
  //************************************************************
  public setMessagesForm() {
    this.messagesForm = this.formBuilder.group({
      messagetype: new FormControl('', [Validators.required ]),
      messagecode: new FormControl('', [Validators.required, ValidationService.messageCodeValidator]),
      messagetext: new FormControl('', [Validators.required, ValidationService.messageTextValidator]),
    });
  }

  public setMessageTypesForm() {
    this.typesForm = this.formBuilder.group({
      typedescription: new FormControl('', [Validators.required, ValidationService.messageTypeDescriptionValidator]),
    });
  }



  public setMessagesFormDefaults() {

    let m: number = 0;
    for (m = 0; m < this.types.length; m++) {
      if (this.types[m].messageTypeId == this.messageInView.messageTypeId) {        
        this.defaultType = this.types[m];
        break;
      }
    }

    setTimeout(() => {
      this.messagesForm.setValue({
        messagetype: this.defaultType,  
        messagetext: this.messageInView.messageText,
        messagecode: this.messageInView.messageCode,
      });
    }, 30);
  }

  public setMessageTypesFormDefaults() {

    setTimeout(() => {
      this.typesForm.setValue({
        typedescription: this.typeInView.messageType,
      });
    }, 30);
  }




  //*****************************************************
  // SCREEN CHANGE STATES 
  //*****************************************************
  public onViewMessageChange(state: any) {
    let m: number = 0;
    for (m = 0; m < this.messages.length; m++) {

      if (this.messages[m].messageCode === state.target.value) {
            // reset types    
            this.isTypeAddOn = false;
            this.isTypeEditOn = false;       
            // set messages
            this.messageInView = this.messages[m];
            this.tempAddUpdateMessage = this.messages[m];
            this.setMessagesFormDefaults();
            break;       
      }
    }
  }


  public onMessageAddClick() {
    this.processMessagesService.emitRoute("nill");
    this.isMessageAddOn = true;
    this.isMessageEditOn = false;
    this.setMessagesForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.messageInView) {
      this.tempAddUpdateMessage = this.messageInView;
      this.messageInView = null;
    }
  }


  public onMessageEditClick() {
    this.processMessagesService.emitRoute("nill");
    this.isMessageEditOn = true;
    this.isMessageAddOn = false;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateMessage = this.messageInView;
    this.setMessagesForm();
    this.setMessagesFormDefaults();
  }


  public onMessageAddEditCancel() {
    this.processMessagesService.emitRoute("nill");
    if (this.isMessageAddOn == true) { this.isMessageAddOn = false; }
    if (this.isMessageEditOn == true) { this.isMessageEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateMessage) { this.messageInView = this.tempAddUpdateMessage; }
  }


  public onSubmitMessageAddUpdate() {

    this.removedMessage = null;
    this.processMessagesService.emitRoute("nill");
    let message: ProcessMessage = this.prepareAddUpdateMessage();

    if (this.isMessageAddOn && message) {

      // add new state
      this.processMessagesService.addProcessMessage(message)
        .subscribe((response: ProcessMessage) => {
          // reset the others
          this.updatedMessage = null;
          this.removedMessage = null;
          // get the new state so we can display it when we come from the server
          this.addedMessage = response;
          // show success
          this.processMessagesService.emitProcessMessage("PMSAPm");
          // get the new data from the server
          this.getMessages();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitMessageAdd"));

      // go back to view
      this.isMessageAddOn = !this.isMessageAddOn;

    }



    if (this.isMessageEditOn && message) {

      // update state
      this.processMessagesService.updateProcessMessage(message)
        .subscribe((response: ProcessMessage) => {
          // reset the others
          this.addedMessage = null;
          this.removedMessage = null;
          // get the saved state to pass it when we get the date from the server 
          this.updatedMessage = message;
          // show success
          this.processMessagesService.emitProcessMessage("PMSUPm");
          // get the new data from the server
          this.getMessages();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitMessageUpdate"));

      // go back to view
      this.isMessageEditOn = !this.isMessageEditOn;
    }

  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdateMessage(): ProcessMessage {

    const formModel = this.messagesForm.value;

    let newAddUpdateMessage: ProcessMessage = new ProcessMessage();

    if (this.isMessageEditOn) { newAddUpdateMessage.messageId = this.messageInView.messageId; }
    newAddUpdateMessage.messageCode = formModel.messagecode;
    newAddUpdateMessage.messageText = formModel.messagetext as string;
    newAddUpdateMessage.messageTypeId = formModel.messagetype.messageTypeId;    

    // has anything beeing changed in the form and we are updating
    if (this.isMessageEditOn && !this.isMessageChanged(newAddUpdateMessage, this.tempAddUpdateMessage)) {
      this.processMessagesService.emitProcessMessage("PMEUPm");
      return null;
    }
    if (this.messageExists(newAddUpdateMessage)) {
      this.processMessagesService.emitProcessMessage("PMEUPmE");
      return null;
    }

    return newAddUpdateMessage;
  }

  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  public isMessageChanged(newMessage: ProcessMessage, oldMessage: ProcessMessage): boolean {
    if (newMessage.messageCode === oldMessage.messageCode && 
        newMessage.messageText === oldMessage.messageText &&
        newMessage.messageTypeId=== oldMessage.messageTypeId
      ) { return false; }
    return true;
  }


  public messageExists(message: ProcessMessage): boolean {
    let m: number = 0;
    for (m = 0; m < this.messages.length; m++) {
      if (message.messageCode === this.messages[m].messageCode &&
          message.messageText === this.messages[m].messageText &&
          message.messageTypeId === this.messages[m].messageTypeId ) { return true; }
    }
    return false;
  }


  public onMessageDeleteClick() {
    this.messageToRemove = this.messageInView;
  }


  public onSubmitDeleteMessage(messageToRemove:ProcessMessage) {

    this.processMessagesService.deleteProcessMessage(messageToRemove.messageId)
      .subscribe((response: ProcessMessage) => {
        // reset the update and add
        this.addedMessage = null;
        this.updatedMessage = null;
        // show success
        this.processMessagesService.emitProcessMessage("PMSDPm");
        // get the new data from the server and start again
        this.getMessages();

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteMessage"));
  }





  //*****************************************************
  // SCREEN CHANGE TYPES 
  //*****************************************************
  public onViewTypeChange(type: any) {
    let m: number = 0;
    for (m = 0; m < this.types.length; m++) {
      if (this.types[m].messageType === type.target.value) {
        // reset postcodes and suburbs       
        this.isMessageAddOn = false;
        this.isMessageEditOn = false;
        //set places
        this.typeInView = this.types[m];
        this.tempAddUpdateType = this.types[m];
        this.setMessageTypesFormDefaults();
        break;     
      }
    }
  }


  public onTypeAddClick() {
    this.processMessagesService.emitRoute("nill");
    this.isTypeAddOn = true;
    this.isTypeEditOn = false;

    this.setMessageTypesForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.typeInView) {
      this.tempAddUpdateType = this.typeInView;
      this.typeInView = null;
    }
  }


  public onTypeEditClick() {
    this.processMessagesService.emitRoute("nill");
    this.isTypeEditOn = true;
    this.isTypeAddOn = false;

    // if place in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateType = this.typeInView;
    this.setMessageTypesForm();
    this.setMessageTypesFormDefaults();
  }


  public onTypeAddEditCancel() {
    this.processMessagesService.emitRoute("nill");
    if (this.isTypeAddOn == true) { this.isTypeAddOn = false; }
    if (this.isTypeEditOn == true) { this.isTypeEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateType) { this.typeInView = this.tempAddUpdateType; }
  }


  public onSubmitTypeAddUpdate() {

    this.processMessagesService.emitRoute("nill");
    let type: ProcessMessageType = this.prepareAddUpdateType();

    if (this.isTypeAddOn && type) {

      // add new type
      this.processMessagesService.addMessageType(type)
        .subscribe((response: ProcessMessageType) => {
          // reset the athers
          this.updatedType = null;
          this.removedType = null;
          // get the new added type so when we come back from the server we can display it in view
          this.addedType = response;
          // show success
          this.processMessagesService.emitProcessMessage("PMSAPmt");
          // get the new data from the server
          this.getMessageTypes();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitTypeAdd"));

      // go back to view
      this.isTypeAddOn = !this.isTypeAddOn;

    }


    if (this.isTypeEditOn && type) {

      // update place
      this.processMessagesService.updateMessageType(type)
        .subscribe((response: ProcessMessageType) => {
          // reset the athers
          this.addedType = null;
          this.removedType = null;
          // get the saved ty[e so when we can put it in view when we come back from the server
          this.updatedType = type;
          // show success
          this.processMessagesService.emitProcessMessage("PMSUPmt");
          // get the new data from the server
          this.getMessageTypes();

        }, (serviceError: Response) => this.onError(serviceError, "onSubmitTypeUpdate"));

      // go back to view
      this.isTypeEditOn = !this.isTypeEditOn;

    }
  }


  // prepare the new add or update data - get it from the form
  public prepareAddUpdateType(): ProcessMessageType {

    const formModel = this.typesForm.value;

    let newAddUpdateType: ProcessMessageType = new ProcessMessageType();

    if (this.isTypeEditOn) { newAddUpdateType.messageTypeId = this.typeInView.messageTypeId; }
    newAddUpdateType.messageType = formModel.typedescription as string;
   

    // has anything beeing changed in the form and we are updating
    if (this.isTypeEditOn && !this.isTypeChanged(newAddUpdateType, this.tempAddUpdateType)) {
      this.processMessagesService.emitProcessMessage("PMEUPmt");
      return null;
    }
    if (this.typeExists(newAddUpdateType)) {
      this.processMessagesService.emitProcessMessage("PMEUPmtE");
      return null;
    }

    return newAddUpdateType;
  }


  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  public isTypeChanged(newType: ProcessMessageType, oldType: ProcessMessageType): boolean {
    if (newType.messageType === oldType.messageType) { return false; }
    return true;
  }


  public typeExists(type: ProcessMessageType): boolean {
    let m: number = 0;
    for (m = 0; m < this.types.length; m++) {
      if (type.messageType === this.types[m].messageType) { return true; }
    }
    return false;
  }


  public onTypeDeleteClick() {
    this.typeToRemove = this.typeInView;
  }


  public onSubmitDeleteType(typeToRemove: ProcessMessageType) {

    this.processMessagesService.deleteMessageType(typeToRemove.messageTypeId)
      .subscribe((response: ProcessMessageType) => {
        // reset the update and add
        this.addedType = null;
        this.updatedType = null;
        // initiate the flag that type has been deleted
        this.removedType = response;       
        // show success
        this.processMessagesService.emitProcessMessage("PMSDPmt");
        // get the new data from the server
        this.getMessageTypes();

      }, (serviceError: Response) => this.onError(serviceError, "onSubmitDeleteType"));
  }





  //************************************************************
  // HELPER METHODS
  //************************************************************
  public getUserSession() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.traderId = this.session.userIdentity.userId;
      }
      catch (ex) {
        this.processMessagesService.emitProcessMessage("PMG");
      }
    }
  }


  public initialiseComponent() {
    this.processMessagesService.emitRoute("nill");
    this.pageTitleService.emitPageTitle(new PageTitle("Process Messages"));
  }




  //****************************************************
  // LOGGING METHODS
  //****************************************************
  public onError(serviceError: any, operation: string) {

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
      this.processMessagesService.emitProcessMessage("PME", message);
    }
    else if (serviceError.error.ModelState !== undefined) { this.processMessagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }
    else if (serviceError.error !== null) { this.processMessagesService.emitProcessMessage("PME", serviceError.error.Message); }
    else { this.processMessagesService.emitProcessMessage("PMEUEO"); } // unexpected error
  }

}



