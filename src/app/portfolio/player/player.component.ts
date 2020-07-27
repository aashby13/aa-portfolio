import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectData, ProjectMoreData } from 'src/app/models';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlayerComponent implements OnInit {

  data: ProjectMoreData;
  private sub: Subscription;
  private projects: ProjectData[];

  constructor(private route: ActivatedRoute) { }

    ngOnInit() {
      this.projects = this.route.snapshot.data.jsonData.projects;
      this.sub = this.route.url.subscribe(url => this.onUrlChange(url[0].path));
      console.log(this.route.snapshot);
    }

    private onUrlChange(id: string) {
      this.data = this.projects.find(proj => proj.id === id).more;
    }

}
