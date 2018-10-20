import { Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter, ViewEncapsulation, Input, OnChanges, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectData, ProjectRoleData, ProjectTypeData } from 'src/app/interfaces/project-data';
import { TweenLite, TimelineMax, CSSPlugin, ScrollToPlugin, Sine, Power3, Power2 } from 'gsap/all';


@Component({
  selector: 'app-rolodex',
  templateUrl: './rolodex.component.html',
  styleUrls: ['./rolodex.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolodexComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Output() indexUpdate = new EventEmitter();
  @Output() animInComplete = new EventEmitter();

  @Input() newID: string;

  projects: Array<ProjectData>;
  roles: Array<ProjectRoleData>;
  types: Array<ProjectTypeData>;

  private tl: TimelineMax;
  private length: number;
  private lengthMinus1: number;
  private iter: number;
  private timeScale: number;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {
    CSSPlugin.defaultTransformPerspective = 4000;
   }

  ngOnInit() {
    const data = this.route.snapshot.data['projectsData'];
    this.projects = data.projects;
    this.roles = data.roles;
    this.types = data.types;
    this.length = this.projects.length;
    this.lengthMinus1 = this.length - 1;
  }

  ngAfterViewInit() {
    this.buildTL();
    this.animIn();
  }

  ngOnDestroy() {
    if (this.tl) {
      this.tl.kill();
    }
  }

  ngOnChanges() {
    /* when newID gets updated */
    if (this.tl) {
      this.timeScale = Math.abs(this.tl.time() - this.tl.getLabelTime(this.newID));
      this.timeScale = this.timeScale / 0.6;
      this.tl.timeScale(this.timeScale);
      this.tl.tweenTo(this.newID, { ease: Sine.easeOut });
    }
  }

  private onTimelineCall() {
    this.ngZone.run( () => this.indexUpdate.emit() );
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
        this.tl.call(this.onTimelineCall, null, this, this.projects[this.iter].id + '+=.3');
        this.tl.to(`.project-info[data-index="${this.iter + 1}"]`, 0.3, { rotationY: 0 }, this.projects[this.iter].id + '+=.3'); // show
        // anim project-role sections if roles dif
        if (this.projects[this.iter].role !== this.projects[this.iter + 1].role) {
          this.tl.to(`.project-role[data-role="${this.projects[this.iter].role}"]`, 0.3, { rotationX: -90 }, this.projects[this.iter].id); // hide
          this.tl.to(`.project-role[data-role="${this.projects[this.iter + 1].role}"]`, 0.3, { rotationX: 0 }, this.projects[this.iter].id + '+=.3'); // show
        }
        // anim project-type sections if types dif
        if (this.projects[this.iter].type.id !== this.projects[this.iter + 1].type.id) {
          this.tl.to(`.project-type[data-type="${this.projects[this.iter].type.id}"]`, 0.3, { rotationX: -90 }, this.projects[this.iter].id); // hide
          this.tl.to(`.project-type[data-type="${this.projects[this.iter + 1].type.id}"]`, 0.3, { rotationX: 0 }, this.projects[this.iter].id + '+=.3'); // show
        }
      }
    }
  }

  private animIn() {
    console.log('Rolodex.animIn()');
    const duration = 0.5;
    const delay = 0.5;
    // animate in current project after load
    TweenLite.to('.portfolio-image', duration, {
      'background-position-y': '0em',
      visibility: 'visible',
      ease: Power3.easeOut,
      delay: delay,
      onComplete: () => {
        this.ngZone.run(() => this.animInComplete.emit());
      }
    });
    TweenLite.to([`.project-type[data-type="${this.projects[0].type.id}"]`, `.project-role[data-role="${this.projects[0].role}"]`],
      duration, { rotationX: 0, ease: Sine.easeOut, delay: delay });
    TweenLite.to(`.project-info[data-index="0"]`, duration, { rotationY: 0, delay: delay, ease: Sine.easeOut });
  }

}


