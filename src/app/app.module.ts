import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule, JsonpModule } from '@angular/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { Ng2TableModule} from 'ng2-table';
import { FileUploadModule } from 'ng2-file-upload';
import { PaginationModule, TabsModule, DateFormatter} from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyDatePickerModule } from 'mydatepicker';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

//helpers
import { AuthGuard } from './helpers/auth.guard';

//services
import { AuthenticationService } from './services/authentication/authentication.service';
import { ProcessMessageService } from './services/processmessage/processmessage.service';
import { PageTitleService } from './services/pagetitle/pagetitle.service';
import { LoggerService } from './services/logger/logger.service';
import { TradeApiService } from './services/tradeapi/tradeapi.service';
import { TraderApiService } from './services/traderapi/traderapi.service';
import { ValidationService } from './services/validation/validation.service';
import { InMemoryDataService }  from './services/inmemory/in-memory-data.service'; //
import { ImageService } from './services/image/image.service';
import { TradeHistoryService } from './services/tradehistory/trade-history.service';
import { CorrespondenceService } from './services/correspondence/correspondence.service';
import { PersonalDetailsService } from './services/personaldetails/personaldetails.service';
import { CategoryService } from './services/categories/category.service';
import { SubcategoriesService } from './services/subcategories/subcategories.service';
import { GeoDataService } from './services/geodata/geodata.service';
import { AddressService } from './services/address/address.service';
import { EmailsService } from './services/emails/emails.service';
import { PhonesService } from './services/phones/phones.service';
import { SocialNetworksService } from './services/socialnetworks/social-networks.service';


//components
import { AppComponent } from './app.component';

import { PageTitleComponent } from './views/controls/pagetitle/pagetitle.component';
import { ModalComponent } from './views/controls/modal/modal.component';
import { SpinnerOneComponent } from './views/controls/spinner/spinnerone.component';
import { CarouselComponent } from './views/controls/carousel/carousel.component';

import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
import { AboutComponent } from './views/info/about.component';
import { ContactComponent } from './views/info/contact.component';

import { AddTradeComponent } from './views/trade/addtrade/addtrade.component';
import { TradesListComponent } from './views/trade/tradeslist/tradeslist.component';
import { MyTradesListComponent } from './views/trade/mytradeslist/mytradeslist.component';
import { TradeDetailsComponent } from './views/trade/tradedetails/tradedetails.component';

import { TradersListComponent } from './views/trader/traderslist/traderslist.component';
import { TraderDetailsComponent } from './views/trader/traderdetails/traderdetails.component';
import { TraderHomeComponent } from './views/trader/traderhome/traderhome.component';
import { ForgotPasswordComponent } from './views/trader/forgotpassword/forgotpassword.component';
import { PersonalDetailsComponent } from './views/trader/personaldetails/personaldetails.component';
import { LoginDetailsComponent } from './views/trader/logindetails/logindetails.component';
import { ContactlDetailsComponent } from './views/trader/contactdetails/contactdetails.component';

import { ControlMessages } from './views/controls/controlmessages/control-messages.component';
import { ProcessMessagesComponent } from './views/controls/processmessages/process-messages.component';
import { CategoriesComponent } from './views/categories/categories.component';
import { PlacesComponent } from './views/places/places.component';
import { ProcessMessagesAdminComponent } from './views/processmessagesadmin/processmessagesadmin.component';

import { CorrespondenceListComponent } from './views/correspondence/correspondencelist/correspondencelist.component';
import { CorrespondenceDetailsComponent } from './views/correspondence/correspondencedetails/correspondencedetails.component';
import { AddCorrespondenceComponent } from './views/correspondence/addcorrespondence/addcorrespondence.component';
import { ResetPasswordComponent } from './views/trader/resetpassword/resetpassword.component';
import { TypesComponent } from './views/types/types.component';


//initialises the process message service to get all process messages on start of the application
export function getprocessmessages(processMessageService: ProcessMessageService) {
  return () => processMessageService.getProcessMessage();
}


@NgModule({

  declarations: [
    AppComponent,         

    ControlMessages,ProcessMessagesComponent, 
    PageTitleComponent, ModalComponent, SpinnerOneComponent, CarouselComponent, 
    DashboardComponent, AboutComponent, ContactComponent, LoginComponent, RegisterComponent,    
    TradersListComponent, TraderDetailsComponent, TraderHomeComponent,
    AddTradeComponent, TradesListComponent, MyTradesListComponent, TradeDetailsComponent,   
    CategoriesComponent, ProcessMessagesAdminComponent,      
    PersonalDetailsComponent, LoginDetailsComponent, ContactlDetailsComponent, ProcessMessagesComponent,
    CorrespondenceListComponent, CorrespondenceDetailsComponent, AddCorrespondenceComponent,  
    ForgotPasswordComponent, ResetPasswordComponent, PlacesComponent, TypesComponent,
 
  ],  

  imports: [    
    BrowserAnimationsModule, BrowserModule,
    MatButtonModule, MatCheckboxModule,
    AppRoutingModule, HttpClientModule, HttpModule,
    JsonpModule, 
    FormsModule, ReactiveFormsModule,
    Ng2TableModule, FileUploadModule,  TabsModule,  
    NgxPaginationModule,PaginationModule,          
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
    PersonalDetailsService, SubcategoriesService, SocialNetworksService, EmailsService, PhonesService,
    PageTitleService, LoggerService, AuthGuard, TraderApiService, CategoryService, AddressService, GeoDataService,
    // to inercept every request for authentication purposes
    //{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

    // to initialise a service when application starts in this case to get all process messages when starts
    { provide: APP_INITIALIZER, useFactory: getprocessmessages, deps: [ProcessMessageService], multi: true } 
  ],  

  bootstrap: [AppComponent]
               
})

export class AppModule { }

