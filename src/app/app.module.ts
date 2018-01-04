import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule, JsonpModule } from '@angular/http';
//import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core 
                                                                                         //NgIdleModule but includes keepalive providers for easy wireup

//services
import { AuthenticationService } from './services/authentication.service';
import { ProcessMessageService } from './services/processmessage.service';
import { PageTitleService } from './services/pagetitle.service';
import { LoggerService } from './services/logger.service';
import { TradeApiService } from './services/tradeapi.service';
import { MessageService } from './services/message.service';
import { ValidationService } from './services/validation.service';
import { InMemoryDataService } from './services//in-memory-data.service';
//import { AuthCheck } from './services/authcheck';

//components
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
import { ControlMessages } from './views/controls/controlmessages/control-messages.component';
import { ProcessMessagesComponent } from './views/controls/processmessages/process-messages.component';
import { PageTitleComponent } from './views/controls/pagetitle/pagetitle.component';
import { ModalComponent } from './views/controls/modal/modal.component';
import { SpinnerOneComponent } from './views/controls/spinner/spinnerone.component';
import { CSSCarouselComponent } from './views/controls/carousel/carousel.component';
import { TopTradesPipe, SortTradesByDatePipe } from './helpers/pipes';
import { ExpandapanelComponent } from './views/expandapanel/expandapanel.component';

//initialises the process message service to get all process messages 
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
    CSSCarouselComponent,
    TopTradesPipe,
    SortTradesByDatePipe,
    ExpandapanelComponent
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
    NgIdleKeepaliveModule.forRoot(),
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    //HttpClientInMemoryWebApiModule.forRoot(
    //     InMemoryDataService, { dataEncapsulation: false }
    //)
  ],

  providers: [TradeApiService, MessageService, ValidationService,
                  AuthenticationService, ProcessMessageService,
                  PageTitleService, LoggerService,
                   // to initialise a service when application starts in this case to get all process messages when starts
                { provide: APP_INITIALIZER, useFactory: getprocessmessages, deps: [ProcessMessageService], multi: true } 
  ],  

  bootstrap: [AppComponent]
               
})

export class AppModule { }

