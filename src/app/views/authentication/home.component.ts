import { Component } from '@angular/core';

import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { PageTitle } from '../../helpers/classes';

@Component({
    selector: 'userhome-app',
    templateUrl: './app/views/authentication/home.component.html',
})


export class HomeComponent {

       private pagetitle: PageTitle;

       constructor(private messagesService: ProcessMessageService,
                       private titleService: PageTitleService) {
      
        this.pagetitle = new PageTitle();
        this.pagetitle.title = "Register";
         this.titleService.emitPageTitle(this.pagetitle);

        messagesService.emitRoute("nill");
      }
}

