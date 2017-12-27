import { Component, OnInit } from '@angular/core';
import { Hero } from '../../helpers/hero';
import { HeroService } from '../../services/hero.service';


import { SpinnerOneComponent } from '../../blocks/spinner/spinnerone.component';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})

export class DashboardComponent implements OnInit {

  heroes: Hero[] = [];
  private itself: DashboardComponent = this;

  constructor(private heroService: HeroService,
                   private _pageTitleService: PageTitleService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
           .subscribe(res => this.heroes = res.slice(1, 5));
  }

}