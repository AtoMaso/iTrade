import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

// components
import { DashboardComponent }   from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
import { AboutComponent } from './views/info/about.component';
import { ContactComponent } from './views/info/contact.component';

import { TradesListComponent } from './views/trade/tradeslist/tradeslist.component';
import { MyTradesListComponent } from './views/trade/mytradeslist/mytradeslist.component';
import { TradeDetailsComponent } from './views/trade/tradedetails/tradedetails.component';
import { AddTradeComponent } from './views/trade/addtrade/addtrade.component';

import { TradersListComponent } from './views/trader/traderslist/traderslist.component';
import { TraderDetailsComponent } from './views/trader/traderdetails/traderdetails.component';
import { TraderHomeComponent } from './views/trader/traderhome/traderhome.component';

import { PersonalDetailsComponent } from './views/trader/personaldetails/personaldetails.component';
import { ContactlDetailsComponent } from './views/trader/contactdetails/contactdetails.component';
import { LoginDetailsComponent } from './views/trader/logindetails/logindetails.component';

import { CorrespondenceListComponent } from './views/correspondence/correspondencelist/correspondencelist.component';
import { CorrespondenceDetailsComponent } from './views/correspondence/correspondencedetails/correspondencedetails.component';
import { AddCorrespondenceComponent } from './views/correspondence/addcorrespondence/addcorrespondence.component';

import { ForgotPasswordComponent } from './views/trader/forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './views/trader/resetpassword/resetpassword.component';

import { CategoriesComponent } from './views/categories/categories.component';
import { PlacesComponent } from './views/places/places.component';
import {ProcessMessagesAdminComponent} from './views/processmessagesadmin/processmessagesadmin.component';
import {TypesComponent} from './views/types/types.component';


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
  { path: 'tradeslist', component: TradesListComponent}, 
  { path: 'tradedetails', component: TradeDetailsComponent }, // this should be accessible from the dashboard or the list of all trades or my trades view
  { path: 'addtrade', component: AddTradeComponent, canActivate: [AuthGuard]},
  { path: 'mytradeslist', component: MyTradesListComponent, canActivate: [AuthGuard] },

  // t r a d e r
  { path: 'traderdetails', component: TraderDetailsComponent}, // this should be accessible from the dashboard of all trades view  
  { path: 'traderhome', component: TraderHomeComponent, canActivate: [AuthGuard] },   
  { path: 'personaldetails', component: PersonalDetailsComponent, canActivate: [AuthGuard] },
  { path: 'contactdetails', component: ContactlDetailsComponent, canActivate: [AuthGuard] },
  { path: 'logindetails', component: LoginDetailsComponent, canActivate: [AuthGuard] },  
  { path: 'traderslist', component: TradersListComponent, canActivate: [AuthGuard] },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },

  // correspondence
  { path: 'correspondencelist', component: CorrespondenceListComponent, canActivate: [AuthGuard]}, // correspondence should available only when authenticated 
  { path: 'correspondencedetails', component: CorrespondenceDetailsComponent, canActivate: [AuthGuard] }, // correspondence should available only when authenticated 
  { path: 'addcorrespondence', component: AddCorrespondenceComponent, canActivate: [AuthGuard] }, // correspondence should available only when authenticated 

  { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'places', component: PlacesComponent, canActivate: [AuthGuard] },
  { path: 'messages', component: ProcessMessagesAdminComponent, canActivate: [AuthGuard] },
  { path: 'types', component: TypesComponent, canActivate: [AuthGuard] },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule { }
