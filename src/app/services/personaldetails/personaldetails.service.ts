import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../config';
import { Observable} from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';

import { LoggerService } from '../logger/logger.service';
import { UserSession, UserIdentity, PersonalDetails} from '../../helpers/classes';

let personaldetailsbytraderid = CONFIG.baseUrls.personaldetailsbytraderid;

@Injectable()
export class PersonalDetailsService {

  private localUrl: string;
  private session: UserSession;

  constructor(
    private httpClientService: HttpClient,
    private loggerService: LoggerService) {

    if (sessionStorage["UserSession"] != "null") {
      this.session = JSON.parse(sessionStorage["UserSession"]);
    }
  };

  public getPersonalDetailsByTraderId(traderId: string): Observable<PersonalDetails>{

    this.localUrl = `${personaldetailsbytraderid}?traderId=${traderId}`; 

    return this.httpClientService.get<PersonalDetails>(this.localUrl).retry(3);
  }


}
