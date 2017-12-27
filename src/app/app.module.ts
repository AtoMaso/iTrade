import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';


import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroesComponent } from './views//heroes/heroes.component';
import { HeroDetailComponent } from './views/hero-detail/hero-detail.component';
import { MessagesComponent } from './views/messages/messages.component';

import { HeroService } from './services/hero.service';
import { MessageService } from './services/message.service';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { InMemoryDataService }  from './services//in-memory-data.service';
import { HeroSearchComponent } from './views/hero-search/hero-search.component';

//import { ROUTER_PROVIDERS } from '@angular/router';
//import { FORM_PROVIDERS } from '@angular/common';
//import { HTTP_PROVIDERS } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Idle } from '@ng-idle/core';

import { AuthenticationService } from './services/authentication.service';
import { ProcessMessageService } from './services/processmessage.service';
import { PageTitleService } from './services/pagetitle.service';
import { LoggerService } from './services/logger.service';


@NgModule({
  declarations: [
        AppComponent,
        HeroesComponent,
        HeroDetailComponent,
        MessagesComponent,
        DashboardComponent,
        HeroSearchComponent,
  ],  

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
         InMemoryDataService, { dataEncapsulation: false }
    )
  ],

  providers: [HeroService, MessageService,
                  AuthenticationService, Idle, ProcessMessageService,
                  PageTitleService, LoggerService],
  bootstrap: [AppComponent,
                  //HTTP_PROVIDERS, FORM_PROVIDERS,
                  //ROUTER_PROVIDERS, 
                ]
})

export class AppModule { }




//import { BrowserModule } from '@angular/platform-browser';

//import { NgModule } from '@angular/core';


//import { DataService } from './services/data.service';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { FormsModule } from '@angular/forms';

//import { AppRoutingModule } from './app-routing.module';

//import { AppComponent } from './app.component';

//import { HomeComponent } from './views/home/home.component';

//import { AboutComponent } from './views/about/about.component';




//@NgModule({

//  declarations: [
//    AppComponent,
//    HomeComponent,
//    AboutComponent
//  ],

//  imports: [
//    BrowserModule,
//    AppRoutingModule,
//    FormsModule,
//    BrowserAnimationsModule
//  ],

//  providers: [DataService],
//  bootstrap: [AppComponent]
//})


//export class AppModule { }
