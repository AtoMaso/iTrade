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
import { UserSession, UserIdentity, ContactDetails} from '../../helpers/classes';

let contactdetailsbytraderid = CONFIG.baseUrls.contactdetailsbytraderid;


@Injectable()
export class ContactDetailsService {

  private localUrl: string;
  private session: UserSession;

  constructor(
    private httpClientService: HttpClient,
    private loggerService: LoggerService) {

    if (sessionStorage["UserSession"] != "null") {
      this.session = JSON.parse(sessionStorage["UserSession"]);
    }
  };

  public getContactDetailsByTraderId(traderId: string): Observable<ContactDetails> {

    this.localUrl = `${contactdetailsbytraderid}?traderId=${traderId}`; 

    return this.httpClientService.get<ContactDetails>(this.localUrl).retry(3);
  }


}
