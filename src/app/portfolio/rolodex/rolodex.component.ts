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
  private timeScale: number;
  private sub: Subscription;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {
    CSSPlugin.defaultTransformPerspective = 4000;
  }

  ngOnInit() {
    this.projects = this.route.snapshot.data.jsonData.projects;
    this.roles = this.route.snapshot.data.jsonData.roles;
    this.types = this.route.snapshot.data.jsonData.types;
    this.sub = this.route.url.subscribe(url => this.onUrlChange(url[0].path));
  }

  ngAfterViewInit() {
    this.buildTL();
    this.newID = this.route.snapshot.url[0].path;
    /* this.onUrlChange(this.newID); */
    /* this.tl.tweenTo(this.newID, { ease: Sine.easeOut }); */
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
    const length = this.projects.length;
    const lengthMinus1 = length - 1;
    // set .project-type rotation
    TweenLite.set('.project-type', { rotationX: 90, transformOrigin: 'center center', display: 'block' });
    // set .project-role rotation
    TweenLite.set('.project-role', { rotationX: 90, transformOrigin: 'center center', display: 'block' });
    // set .project-info rotation
    TweenLite.set('.project-info', { rotationY: 90, transformOrigin: 'top left', display: 'block' });
    // build timeline
    this.tl = new TimelineMax({ paused: true });
    //
    for (let i = 0; i < length; i++) {
      // add labels for each project .6sec apart
      this.tl.addLabel(this.projects[i].id, i * 0.6);
      //
      if (i < lengthMinus1) {
        // anim project-info sections at label
        this.tl.to(`.project-info[data-index="${i}"]`, 0.3, { rotationY: -90 }, this.projects[i].id); // hide
        /* this.tl.call(this.onTimelineCall, null, this, this.projects[i].id + '+=.3'); */
        this.tl.to(`.project-info[data-index="${i + 1}"]`, 0.3, { rotationY: 0 }, this.projects[i].id + '+=.3'); // show
        // anim project-role sections if roles dif
        if (this.projects[i].role !== this.projects[i + 1].role) {
          this.tl.to(`.project-role[data-role="${this.projects[i].role}"]`, 0.3,
            { rotationX: -90 }, this.projects[i].id); // hide
          this.tl.to(`.project-role[data-role="${this.projects[i + 1].role}"]`, 0.3,
            { rotationX: 0 }, this.projects[i].id + '+=.3'); // show
        }
        // anim project-type sections if types dif
        if ((this.projects[i].type as ProjectTypeData).id !== (this.projects[i + 1].type as ProjectTypeData).id) {
          this.tl.to(`.project-type[data-type="${(this.projects[i].type as ProjectTypeData).id}"]`, 0.3,
            { rotationX: -90 }, this.projects[i].id); // hide
          this.tl.to(`.project-type[data-type="${(this.projects[i + 1].type as ProjectTypeData).id}"]`, 0.3,
            { rotationX: 0 }, this.projects[i].id + '+=.3'); // show
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
    TweenLite.to(`.project-info[data-index="${index}"]`, duration, { rotationY: 0, delay, ease: Sine.easeOut,
      onComplete: () => {
        console.log(this.newID);
        this.tl.currentLabel(this.newID);
      } });
  }

}
