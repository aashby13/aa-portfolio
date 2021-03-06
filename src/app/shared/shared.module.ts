import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
/* import { UserScrollDirective } from './user-scroll/user-scroll.directive'; */
import { ImageScrollComponent } from './image-scroll/image-scroll.component';
import { DotNavComponent } from './dot-nav/dot-nav.component';
import { GhostDragComponent } from './ghost-drag/ghost-drag.component';
import { PlayerLaunchBtnComponent } from './player-launch-btn/player-launch-btn.component';
import { PlayPauseBtnComponent } from './play-pause-btn/play-pause-btn.component';


@NgModule({
  declarations: [
    /* UserScrollDirective, */
    ImageScrollComponent,
    DotNavComponent,
    GhostDragComponent,
    PlayerLaunchBtnComponent,
    PlayPauseBtnComponent
  ],
  exports: [
    CommonModule,
    /* UserScrollDirective, */
    ImageScrollComponent,
    DotNavComponent,
    GhostDragComponent,
    PlayerLaunchBtnComponent,
    PlayPauseBtnComponent
  ],
  imports: [
    RouterModule,
    CommonModule
  ]
})
export class SharedModule { }
