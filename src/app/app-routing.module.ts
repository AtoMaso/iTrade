import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { HeroesComponent }      from './views/heroes/heroes.component';
import { DashboardComponent }   from './views/dashboard/dashboard.component';
import { HeroDetailComponent } from './views/hero-detail/hero-detail.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
// Import the AuthGuard
import { AuthGuard } from './services/auth.guard';



const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
  { path: 'dashboard', component: DashboardComponent},
  { path: 'detail/:id', component: HeroDetailComponent },// canActivate: [AuthGuard] },
  { path: 'heroes', component: HeroesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent } //canActivate: [AuthGuard] },

  //{ path: '/views/articles', name: 'Articles', component: ArticleListComponent },
  //{ path: '/views/article/:id', name: 'Article', component: ArticleComponent },
  //{ path: '/views/addarticle', name: 'AddArticle', component: AddArticleComponent },

  //{ path: '/views/authors', name: 'Authors', component: AuthorListComponent },
  //{ path: '/views/author/:id', name: 'Author', component: AuthorComponent },
  //{ path: '/view/addauthor', name: 'AddAuthor', component: AddAuthorComponent },

  //{ path: '/views/teams', name: 'Teams', component: TeamListComponent },
  //{ path: '/views/team/:id', name: 'Team', component: TeamComponent },
  //{ path: '/views/addteam', name: 'AddTeam', component: AddTeamComponent },

  //{ path: '/views/members', name: 'Members', component: MemberListComponent },
  //{ path: '/views/members/:id', name: 'TeamMembers', component: MemberListComponent },
  //{ path: '/views/member/:id', name: 'Member', component: MemberComponent },
  //{ path: '/views/addmember', name: 'AddMember', component: AddMemberComponent },

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
