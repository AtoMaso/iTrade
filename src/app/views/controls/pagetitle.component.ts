import { Component, Input} from '@angular/core';
import { PageTitle } from '../../helpers/classes';

@Component({
  selector: 'page-title',
  template: ` <div class="navbar-default">

                      <h4 style="margin-left:10px; color:grey;"><i>{{ pageTitle }} {{ pageValue }} </i></h4>
                    </div>`
})

export class PageTitleComponent {

      private pageTitle: string = "";
      private pageValue: string = "";

      constructor() {}


      public displayPageTitle(page:PageTitle) {
        this.pageTitle = page.title;
        if (page.value !== "") { this.pageValue = page.value; }
        else { this.pageValue = ""; }
      }

}

