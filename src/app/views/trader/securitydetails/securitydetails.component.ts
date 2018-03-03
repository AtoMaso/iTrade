import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';
// services
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import { CapsPipe } from '../../../helpers/pipes';
import { UserSession, UserIdentity, Authentication, Trade, PageTitle } from '../../../helpers/classes';
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
  private identity: UserIdentity = new UserIdentity;
  private isAuthenticated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pageTitleService: PageTitleService,
    private messagesService: ProcessMessageService,
    private loggerService: LoggerService) {
  };


  ngOnInit() {
    this.getUseridentity();
    this.initialiseComponent();
  }



  private getUseridentity() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.isAuthenticated = this.session.authentication.isAuthenticated;
        this.identity.roles = this.session.userIdentity.roles;
        this.traderId = this.session.userIdentity.userId;
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  private initialiseComponent() {
    this.messagesService.emitRoute("nill");
    this.isRequesting = true;
    this.pageTitleService.emitPageTitle(new PageTitle("My Security Details"));
  }

}

//private getContactDetails(traderId: string) {
  //  this.contactService.getContactDetailsByTraderId(traderId)
  //    .subscribe((contactResult: ContactDetails) => {       
  //      this.onSuccessContact(contactResult);
  //    }, (serviceError: Response) => this.onError(serviceError, "getContactDetails"));
  //}


  //private onSuccessContact(cd: ContactDetails) {
  //  this.contactDetails = cd;
  //  this.getSecurityDetails(this.traderId);
  //}


  //private getSecurityDetails(traderId: string) {
  //  this.securityService.getSecurityDetailsByTraderId(traderId)
  //    .subscribe((securityResult: SecurityDetails) => {
  //      this.securityDetails = securityResult;       
  //    }, (serviceError: Response) => this.onError(serviceError, "getSecurityDetails"));
  //}
