import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

// components
import { DashboardComponent }   from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
import { AboutComponent } from './views/info/about.component';
import { ContactComponent } from './views/info/contact.component';

import { MyTradeListComponent } from './views/trade/mytradelist/mytradelist.component';
import { TradeInfoComponent } from './views/trade/tradeinfo/tradeinfo.component';
import { AddTradeComponent } from './views/trade/addtrade/addtrade.component';
import { AllTradesListComponent } from './views/trade/alltradeslist/alltradeslist.component';

import { TraderListComponent } from './views/trader/traderlist/traderlist.component';
import { TraderInfoComponent } from './views/trader/traderinfo/traderinfo.component';
import { TraderAccountComponent } from './views/trader/traderaccount/traderaccount.component';
import { AddTraderComponent } from './views/trader/addtrader/addtrader.component';


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
  { path: 'mytradelist', component: MyTradeListComponent },
  { path: 'tradeinfo', component: TradeInfoComponent },
  { path: 'addtrade', component: AddTradeComponent, canActivate: [AuthGuard] },

  // t r a d e r
  { path: 'traderlist', component:TraderListComponent, canActivate: [AuthGuard]},
  { path: 'traderinfo', component: TraderInfoComponent },
  { path: 'traderaccount', component: TraderAccountComponent, canActivate: [AuthGuard] },  
  { path: 'addtrader', component: AddTraderComponent, canActivate: [AuthGuard]},
  //{ path: 'ng2-file-upload', component: NG2FileUploadComponent, canActivate: [AuthGuard] },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule { }
