import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

// components
import { DashboardComponent }   from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
import { TradeComponent } from './views/trade/trade.component';
import { AboutComponent } from './views/info/about.component';
import { ContactComponent } from './views/info/contact.component';
import { WelcomeComponent } from './views/authentication/welcome.component';
//import { NG2FileUploadComponent } from './views/file-upload/ng2-file-upload.component';

// cmport the AuthGuard helper
import { AuthGuard } from './helpers/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
  { path: 'dashboard', component: DashboardComponent},  // canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },    
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'trade', component: TradeComponent, canActivate: [AuthGuard] }
  //{ path: 'ng2-file-upload', component: NG2FileUploadComponent, canActivate: [AuthGuard] },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule { }
