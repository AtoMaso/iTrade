import { Component, OnInit } from '@angular/core';

import {Hero } from '../../helpers/classes';
import { HeroService } from '../../services/hero.service';
import { MessageService } from '../../services/message.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';
import { PageTitle } from '../../helpers/classes';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})


export class HeroesComponent implements OnInit {
  
  heroes: Hero[];

  constructor(private heroService: HeroService,
                    private pagetitleService: PageTitleService,
                    private processMessageService: ProcessMessageService,
                    private messageService: MessageService) { }

  ngOnInit() {
          this.pagetitleService.emitPageTitle(new PageTitle("Heroes"));
          this.processMessageService.emitRoute("nill");
          this.getHeroes();
  }


  getHeroes(): void {
    this.heroService.getHeroes()
                .subscribe(response => this.heroes = response);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
          .subscribe(hero => {this.heroes.push(hero);
    });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}