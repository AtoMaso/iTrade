import { Component, OnInit } from '@angular/core';

import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';

import { Trader, UserSession, UserIdentity, PageTitle } from '../../../helpers/classes';


@Component({
  selector: 'carouselone',
  templateUrl: './carouselone.component.html',
  styleUrls: ['./carouselone.component.scss']
})
export class CarouseloneComponent implements OnInit {
  private pagetitle; PageTitle; 

  constructor(private titleService: PageTitleService, private messageService: ProcessMessageService) { }

  ngOnInit() {

    this.pagetitle = new PageTitle();
    this.pagetitle.title = "Carousel";

    this.titleService.emitPageTitle(this.pagetitle);

    //this.messageService.emitRoute("nill");
  }

}
