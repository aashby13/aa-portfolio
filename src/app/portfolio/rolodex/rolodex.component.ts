// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TweenLite, TimelineMax, CSSPlugin, Sine } from 'gsap/all';
import { ProjectData, ProjectRoleData, ProjectTypeData } from 'src/app/models';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-rolodex',
  templateUrl: './rolodex.component.html',
  styleUrls: ['./rolodex.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolodexComponent implements OnInit, AfterViewInit, OnDestroy {

  newID: string;
  projects: Array<ProjectData>;
  roles: Array<ProjectRoleData>;
  types: Array<ProjectTypeData>;

  private tl: TimelineMax;
  private length: number;
  private lengthMinus1: number;
  private iter: number;
  private timeScale: number;
  private sub: Subscription;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {
    CSSPlugin.defaultTransformPerspective = 4000;
  }

  ngOnInit() {
    const data = this.route.snapshot.data.jsonData;
    this.projects = data.projects;
    this.roles = data.roles;
    this.types = data.types;
    this.length = this.projects.length;
    this.lengthMinus1 = this.length - 1;
    this.sub = this.route.url.subscribe(url => this.onUrlChange(url[0].path));
  }

  ngAfterViewInit() {
    this.buildTL();
    this.newID = this.route.snapshot.url[0].path;
    this.animIn(this.projects.find(obj => obj.id === this.newID).index);
  }

  ngOnDestroy() {
    if (this.tl) this.tl.kill();
    this.sub.unsubscribe();
  }

  onUrlChange(id: string) {
    this.newID = id;
    if (this.tl) {
      this.timeScale = Math.abs(this.tl.time() - this.tl.getLabelTime(this.newID));
      this.timeScale = this.timeScale / 0.6;
      this.tl.timeScale(this.timeScale);
      this.tl.tweenTo(this.newID, { ease: Sine.easeOut });
    }
  }

  private buildTL() {
    /* console.log('buildTL()'); */
    // set .project-type rotation
    TweenLite.set('.project-type', { rotationX: 90, transformOrigin: 'center center', display: 'block' });
    // set .project-role rotation
    TweenLite.set('.project-role', { rotationX: 90, transformOrigin: 'center center', display: 'block' });
    // set .project-info rotation
    TweenLite.set('.project-info', { rotationY: 90, transformOrigin: 'top left', display: 'block' });
    // build timeline
    this.tl = new TimelineMax({ paused: true });
    //
    for (this.iter = 0; this.iter < this.length; this.iter++) {
      // add labels for each project .6sec apart
      this.tl.addLabel(this.projects[this.iter].id, this.iter * 0.6);
      //
      if (this.iter < this.lengthMinus1) {
        // anim project-info sections at label
        this.tl.to(`.project-info[data-index="${this.iter}"]`, 0.3, { rotationY: -90 }, this.projects[this.iter].id); // hide
        /* this.tl.call(this.onTimelineCall, null, this, this.projects[this.iter].id + '+=.3'); */
        this.tl.to(`.project-info[data-index="${this.iter + 1}"]`, 0.3, { rotationY: 0 }, this.projects[this.iter].id + '+=.3'); // show
        // anim project-role sections if roles dif
        if (this.projects[this.iter].role !== this.projects[this.iter + 1].role) {
          this.tl.to(`.project-role[data-role="${this.projects[this.iter].role}"]`, 0.3,
            { rotationX: -90 }, this.projects[this.iter].id); // hide
          this.tl.to(`.project-role[data-role="${this.projects[this.iter + 1].role}"]`, 0.3,
            { rotationX: 0 }, this.projects[this.iter].id + '+=.3'); // show
        }
        // anim project-type sections if types dif
        if ((this.projects[this.iter].type as ProjectTypeData).id !== (this.projects[this.iter + 1].type as ProjectTypeData).id) {
          this.tl.to(`.project-type[data-type="${(this.projects[this.iter].type as ProjectTypeData).id}"]`, 0.3,
            { rotationX: -90 }, this.projects[this.iter].id); // hide
          this.tl.to(`.project-type[data-type="${(this.projects[this.iter + 1].type as ProjectTypeData).id}"]`, 0.3,
            { rotationX: 0 }, this.projects[this.iter].id + '+=.3'); // show
        }
      }
    }
  }

  private animIn(index: number) {
    const duration = 0.5;
    const delay = 0.5;
    TweenLite.to([
      `.project-type[data-type="${(this.projects[index].type as ProjectTypeData).id}"]`,
      `.project-role[data-role="${this.projects[index].role}"]`
    ],
      duration, { rotationX: 0, ease: Sine.easeOut, delay });
    TweenLite.to(`.project-info[data-index="${index}"]`, duration, { rotationY: 0, delay, ease: Sine.easeOut });
  }

}
