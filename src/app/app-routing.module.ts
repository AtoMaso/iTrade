import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

// components
import { DashboardComponent }   from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
import { AboutComponent } from './views/info/about.component';
import { ContactComponent } from './views/info/contact.component';

import { MyTradesListComponent } from './views/trade/mytradeslist/mytradeslist.component';
import { TradeDetailsComponent } from './views/trade/tradedetails/tradedetails.component';
import { AddTradeComponent } from './views/trade/addtrade/addtrade.component';
import { AllTradesListComponent } from './views/trade/alltradeslist/alltradeslist.component';

import { AllTradersListComponent } from './views/trader/alltraderslist/alltraderslist.component';
import { TraderDetailsComponent } from './views/trader/traderdetails/traderdetails.component';
import { TraderHomeComponent } from './views/trader/traderhome/traderhome.component';
import { MyTraderAccountComponent } from  './views/trader/mytraderaccount/mytraderaccount.component';;
import { PersonalDetailsComponent } from './views/trader/personaldetails/personaldetails.component';;
import { ContactlDetailsComponent } from './views/trader/contactdetails/contactdetails.component';;
import { SecurityDetailsComponent } from './views/trader/securitydetails/securitydetails.component';;
import { CorrespondenceDetailsComponent } from './views/correspondence/correspondencedetails/correspondencedetails.component';
import { CorrespondenceAllComponent } from './views/correspondence/correspondenceall/correspondenceall.component';
import { ForgotPasswordComponent } from './views/password/forgotpassword/forgotpassword.component';
import { ChangePasswordComponent } from './views/password/changepassword/changepassword.component';

//import { NG2FileUploadComponent } from './views/file-upload/ng2-file-upload.component';

// cmport the AuthGuard helper
import { AuthGuard } from './helpers/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
  { path: 'dashboard', component: DashboardComponent}, 
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },    
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  //t r a d e s
  { path: 'alltradeslist', component: AllTradesListComponent }, 
  { path: 'tradedetails', component: TradeDetailsComponent }, // this should be accessible from the dashboard or the list of all trades or my trades view
  { path: 'addtrade', component: AddTradeComponent, canActivate: [AuthGuard]},
  { path: 'mytradeslist', component: MyTradesListComponent, canActivate: [AuthGuard] },

  // t r a d e r
  { path: 'traderhome', component: TraderHomeComponent, canActivate: [AuthGuard] },   
  { path: 'mytraderaccount', component: MyTraderAccountComponent, canActivate: [AuthGuard] },
  { path: 'personaldetails', component: PersonalDetailsComponent, canActivate: [AuthGuard] },
  { path: 'contactdetails', component: ContactlDetailsComponent, canActivate: [AuthGuard] },
  { path: 'securitydetails', component: SecurityDetailsComponent, canActivate: [AuthGuard] },
  { path: 'traderdetails', component: TraderDetailsComponent }, // this should be accessible from the dashboard of all trades view  

  // correspondence
  { path: 'correspondenceall', component: CorrespondenceAllComponent}, // correspondence should available only when authenticated , canActivate: [AuthGuard]
  { path: 'correspondencedetails', component: CorrespondenceDetailsComponent }, // correspondence should available only when authenticated , canActivate: [AuthGuard]
  // t r a d e r s
  { path: 'alltraderslist', component: AllTradersListComponent, canActivate: [AuthGuard] },

  // password 
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'changepassword', component: ChangePasswordComponent },
  //{ path: 'ng2-file-upload', component: NG2FileUploadComponent, canActivate: [AuthGuard] },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule { }
