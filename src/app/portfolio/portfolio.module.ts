import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RolodexComponent } from './rolodex/rolodex.component';
import { PlayerComponent } from './player/player.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':id',
    component: RolodexComponent
  },
  {
    path: 'player/:id',
    component: PlayerComponent
  },
  { path: '', redirectTo: 'pinpoint', pathMatch: 'full' },
  { path: '**', redirectTo: 'pinpoint', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    RolodexComponent,
    PlayerComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PortfolioModule { }
