import { Component, OnInit } from '@angular/core';
// services
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';

// components
import { CapsPipe } from '../../../helpers/pipes';
import { UserSession, UserIdentity, Authentication, Trade, PageTitle } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';


@Component({
  selector: 'app-traderlist',
  templateUrl: './traderlist.component.html',
  styleUrls: ['./traderlist.component.scss']
})
export class TraderListComponent implements OnInit {

  constructor(private messagesService: ProcessMessageService) { }

  ngOnInit() {
    //this.pageTitleService.emitPageTitle(new PageTitle("Your Trades"));
    this.messagesService.emitRoute("nill");
  }

}
