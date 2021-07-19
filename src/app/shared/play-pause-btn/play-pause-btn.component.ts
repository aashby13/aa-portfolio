import { Component, ViewEncapsulation, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-play-pause-btn',
  template: `<div class="btn-wrap">
              <button class="play-toggle-btn {{ playBtnClass }}" [ngClass]="{paused : !isPaused}"><span></span></button>
            </div>`,
  styleUrls: ['./play-pause-btn.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayPauseBtnComponent implements OnChanges {

  playBtnClass = 'show';
  @Input() isPaused = false;
  @Input() show = true;

  constructor() { }

  ngOnChanges(): void {
    this.playBtnClass = this.show ? 'show' : 'hide';
  }

}
