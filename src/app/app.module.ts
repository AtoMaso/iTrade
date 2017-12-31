import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
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
import { MessagesComponent } from './views/messages/messages.component';
import { ControlMessages } from './views/controls/control-messages.component';
import { ProcessMessagesComponent } from './views/controls/process-messages.component';
import { PageTitleComponent } from './views/controls/pagetitle.component';
import { ModalComponent } from './views/controls/modal.component';


@NgModule({

  declarations: [
    AppComponent,         
    DashboardComponent,        
    LoginComponent,     
    RegisterComponent,   
    MessagesComponent,
    ControlMessages,   
    ProcessMessagesComponent,
    PageTitleComponent,
    ModalComponent
  ],  

  imports: [    
    BrowserModule,
    AppRoutingModule,  
    HttpClientModule,    
    HttpModule,
    MomentModule,
    FormsModule,
    ReactiveFormsModule,
    NgIdleKeepaliveModule.forRoot(),
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
         InMemoryDataService, { dataEncapsulation: false }
    )
  ],

  providers: [TradeApiService, MessageService, ValidationService,
                  AuthenticationService, ProcessMessageService,
                  PageTitleService, LoggerService],

  bootstrap: [AppComponent]
               
})

export class AppModule { }

