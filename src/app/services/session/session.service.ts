import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
//import {UserSession} from '../models/index';
//import {SessionApiService} from '../api/index';

@Injectable()
export class SessionService {
    //private _userSessionStore$: BehaviorSubject<UserSession> = new BehaviorSubject(null);

    //constructor(private _api: SessionApiService) {
    //}

    //get userSession$(): Observable<UserSession> {
    //    return this._userSessionStore$.filter(x => !!x);
    //}

    //loadUserSession() {
    //    this._api.fetchUserSession().subscribe(
    //        userSession => {
    //            console.log("fetched the user session");
    //            this._userSessionStore$.next(userSession);
    //        });
    //}
}

