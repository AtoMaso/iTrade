import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module';
import { MomentModule } from 'angular2-moment'; 
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core 
                                                                                         //NgIdleModule but includes keepalive providers for easy wireup

//services
import { AuthenticationService } from './services/authentication.service';
import { ProcessMessageService } from './services/processmessage.service';
import { PageTitleService } from './services/pagetitle.service';
import { LoggerService } from './services/logger.service';
import { HeroService } from './services/hero.service';
import { MessageService } from './services/message.service';
//import { AuthCheck } from './services/authcheck';

//components
import { ProcessMessagesComponent } from './views/controls/process-messages.component';
import { PageTitleComponent } from './views/controls/pagetitle.component';
import { ModalComponent } from './views/controls/modal.component';
import { AppComponent } from './app.component';
import { HeroesComponent } from './views//heroes/heroes.component';
import { HeroDetailComponent } from './views/hero-detail/hero-detail.component';
import { MessagesComponent } from './views/messages/messages.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { InMemoryDataService } from './services//in-memory-data.service';
import { HeroSearchComponent } from './views/hero-search/hero-search.component';



@NgModule({

  declarations: [
        AppComponent,
        HeroesComponent,
        HeroDetailComponent,
        MessagesComponent,
        DashboardComponent,
        HeroSearchComponent,
        PageTitleComponent,
        ProcessMessagesComponent,
        ModalComponent    
  ],  

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
         InMemoryDataService, { dataEncapsulation: false }
    )
  ],

  providers: [HeroService, MessageService, 
                  AuthenticationService, ProcessMessageService,
                  PageTitleService, LoggerService],
  bootstrap: [AppComponent]
               
})

export class AppModule { }

