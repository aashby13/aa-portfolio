// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TweenLite, TimelineMax, CSSPlugin, Sine } from 'gsap/all';
import { ProjectData, ProjectRoleData, ProjectTypeData } from 'src/app/models';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-rolodex',
  templateUrl: './rolodex.component.html',
  styleUrls: ['./rolodex.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolodexComponent implements OnInit, AfterViewInit, OnDestroy {

  newID: string;
  projects: ProjectData[];
  roles: ProjectRoleData[];
  types: ProjectTypeData[];

  private tl: TimelineMax;
  private timeScale: number;
  private sub: Subscription;

  constructor(private route: ActivatedRoute, private globalService: GlobalService) {
    CSSPlugin.defaultTransformPerspective = 4000;
  }

  ngOnInit() {
    this.globalService.imageScrollEnabled$.next(true);
    this.projects = this.route.snapshot.data.jsonData.projects;
    this.roles = this.route.snapshot.data.jsonData.roles;
    this.types = this.route.snapshot.data.jsonData.types;
    this.sub = this.route.url.subscribe(url => this.onUrlChange(url[0].path));
    this.newID = this.route.snapshot.url[0].path;
  }

  ngAfterViewInit() {
    this.buildTL();
    const startingIndex = this.projects.find(obj => obj.id === this.newID).index;
    this.tl.time(this.tl.getLabelTime(this.newID) - 0.3);
    if (startingIndex !== 0) {
      TweenLite.fromTo([
        `.project-type[data-type="${(this.projects[startingIndex].type as ProjectTypeData).id}"]`,
        `.project-role[data-role="${this.projects[startingIndex].role}"]`
      ],
        0.3, { rotationX: 90 },
        { rotationX: 0, ease: Sine.easeOut, delay: 0.5 });
    }

    setTimeout(() => {
      this.onUrlChange(this.newID);
    }, 500);
  }

  ngOnDestroy() {
    if (this.tl) this.tl.kill();
    this.globalService.imageScrollEnabled$.next(null);
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
    // set .project-type & .project-role rotation
    TweenLite.set(['.project-type', '.project-role'], { rotationX: 90, transformOrigin: 'center center', display: 'block' });
    // set .project-info rotation
    TweenLite.set('.project-info', { rotationY: 90, transformOrigin: 'top left', display: 'block' });
    // build timeline
    this.tl = new TimelineMax({ paused: true })
      .to('.project-info[data-index="0"]', 0.3, { rotationY: 0 }, 0)
      .to([
        `.project-type[data-type="${(this.projects[0].type as ProjectTypeData).id}"]`,
        `.project-role[data-role="${this.projects[0].role}"]`
      ],
        0.3, { rotationX: 0 }, 0);
    //
    this.projects.forEach((proj, i, arr) => {
      // add labels for each project .6sec apart
      this.tl.addLabel(proj.id, (i * 0.6) + 0.3);
      //
      if (i < lengthMinus1) {
        // anim project-info sections at label
        this.tl.to(`.project-info[data-index="${i}"]`, 0.3, { rotationY: -90 }, proj.id); // hide
        this.tl.to(`.project-info[data-index="${i + 1}"]`, 0.3, { rotationY: 0 }, proj.id + '+=.3'); // show
        // anim project-role sections if roles dif
        if (proj.role !== arr[i + 1].role) {
          this.tl.to(`.project-role[data-role="${proj.role}"]`, 0.3,
            { rotationX: -90 }, proj.id); // hide
        }
        this.tl.to(`.project-role[data-role="${arr[i + 1].role}"]`, 0.3,
          { rotationX: 0 }, proj.id + '+=.3'); // show
        // anim project-type sections if types dif
        if ((proj.type as ProjectTypeData).id !== (arr[i + 1].type as ProjectTypeData).id) {
          this.tl.to(`.project-type[data-type="${(proj.type as ProjectTypeData).id}"]`, 0.3,
            { rotationX: -90 }, proj.id); // hide
        }
        this.tl.to(`.project-type[data-type="${(arr[i + 1].type as ProjectTypeData).id}"]`, 0.3,
          { rotationX: 0 }, proj.id + '+=.3'); // show
      }
    });
  }

}
