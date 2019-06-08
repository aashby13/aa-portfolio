import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserScrollDirective } from './user-scroll/user-scroll.directive';
import { ImageScrollComponent } from './image-scroll/image-scroll.component';
import { DotNavComponent } from './dot-nav/dot-nav.component';


@NgModule({
  declarations: [
    UserScrollDirective,
    ImageScrollComponent,
    DotNavComponent
  ],
  exports: [
    CommonModule,
    UserScrollDirective,
    ImageScrollComponent,
    DotNavComponent
  ],
  imports: [
    RouterModule,
    CommonModule
  ]
})
export class SharedModule { }
