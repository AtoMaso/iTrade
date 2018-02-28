import { Inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { PageTitle } from '../../helpers/classes';

@Injectable()
export class PageTitleService {

    public behaviorTitleStore: BehaviorSubject<PageTitle> = new BehaviorSubject(null);
    public behaviorTitleObserver$: Observable<PageTitle> = this.behaviorTitleStore.asObservable(); 

    constructor() {};


    //******************************************************
    // GET PAGE TITLE
    //*****************************************************
    // raises the event which the app component is subcribed to
    public emitPageTitle(page: PageTitle) {  
            this.behaviorTitleStore.next(page);
    }
}
