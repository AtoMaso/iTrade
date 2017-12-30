import { Component, OnInit } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { SpinnerOneComponent } from '../../blocks/spinner/spinnerone.component';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { TopArticlesPipe, SortDatePipe } from '../../helpers/pipes';
import { Hero, PageTitle } from '../../helpers/classes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})

export class DashboardComponent implements OnInit {

  heroes: Hero[] = [];
  private isRequesting: boolean;
  private itself: DashboardComponent = this;

  constructor(private heroService: HeroService,
                    private _pageTitleService: PageTitleService,
                    private _pmService: ProcessMessageService,
                    private _loggerService: LoggerService) { }

  ngOnInit() {
    this._pmService.emitRoute("nill");
    this._pageTitleService.emitPageTitle(new PageTitle("Trading latest"));
    this.isRequesting = true;    
    this.getHeroes();
  }

 

  //*****************************************************
  // GET Heroes
  //*****************************************************
  getHeroes(): void {
          this.heroService.getHeroes()
                .subscribe(
                (res: Hero[]) => {
                  this.heroes = res.slice(1, 5),
                    this.isRequesting = false
                }
                , (res: Response) => this.onError(res));
  }


  //******************************************************
  // PRIVATE METHODS
  //******************************************************
  // an error has occured
  private onError(res: any) {

    // stop the spinner
    this.isRequesting = false;

    // we will log the error in the server side by calling the logger, or that is already 
    // done on the server side if the error has been caught
    this._loggerService.logErrors(res, "dashboard page");

    // we will display a fiendly process message using the process message service             
    this._pmService.emitProcessMessage("PMGA");


  } 
}