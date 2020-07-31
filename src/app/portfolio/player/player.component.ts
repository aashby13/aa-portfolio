import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectData, ProjectMoreData } from 'src/app/models';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlayerComponent implements OnInit, OnDestroy {

  data: ProjectMoreData;
  loaded: boolean;
  private sub: Subscription;
  private projects: ProjectData[];

  constructor(private route: ActivatedRoute, private gloabalService: GlobalService) { }

    ngOnInit() {
      this.gloabalService.bodyClass2$.next('player');
      this.projects = this.route.snapshot.data.jsonData.projects;
      this.sub = this.route.url.subscribe(url => this.onUrlChange(url[0].path));
    }

    ngOnDestroy() {
      this.gloabalService.bodyClass2$.next(null);
      this.sub.unsubscribe();
    }

    onLoadedData() {
      this.loaded = true;
    }

    private onUrlChange(id: string) {
      this.loaded = false;
      setTimeout(() => {
        this.data = this.projects.find(proj => proj.id === id).more;
      }, 1000);
    }

}
