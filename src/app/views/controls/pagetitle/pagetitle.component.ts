import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { UserSession, ProcessMessage, PageTitle } from '../../../helpers/classes';

@Component({
  selector: 'page-title',
  templateUrl: './pagetitle.component.html'
})

export class PageTitleComponent implements OnInit {

  private pageTitle: string = "";
  private pageValue: string = "";
  private isAuthenticated: boolean = false;
  private userSession: UserSession;
  private subscriptionSession: Subscription;

  constructor(private messagesService: ProcessMessageService, private authenticationService: AuthenticationService) { }

  public ngOnInit() {

    this.subscriptionSession =
      this.authenticationService.behaviorSessionStore
      .subscribe((session: UserSession) => {
        // this needs to be check otherwise the app component fails on session not created yet
        if (session !== null) {
          this.userSession = session,
            this.isAuthenticated = session.authentication.isAuthenticated;
        }
        else { this.isAuthenticated = false; }
      });
  }


  public ngOnDestroy() {
    this.subscriptionSession.unsubscribe();    
  }


  public displayPageTitle(page: PageTitle) {

    this.pageTitle = page.title;
    if (page.value !== "") { this.pageValue = page.value; }
    else { this.pageValue = ""; }
  }

}
