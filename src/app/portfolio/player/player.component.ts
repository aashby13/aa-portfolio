import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('video', { static: false }) vidEl: ElementRef;

  data: ProjectMoreData;
  loaded: boolean;
  paused = true;
  showBtn = true;
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

  playToggle() {
    if (this.vidEl.nativeElement.paused || this.vidEl.nativeElement.ended) {
      this.vidEl.nativeElement.play();
      this.paused = false;
    } else {
      this.vidEl.nativeElement.pause();
      this.paused = true;
    }
    //
    this.showBtn = true;
    setTimeout(() => {
      this.showBtn = false;
    }, 300);
  }

  onVideoPlaying() {
    // tslint:disable-next-line: one-variable-per-declaration
    const time = (this.vidEl.nativeElement as HTMLVideoElement).currentTime,
      int = setInterval(() => {
        if (time < (this.vidEl.nativeElement as HTMLVideoElement).currentTime) {
          this.paused = false;
          this.showBtn = false;
          clearInterval(int);
        }
      }, 300);
  }

  onVideoEnded() {
    this.paused = false;
    this.showBtn = true;
  }

  private onUrlChange(id: string) {
    this.loaded = false;
    setTimeout(() => {
      this.onVideoEnded();
      this.data = this.projects.find(proj => proj.id === id).more;
    }, 1000);
  }

}
