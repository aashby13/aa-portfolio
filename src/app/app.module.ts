import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PlayerComponent } from './player/player.component';
import { DataService } from './services/data.service';
import { WindowService } from './services/window.service';
import { UserScrollDirective } from './user-scroll.directive';

const appRoutes: Routes = [
    { path: 'portfolio/:id', component: PortfolioComponent, data: { title: 'Adam Ashby: Portfolio' } },
    { path: '', redirectTo: 'portfolio/0', pathMatch: 'full' },
    { path: '**', redirectTo: 'portfolio/0', pathMatch: 'full' }
];

@NgModule({
    declarations: [
        AppComponent,
        PortfolioComponent,
        PlayerComponent,
        UserScrollDirective
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false } // <-- debugging purposes only
        )
    ],
    providers: [Title, DataService, WindowService],
    bootstrap: [AppComponent]
})
export class AppModule { }
