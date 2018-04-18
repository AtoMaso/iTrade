import { Component, ViewChild, ViewEncapsulation, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, Routes, RouterModule, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

//services
//import { AuthCheck } from './services/authcheck';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ProcessMessageService } from './services/processmessage/processmessage.service';
import { PageTitleService } from './services/pagetitle/pagetitle.service';

//components
import { ModalComponent } from './views/controls/modal/modal.component';
import { ProcessMessagesComponent } from './views/controls/processmessages/process-messages.component';
import { PageTitleComponent } from './views/controls/pagetitle/pagetitle.component';
import { UserSession, UserIdentity, Authentication, ProcessMessage, PageTitle } from './helpers/classes';


@Component({
  selector: 'app-root',
  moduleId:module.id,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], 
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnDestroy, OnInit {

  //******************************************************
  // PROPERTIES
  //******************************************************
  // set child components handles
 
  @ViewChild(ProcessMessagesComponent) messagesComponent: ProcessMessagesComponent;
  @ViewChild(PageTitleComponent) pageTitleComponent: PageTitleComponent;
  @ViewChild(ModalComponent) modalComponent: ModalComponent;

  // this is a reference to itself passed to the child ModalDialog
  public itself: AppComponent = this;

  public subscriptionSession: Subscription;
  public subscriptionMessages: Subscription;
  public subscriptionTitle: Subscription;
  public subscriptionRouter: Subscription;

  public authentication: Authentication  = new Authentication();
  public userSession: UserSession= new UserSession();
  public userIdentity: UserIdentity = new UserIdentity();
  public isUserAuthenticated: boolean = false;
  public isUserAllowed: boolean = false;
  public isAdmin: boolean = false;
  


  //******************************************************
  //CONSTRUCTOR AND CICLE METHODS
  //******************************************************
  constructor(private authenticationService: AuthenticationService,
                  private  messagesService: ProcessMessageService,
                  private titleService: PageTitleService,                  
                  private router: Router,
                  private idle: Idle) { sessionStorage['UserSession'] = "null"; }


  public ngOnInit() {

        this.subscriptionSession =
                this.authenticationService.behaviorSessionStore
                      .subscribe((session: UserSession) => {
                        // this needs to be check otherwise the app component fails on session not created yet
                        if (session !== null) {
                              this.userSession = session,
                              this.isUserAuthenticated = session.authentication.isAuthenticated;
                              this.isAdmin = session.userIdentity.isInRole("Admin", session.userIdentity.roles);
                              this.IsAllowed();                             
                              this.IdleSetup(session.userIdentity.accessTokenExpiresIn);
                        }
            });

        this.subscriptionTitle =
                this.titleService.behaviorTitleStore
                  .subscribe((page: PageTitle) => {
                    // this needs to be check otherwise the app component fails on pmComponent not created yet
                    if (page) {
                      this.pageTitleComponent.displayPageTitle(page)
                    }
          });

        this.subscriptionMessages =
                  this.messagesService.behaviorProcessMessageStore
                      .subscribe((message: ProcessMessage) => {
                        // this needs to be check otherwise the app component fails on pmComponent not created yet
                        if (message) {
                                this.messagesComponent.displayProcessMessage(message)
                        }
            });

       

        this.subscriptionRouter =
                  this.messagesService.behaviorRouteStore
                       .subscribe(() => {
                          if (this.messagesComponent) {
                                this.messagesComponent.displayProcessMessage(null);
                          }
            });
  }


  public ngOnDestroy() {
    this.subscriptionSession.unsubscribe();
    this.subscriptionMessages.unsubscribe();
    this.subscriptionTitle.unsubscribe();
    this.subscriptionRouter.unsubscribe();
  }

  private IsAllowed() {
    if (this.isUserAuthenticated ) { // && this._userSession.userIdentity.isInRole("Admin")) {
      this.isUserAllowed = true;
    }
  }

  private logOut() {
    this.isUserAuthenticated = false;
    this.authenticationService.logOut();
    let route = ['/dashboard']
    this.router.navigate(route);
  }


  //*******************************************************
  // PUBLIC METHODS
  //*******************************************************
  // called from the session modal dialog when session needs to be closed
  public onCloseSession() {
    this.idle.stop();
    this.logOut();
    this.isUserAuthenticated = false;
    this.isUserAllowed = false;
  }


  //*******************************************************
  // PRIVATE METHODS
  //*******************************************************
  public IdleSetup(sessiontimeout: number) {

      // sets an idle timeout , in this case this is returned from webapi as 2 minutes
      // and we are giving a minute the user to refresh the session token before is logged out.
      // the session will be session-2 minutes. One minute as set for the dialog box to be shown
      // and the next minute to refresh the token before the original token expires
      this.idle.setIdle(sessiontimeout - 2 * 60);
      // testing only
      //this.idle.setIdle(30);

      // sets the session timeout warning period, the user will be considered 
      // timed out when setIdle and setTimeout times are add together
      // we are giving the warning shown for 30 seconds????   
      this.idle.setTimeout(30);

      // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
      this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      // the client has decided to continue, so refresh the token
      this.idle.onIdleEnd.subscribe(() => {
        // call the referesh token method to get the refresh token from the webapi        
        this.authenticationService.refreshTokenClient();
        //console.log("refresh from IDLE has happened");
        this.modalComponent.modalIsVisible = false;
      });

      // we will show the modal form here telling the user that the session 
      // is about to finish. We will wait for response for period set in the 
      // setTimeout property and if we did not get any response the onTimeout
      // will take over and logout the user and kill the session
      this.idle.onTimeoutWarning.subscribe((countdown: number) => {
        this.modalComponent.showModalDialog("You session is about to expire in: " + countdown + " seconds. Are you still there?");
      });

      // when the timeout has been kill the modal and kill the session
      this.idle.onTimeout.subscribe(() => {
        this.modalComponent.closeModal();
        this.onCloseSession();   
      });

      // start watching for idleness right away.
      this.idle.watch();
    } 
}


