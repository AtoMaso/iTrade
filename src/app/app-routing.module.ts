import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { DashboardComponent }   from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
// Import the AuthGuard
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
  { path: 'dashboard', component: DashboardComponent},  // canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent } //canActivate: [AuthGuard] },
  
  //{ path: '/views/info/about', name: 'About', component: AboutComponent },
  //{ path: '/views/info/contact', name: 'Contact', component: ContactComponent },
  //{ path: '/views/authentication/home', name: 'Home', component: HomeComponent },
  //{ path: '/views/file-upload/ng2-file-upload', name: 'Upload', component: NG2FileUploadComponent }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule { }
