import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule, JsonpModule } from '@angular/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { Ng2TableModule } from 'ng2-table';
import { FileUploadModule } from 'ng2-file-upload';
import { PaginationModule, TabsModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyDatePickerModule } from 'mydatepicker';

//helpers
import { AuthGuard } from './helpers/auth.guard';
import { TopTradesPipe, SortTradesByDatePipe } from './helpers/pipes';

//services
import { AuthenticationService } from './services/authentication/authentication.service';
import { ProcessMessageService } from './services/processmessage/processmessage.service';
import { PageTitleService } from './services/pagetitle/pagetitle.service';
import { LoggerService } from './services/logger/logger.service';
import { TradeApiService } from './services/tradeapi/tradeapi.service';
//import { MessageService } from './services/message/message.service';
import { ValidationService } from './services/validation/validation.service';
import { InMemoryDataService }  from './services/inmemory/in-memory-data.service'; //

//components
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
import { PageTitleComponent } from './views/controls/pagetitle/pagetitle.component';
import { ModalComponent } from './views/controls/modal/modal.component';
import { SpinnerOneComponent } from './views/controls/spinner/spinnerone.component';
import { CarouselComponent } from './views/controls/carousel/carousel.component';
import { ExpandapanelComponent } from './views/expandapanel/expandapanel.component';
import { AboutComponent } from './views/info/about.component';
import { ContactComponent } from './views/info/contact.component';

import { TradeListComponent } from './views/trade/tradelist/tradelist.component';
import { TradeInfoComponent } from './views/trade/tradeinfo/tradeinfo.component';

import { TraderListComponent } from './views/trader/traderlist/traderlist.component';
import { TraderInfoComponent } from './views/trader/traderinfo/traderinfo.component';
import { TraderAccountComponent } from './views/trader/traderaccount/traderaccount.component';

import { PersonaldetailsComponent } from './views/trader/personaldetails/personaldetails.component';
import { SecuritydetailsComponent } from './views/trader/securitydetails/securitydetails.component';
import { ContactdetailsComponent } from './views/trader/contactdetails/contactdetails.component';
//import { TraderaccountComponent } from './views/trader/traderaccount/traderaccount.component';
//import { NG2FileUploadComponent } from './views/file-upload/ng2-file-upload.component';

import { ControlMessages } from './views/controls/controlmessages/control-messages.component';
import { ProcessMessagesComponent } from './views/controls/processmessages/process-messages.component';
import { AddTradeComponent } from './views/trade/addtrade/addtrade.component';
import { AddtraderComponent } from './views/trader/addtrader/addtrader.component';

import { AddobjectcategoryComponent } from './views/objectcategory/addobjectcategory/addobjectcategory.component';
import { ObjectcategorylistComponent } from './views/objectcategory/objectcategorylist/objectcategorylist.component';
import { AddphonetypeComponent } from './views/phone/addphonetype/addphonetype.component';
import { PhonetypelistComponent } from './views/phone/phonetypelist/phonetypelist.component';
import { AddresstypelistComponent } from './views/address/addresstypelist/addresstypelist.component';
import { AddaddresstypeComponent } from './views/address/addaddresstype/addaddresstype.component';
import { AddsocialnetworktypeComponent } from './views/socialnetwork/addsocialnetworktype/addsocialnetworktype.component';
import { SocialnetworktypelistComponent } from './views/socialnetwork/socialnetworktypelist/socialnetworktypelist.component';
import { AddsecurityquestionComponent } from './views/securityquestion/addsecurityquestion/addsecurityquestion.component';
import { SecurityquestionlistComponent } from './views/securityquestion/securityquestionlist/securityquestionlist.component';
import { AddprocessmessageComponent } from './views/processmessage/addprocessmessage/addprocessmessage.component';
import { ProcessmessagelistComponent } from './views/processmessage/processmessagelist/processmessagelist.component';



//initialises the process message service to get all process messages on start of the application
export function getprocessmessages(processMessageService: ProcessMessageService) {
  return () => processMessageService.getProcessMessage();
}


@NgModule({

  declarations: [
    AppComponent,         
    DashboardComponent,        
    LoginComponent,     
    RegisterComponent,   
    ControlMessages,   
    ProcessMessagesComponent,
    PageTitleComponent,
    ModalComponent,
    SpinnerOneComponent,
    CarouselComponent,
    TopTradesPipe,
    SortTradesByDatePipe,
    ExpandapanelComponent,
    AboutComponent,
    ContactComponent,
    TradeListComponent,
    TradeInfoComponent,
    TraderListComponent,
    TraderInfoComponent,
    TraderAccountComponent,
    AddTradeComponent,
    AddtraderComponent,
    AddobjectcategoryComponent,
    AddphonetypeComponent,  
    PhonetypelistComponent,
    ObjectcategorylistComponent,
    AddresstypelistComponent,
    AddaddresstypeComponent,
    PersonaldetailsComponent,
    SecuritydetailsComponent,
    ContactdetailsComponent,
    AddsocialnetworktypeComponent,
    SocialnetworktypelistComponent,
    AddsecurityquestionComponent,
    SecurityquestionlistComponent,
    AddprocessmessageComponent,
    ProcessmessagelistComponent
    //TraderaccountComponent
    //NG2FileUploadComponent
  ],  

  imports: [    
    BrowserModule,
    AppRoutingModule,  
    HttpClientModule,    
    HttpModule,
    JsonpModule,
    MomentModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2TableModule,
    FileUploadModule,
    NgxPaginationModule,
    PaginationModule,       
    TabsModule,  
    MyDatePickerModule,
    NgIdleKeepaliveModule.forRoot()
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    //HttpClientInMemoryWebApiModule.forRoot(
    //     InMemoryDataService, { dataEncapsulation: false }
    //)
  ],

  providers: [
    TradeApiService, ValidationService,
    AuthenticationService, ProcessMessageService,
    PageTitleService, LoggerService, AuthGuard,
     // to initialise a service when application starts in this case to get all process messages when starts
    { provide: APP_INITIALIZER, useFactory: getprocessmessages, deps: [ProcessMessageService], multi: true } 
  ],  

  bootstrap: [AppComponent]
               
})

export class AppModule { }

