import { Component } from '@angular/core';

import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';

import { PageTitle } from '../../helpers/classes';

@Component({
    selector: 'welcome-app',
    templateUrl: './welcome.component.html',
})


export class WelcomeComponent {

       private pagetitle: PageTitle;

       constructor(private messagesService: ProcessMessageService,
                       private titleService: PageTitleService) {
      
        this.pagetitle = new PageTitle();
        this.pagetitle.title = "Register";
         this.titleService.emitPageTitle(this.pagetitle);

        messagesService.emitRoute("nill");
      }
}

