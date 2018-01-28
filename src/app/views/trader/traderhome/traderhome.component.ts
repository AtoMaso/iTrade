import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

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
  selector: 'app-traderhome',
  templateUrl: './traderhome.component.html',
  styleUrls: ['./traderhome.component.scss']
})
export class TraderHomeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private loggerService: LoggerService) {}

  ngOnInit() {
    this.pageTitleService.emitPageTitle(new PageTitle("Trader Home"));
    this.messagesService.emitRoute("nill");

  }

}
