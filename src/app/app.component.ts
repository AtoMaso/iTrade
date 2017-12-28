import { Component, ViewChild, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


//services
//import { AuthCheck } from './services/authcheck';
import { AuthenticationService } from './services/authentication.service';
import { ProcessMessageService } from './services/processmessage.service';
import { PageTitleService } from './services/pagetitle.service';
import { DashboardComponent } from './views/dashboard/dashboard.component';


//components
import { NG2FileUploadComponent } from './views/file-upload/ng2-file-upload.component';
import { AboutComponent } from './views/info/about.component';
import { ContactComponent } from './views/info/contact.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
import { ModalDialogComponent } from './views/controls/modaldialog.component';
import { ProcessMessagesComponent } from './views/controls/process-messages.component';
import { PageTitleComponent } from './views/controls/pagetitle.component';
import { UserSession, UserIdentity, Authentication, ProcessMessage, PageTitle } from './helpers/classes';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  moduleId:module.id,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], 
  encapsulation: ViewEncapsulation.None, 
  //directives: [AuthCheck, RouterLink],
})

export class AppComponent implements OnDestroy, OnInit {

  //******************************************************
  // PROPERTIES
  //******************************************************
  // set child components handles
  @ViewChild(ModalDialogComponent) modalComponent: ModalDialogComponent;
  @ViewChild(ProcessMessagesComponent) messagesComponent: ProcessMessagesComponent;
  @ViewChild(PageTitleComponent) pageTitleComponent: PageTitleComponent;

  // this is a reference to itself passed to the child ModalDialog
  private itself: AppComponent = this;

  private _subscriptionSession: Subscription;
  private _subscriptionMessages: Subscription;
  private _subscriptionTitle: Subscription;
  private _subscriptionRouter: Subscription;

  private _authentication: Authentication = new Authentication();
  private _userSession: UserSession = new UserSession();
  private _userIdentity: UserIdentity = new UserIdentity();
  private _isUserAuthenticated: boolean = false;
  private _isUserAllowed: boolean = false;


  //******************************************************
  //CONSTRUCTOR AND CICLE METHODS
  //******************************************************
  constructor(private _authenticationService: AuthenticationService,
                  private _pmService: ProcessMessageService,
                  private _titleService: PageTitleService,                  
                  private _router: Router,
                  private idle: Idle) { sessionStorage['UserSession'] = "null"; }



  public ngOnInit() {

        this._subscriptionSession =
          this._authenticationService._behaviorSessionStore
                .subscribe((session: UserSession) => {
                  // this needs to be check otherwise the app component fails on session not created yet
                  if (session !== null) {
                    this._userSession = session,
                    this._isUserAuthenticated = session.authentication.isAuthenticated;
                    this.IsAllowed();
                    this.IdleSetup(session.userIdentity.accessTokenExpiresIn);
                  }
            });

        this._subscriptionMessages =
          this._pmService._behaviorProcessMessageStore
                .subscribe((message: ProcessMessage) => {
                  // this needs to be check otherwise the app component fails on pmComponent not created yet
                  if (message) {
                    this.messagesComponent.displayProcessMessage(message)
                  }
            });

        this._subscriptionTitle =
            this._titleService._behaviorTitleStore
              .subscribe((page: PageTitle) => {
                // this needs to be check otherwise the app component fails on pmComponent not created yet
                if (page) {
                  this.pageTitleComponent.displayPageTitle(page)
                }
            });

        this._subscriptionRouter =
          this._pmService._behaviorRouteStore
            .subscribe(() => {
              if (this.messagesComponent) {
               this.messagesComponent.displayProcessMessage(null);
              }
            });
  }

  public ngOnDestroy() {
    this._subscriptionSession.unsubscribe();
    this._subscriptionMessages.unsubscribe();
    this._subscriptionTitle.unsubscribe();
    this._subscriptionRouter.unsubscribe();
  }


  private IsAllowed() {
    if (this._isUserAuthenticated && this._userSession.userIdentity.isInRole("Admin")) {
      this._isUserAllowed = true;
    }
  }

  private logOut() {
    this._authenticationService.logOut();
    let route = ['Dashboard']
    this._router.navigate(route);
  }

  static getParameterByName(name: string, url: string) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }


  //*******************************************************
  // PUBLIC METHODS
  //*******************************************************
  // called from the session modal dialog when session needs to be closed
  public onCloseSession() {
    this.logOut();
  this._isUserAuthenticated = false;
    this._isUserAllowed = false;
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
        this._authenticationService.refreshToken();
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
      });

      // start watching for idleness right away.
      this.idle.watch();
    } 
}


