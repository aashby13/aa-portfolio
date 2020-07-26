import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-player-launch-btn',
  templateUrl: './player-launch-btn.component.html',
  styleUrls: ['./player-launch-btn.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayerLaunchBtnComponent implements OnInit {

  constructor(private gloabalService: GlobalService) { }

  ngOnInit(): void {
  }

  onClick() {
    console.log('PlayerLaunchBtnComponent.onClick()');
  }

}
