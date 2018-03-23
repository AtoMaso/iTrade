import {Component} from '@angular/core';

import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';

import { PageTitle } from '../../helpers/classes';

@Component({
  selector: 'contact-view',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
    


export class ContactComponent {


  constructor(private messagesService: ProcessMessageService,
                   private titleService: PageTitleService) {

    
    this.titleService.emitPageTitle(new PageTitle("Contact Us"));

    this.messagesService.emitRoute("nill");

  }

}

