import { Injectable, OnInit} from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable , SubscribableOrPromise} from 'rxjs/Observable';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import  'rxjs/add/operator/toPromise';

import { UserSession, UserIdentity, Authentication } from '../helpers/classes';

@Injectable()
export class AuthGuard implements CanActivate {

  public _subscriptionSession: UserSession;


  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  canActivate(

      next: ActivatedRouteSnapshot,

      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authenticationService.userSession.sessionCookie === "" ){

              this.router.navigate(['/dashboard']);
              return false;

           }
         return true;
    }
}