import {Component} from '@angular/core';

import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';

import { PageTitle } from '../../helpers/classes';

@Component({
    selector: 'about-view',
    templateUrl: './about.component.html'
})
export class AboutComponent {
  private pagetitle: PageTitle;

  constructor(private messagesService: ProcessMessageService,
                   private titleService: PageTitleService) {

    this.pagetitle = new PageTitle();
    this.pagetitle.title = "Contact";
    this.titleService.emitPageTitle(this.pagetitle);

    this.messagesService.emitRoute("nill");
  }

}

