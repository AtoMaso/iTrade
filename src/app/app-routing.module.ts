import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

// components
import { DashboardComponent }   from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
import { AboutComponent } from './views/info/about.component';
import { ContactComponent } from './views/info/contact.component';

import { TradeListComponent } from './views/trade/tradelist/tradelist.component';
import { TradeInfoComponent } from './views/trade/tradeinfo/tradeinfo.component';

import { TraderListComponent } from './views/trader/traderlist/traderlist.component';
import { TraderInfoComponent } from './views/trader/traderinfo/traderinfo.component';
import { TraderAccountComponent } from './views/trader/traderaccount/traderaccount.component';
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
  { path: 'tradelist', component: TradeListComponent },
  { path: 'tradeinfo', component: TradeInfoComponent },

  { path: 'traderlist', component: TraderListComponent },
  { path: 'traderinfo', component: TraderInfoComponent},
  { path: 'traderaccount', component: TraderAccountComponent, canActivate: [AuthGuard] },  
  //{ path: 'ng2-file-upload', component: NG2FileUploadComponent, canActivate: [AuthGuard] },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule { }
