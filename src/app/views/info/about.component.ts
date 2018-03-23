import {Component} from '@angular/core';

import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';
import { PageTitle } from '../../helpers/classes';

@Component({
  selector: 'about-view',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})

export class AboutComponent {

  constructor(private messagesService: ProcessMessageService,
                   private titleService: PageTitleService) {

       
          this.titleService.emitPageTitle(new PageTitle("About The App"));

          this.messagesService.emitRoute("null");
    }

}

