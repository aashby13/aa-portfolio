import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  constructor(private globalService: GlobalService) { }

    ngOnInit() {
      this.globalService.rootPath$.next('/portfolio/');
    }

}
