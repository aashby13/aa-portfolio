import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataResolver } from './core/data-resolver/data.resolver';
import { ImageScrollComponent } from './shared/image-scroll/image-scroll.component';
import { DotNavComponent } from './shared/dot-nav/dot-nav.component';
import { DATA_PATHS } from './constants';
import { GhostDragComponent } from './shared/ghost-drag/ghost-drag.component';

const routes: Routes = [
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
    data: { title: 'Adam Ashby Dev: About' }
  },
  { path: 'contact',
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
    data: { title: 'Adam Ashby Dev: Contact' }
  },
  {
    path: 'portfolio',
    children: [
      {
        path: '',
        loadChildren: () => import('./portfolio/portfolio.module').then(m => m.PortfolioModule),
        data: { title: 'Adam Ashby Dev: Portfolio', url: DATA_PATHS.portfolio },
        resolve: { jsonData: DataResolver }
      },
      {
        path: '',
        component: ImageScrollComponent,
        outlet: 'column-content',
        data: {
          url: DATA_PATHS.portfolio,
          tree: 'projects',
          filters: [{ type: 'key', match: 'id' }, { type: 'key', match: 'index' }],
          rootPath: '/portfolio/'
        },
        resolve: { jsonData: DataResolver }
      },
      {
        path: '',
        component: DotNavComponent,
        outlet: 'gutter-right',
        data: {
          url: DATA_PATHS.portfolio,
          tree: 'projects',
          filters: [{ type: 'key', match: 'id' }],
          mapKeys: [['id', 'path']]
        },
        resolve: { jsonData: DataResolver }
      },
      {
        path: '',
        component: GhostDragComponent,
        outlet: 'ghost-column',
        data: {},
      }
    ]
  },
  { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
  { path: '**', redirectTo: 'portfolio', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
