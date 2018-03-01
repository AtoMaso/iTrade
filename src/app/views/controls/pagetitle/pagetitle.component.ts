import { Component, Input, OnInit} from '@angular/core';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';

import { UserSession, UserIdentity, Authentication, ProcessMessage, PageTitle } from '../../../helpers/classes';

@Component({
  selector: 'page-title',
  templateUrl: './pagetitle.component.html'
})

export class PageTitleComponent implements OnInit {

  private pageTitle: string = "";
  private pageValue: string = "";
  private isAuthenticated: boolean = false;
  private userSession: UserSession = new UserSession();
  private userIdentity: UserIdentity = new UserIdentity();

  constructor( private messagesService:ProcessMessageService) {}

  public ngOnInit() {
  this.getUseridentity();
  }


  public displayPageTitle(page: PageTitle) {
      
    this.pageTitle = page.title;
    if (page.value !== "") { this.pageValue = page.value; }
    else { this.pageValue = ""; }
    this.getUseridentity();
  }


  private getUseridentity() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.userSession = JSON.parse(sessionStorage["UserSession"])     
        this.isAuthenticated = this.userSession.authentication.isAuthenticated;      
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }
}

