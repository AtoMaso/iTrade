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
import { PaginationModule, TabsModule, DateFormatter} from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyDatePickerModule } from 'mydatepicker';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
//import { TokenInterceptor } from './services/authentication/tokeninterceptor/tokeninterceptor.component';

//helpers
import { AuthGuard } from './helpers/auth.guard';
import { TopTradesPipe, SortTradesByDatePipe } from './helpers/pipes';

//services
import { AuthenticationService } from './services/authentication/authentication.service';
import { ProcessMessageService } from './services/processmessage/processmessage.service';
import { PageTitleService } from './services/pagetitle/pagetitle.service';
import { LoggerService } from './services/logger/logger.service';
import { TradeApiService } from './services/tradeapi/tradeapi.service';
import { ValidationService } from './services/validation/validation.service';
import { InMemoryDataService }  from './services/inmemory/in-memory-data.service'; //
import { ImageService } from './services/image/image.service';
import { TradeHistoryService } from './services/tradehistory/trade-history.service';
import { CorrespondenceService } from './services/correspondence/correspondence.service';


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

import { AddTradeComponent } from './views/trade/addtrade/addtrade.component';
import { AllTradesListComponent } from './views/trade/alltradeslist/alltradeslist.component';
import { MyTradesListComponent } from './views/trade/mytradeslist/mytradeslist.component';
import { TradeDetailsComponent } from './views/trade/tradedetails/tradedetails.component';

import { AllTradersListComponent } from './views/trader/alltraderslist/alltraderslist.component';
import { TraderDetailsComponent } from './views/trader/traderdetails/traderdetails.component';
import { TraderHomeComponent } from './views/trader/traderhome/traderhome.component';
import { MyTraderAccountComponent } from './views/trader/mytraderaccount/mytraderaccount.component';

import { PersonalDetailsComponent } from './views/trader/personaldetails/personaldetails.component';
import { SecurityDetailsComponent } from './views/trader/securitydetails/securitydetails.component';
import { ContactlDetailsComponent } from './views/trader/contactdetails/contactdetails.component';

//import { TraderaccountComponent } from './views/trader/traderaccount/traderaccount.component';
//import { NG2FileUploadComponent } from './views/file-upload/ng2-file-upload.component';

import { ControlMessages } from './views/controls/controlmessages/control-messages.component';
import { ProcessMessagesComponent } from './views/controls/processmessages/process-messages.component';

import { AddObjectCategoryComponent } from './views/objectcategory/addobjectcategory/addobjectcategory.component';
import { ObjectCategoryListComponent } from './views/objectcategory/objectcategorylist/objectcategorylist.component';

import { AddPhoneTypeComponent } from './views/phone/addphonetype/addphonetype.component';
import { PhoneTypeListComponent } from './views/phone/phonetypelist/phonetypelist.component';

import { AddressTypeListComponent } from './views/address/addresstypelist/addresstypelist.component';
import { AddAddressTypeComponent } from './views/address/addaddresstype/addaddresstype.component';
import { AddSocialNetworkTypeComponent } from './views/socialnetwork/addsocialnetworktype/addsocialnetworktype.component';

import { SocialNetworkTypeListComponent } from './views/socialnetwork/socialnetworktypelist/socialnetworktypelist.component';
import { AddSecurityQuestionComponent } from './views/securityquestion/addsecurityquestion/addsecurityquestion.component';

import { SecurityQuestionListComponent } from './views/securityquestion/securityquestionlist/securityquestionlist.component';

import { AddProcessMessageComponent } from './views/processmessage/addprocessmessage/addprocessmessage.component';
import { ProcessMessageListComponent } from './views/processmessage/processmessagelist/processmessagelist.component';
import { CorrespondenceComponent } from './views/correspondence/correspondence.component';


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
 
    AllTradersListComponent,
    TraderDetailsComponent,
    TraderHomeComponent,
    MyTraderAccountComponent,

    AddTradeComponent,
    AllTradesListComponent,
    MyTradesListComponent,
    TradeDetailsComponent,   
    AddObjectCategoryComponent,
    AddPhoneTypeComponent,  
    PhoneTypeListComponent,
    ObjectCategoryListComponent,
    AddressTypeListComponent,
    AddAddressTypeComponent,
    PersonalDetailsComponent,
    SecurityDetailsComponent,
    ContactlDetailsComponent,
    AddSocialNetworkTypeComponent,
    SocialNetworkTypeListComponent,
    AddSecurityQuestionComponent,
    SecurityQuestionListComponent,
    AddProcessMessageComponent,
    ProcessMessageListComponent,
    CorrespondenceComponent,
  
    //TokenInterceptor,
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
    TabsModule,  
    NgxPaginationModule,
    PaginationModule,          
    MyDatePickerModule,
    NgIdleKeepaliveModule.forRoot()
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests and returns simulated server responses.
    // Remove it when a real web api rest services are ready to receive requests.
    //HttpClientInMemoryWebApiModule.forRoot(
    //     InMemoryDataService, { dataEncapsulation: false }
    //)
  ],

  providers: [
    TradeApiService, ValidationService, ImageService, TradeHistoryService,
    AuthenticationService, ProcessMessageService, CorrespondenceService,
    PageTitleService, LoggerService, AuthGuard,
    // to inercept every request for authentication purposes
    //{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

    // to initialise a service when application starts in this case to get all process messages when starts
    { provide: APP_INITIALIZER, useFactory: getprocessmessages, deps: [ProcessMessageService], multi: true } 
  ],  

  bootstrap: [AppComponent]
               
})

export class AppModule { }

