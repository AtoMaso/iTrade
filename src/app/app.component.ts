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
  private itself: AppComponent = this;

  private subscriptionSession: Subscription;
  private subscriptionMessages: Subscription;
  private subscriptionTitle: Subscription;
  private subscriptionRouter: Subscription;

  private authentication: Authentication;
  private userSession: UserSession;
  private userIdentity: UserIdentity;
  private isUserAuthenticated: boolean = false;
  private isUserAllowed: boolean = false;


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


  public ngAfterViewInit() {

    jQuery(document).ready(function () {

      // scrolling of the add block
      var element1 = jQuery('#add-follow-scroll-1'),
        originalY1 = element1.offset().top;

      var element2 = jQuery('#add-follow-scroll-2'),
        originalY2 = element2.offset().top;

      // Space between element and top of screen (when scrolling)
      var topMargin = 55;

      // Should probably be set in CSS;
      element1.css('position', 'relative');

      jQuery(window).on('scroll', function (event) {

        var scrollTop = jQuery(window).scrollTop();

        element1.stop(false, false).animate({
          top: scrollTop < originalY1 ? 0 : scrollTop - originalY1 + topMargin,
        }, 300);

        element2.stop(false, false).animate({
          top: scrollTop < originalY2 ? 0 : scrollTop - originalY2 + topMargin,
        }, 300);

      });

    }); // end of document function


  }


  private IsAllowed() {
    if (this.isUserAuthenticated ) { // && this._userSession.userIdentity.isInRole("Admin")) {
      this.isUserAllowed = true;
    }
  }

  private logOut() {
    this.authenticationService.logOut();
    let route = ['/dashboard']
    this.router.navigate(route);
  }




  //static getParameterByName(name: string, url: string) {
  //  name = name.replace(/[\[\]]/g, "\\$&");
  //  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
  //    results = regex.exec(url);
  //  if (!results) return null;
  //  if (!results[2]) return '';
  //  return decodeURIComponent(results[2].replace(/\+/g, " "));
  //}


  //*******************************************************
  // PUBLIC METHODS
  //*******************************************************
  // called from the session modal dialog when session needs to be closed
  public onCloseSession() {
    this.logOut();
    this.isUserAuthenticated = false;
    this.isUserAllowed = false;
  }


  //*******************************************************
  // PRIVATE METHODS
  //*******************************************************
  public IdleSetup(sessiontimeout: number) {

      // sets an idle timeout , in this case this is returned from webapi as 2 minutes
      // and we are giving a minute he user to refresh the session token before is logged out.
      // the session will be session-2 minutes. One minute as set for the dialog box to be shown
      // and the next minute to refresh the token before the original token expires
      this.idle.setIdle(sessiontimeout - 2 * 60);
      // testing only
      //this.idle.setIdle(30);

      // sets the session timeout warning period, the user will be considered 
      // timed out when we add setIdle and setTimeout times are add together
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
        this.modalComponent.closeSession();
        this.onCloseSession();   
      });

      // start watching for idleness right away.
      this.idle.watch();
    } 
}


