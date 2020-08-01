import { Component, ViewEncapsulation, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-play-pause-btn',
  templateUrl: './play-pause-btn.component.html',
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
