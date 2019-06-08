import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RolodexComponent } from './rolodex/rolodex.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':id',
    component: RolodexComponent
  },
  { path: '', redirectTo: 'pinpoint', pathMatch: 'full' },
  { path: '**', redirectTo: 'pinpoint', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    RolodexComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PortfolioModule { }
