import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PlayerComponent } from './player/player.component';
import { DataService } from './services/data.service';
import { WindowService } from './services/window.service';
import { UserScrollDirective } from './directives/user-scroll.directive';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { DataResolver } from './services/data-resolver';

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
    ContactComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [Title, DataService, WindowService, DataResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
