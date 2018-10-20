import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { PortfolioComponent } from './portfolio/portfolio.component';
import { PlayerComponent } from './portfolio/player/player.component';
import { UserScrollDirective } from './portfolio/user-scroll/user-scroll.directive';

import { DataService } from './services/data.service';
import { DataResolver } from './services/data-resolver';
import { WindowService } from './services/window.service';

import { MainMenuComponent } from './main-menu/main-menu.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { RolodexComponent } from './portfolio/rolodex/rolodex.component';


const appRoutes: Routes = [
  { path: 'about', component: AboutComponent, data: { title: 'Adam Ashby Dev: About' } },
  { path: 'contact', component: ContactComponent, data: { title: 'Adam Ashby Dev: Contact' } },
  {
    path: 'portfolio/:id',
    component: PortfolioComponent,
    data: { title: 'Adam Ashby Dev: Portfolio' },
    resolve: { projectsData: DataResolver }
  },
  { path: '', redirectTo: 'portfolio/pinpoint', pathMatch: 'full' },
  { path: '**', redirectTo: 'portfolio/pinpoint', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    PortfolioComponent,
    PlayerComponent,
    UserScrollDirective,
    MainMenuComponent,
    AboutComponent,
    ContactComponent,
    RolodexComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
