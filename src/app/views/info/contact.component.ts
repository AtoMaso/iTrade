import {Component} from '@angular/core';

import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';

import { PageTitle } from '../../helpers/classes';

@Component({
    selector: 'contact-view',
    templateUrl: './contact.component.html'
})


export class ContactComponent {

  private pagetitle: PageTitle;

  constructor(private messagesService: ProcessMessageService,
                   private titleService: PageTitleService) {

    this.pagetitle = new PageTitle();
    this.pagetitle.title = "Contact";
    this.titleService.emitPageTitle(this.pagetitle);

    this.messagesService.emitRoute("nill");

  }

}

