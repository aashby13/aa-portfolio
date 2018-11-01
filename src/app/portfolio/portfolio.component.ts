import { Component, OnInit, AfterViewInit, HostListener, ViewChildren, QueryList, ElementRef, Output, EventEmitter, NgZone, ViewEncapsulation } from '@angular/core';
import { TweenLite, CSSPlugin, ScrollToPlugin, Sine, Power2 } from 'gsap/all';
import { ProjectData, ProjectTypeData, ProjectRoleData } from '../interfaces/project-data';
import { WindowService } from '../services/window.service';
import { Router, ActivatedRoute } from '@angular/router';

let cur = 0;
let to: number;
let rt: number;
let ot: number;
let i: number;
let l = 0;
let top: number;
let height: number;
let img: HTMLElement;

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioComponent implements OnInit, AfterViewInit {

  @ViewChildren('images') imageList: QueryList<ElementRef>;

  projects: Array<ProjectData>;
  roles: Array<ProjectRoleData>;
  types: Array<ProjectTypeData>;
  index: number;
  curID: string;
  updateID: string;
  errorMessage: string;
  images: Array<ElementRef>;
  title: string;

  private window: Window;
  private ready = false;
  private freshID: string;
  private delta = 0;

  constructor(
    private windowService: WindowService,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {
    this.window = this.windowService.nativeWindow;
    CSSPlugin.defaultTransformPerspective = 4000;
  }

  ngOnInit() {
    this.projects = this.route.snapshot.data['projectsData'].projects;
    l = this.projects.length;
    cur = this.getFreshIndex();
    this.updateIndex(cur, true);
  }

  ngAfterViewInit() {
    this.images = this.imageList.toArray();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.ready) { return; }
    clearTimeout(to);
    to = this.window.setTimeout(() => {
      const b = (rt - ot) - this.window.scrollY > (height / 8) ? true : false;
      TweenLite.to(this.window, b ? 1.4 : 0.8, { scrollTo: { y: rt - ot, autoKill: true }, ease: Sine.easeOut });
    }, 17);
    //
    this.gotToNearestInfo(Math.round(this.delta / 2) * -1);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' && this.index < l - 1) {
      this.goTo(this.index + 1);
    } else if (event.key === 'ArrowUp' && this.index > 0) {
      this.goTo(this.index - 1);
    }
  }

  onScrollUp(e: { delta: number }) {
    TweenLite.set(this.window, { scrollTo: { y: this.window.scrollY - Math.abs(e.delta / 3) } });
  }

  onScrollDown(e: { delta: number }) {
    TweenLite.set(this.window, { scrollTo: { y: this.window.scrollY + Math.abs(e.delta / 3) } });
  }

  goTo(indx: number) {
    rt = this.images[indx].nativeElement.offsetTop;
    TweenLite.to(this.window, 0.6 + (Math.abs(indx - cur) * 0.06),
      {
        scrollTo: { y: rt - ot, ease: Power2.easeOut, autoKill: true },
        onUpdate: () => {
          clearTimeout(to);
        },
        onComplete: () => {
          this.ngZone.run(() => this.updateIndex(indx));
        }
      });
  }

  onAnimInComplete() {
    /* console.log('Portfolio.onAnimInComplete()', this._freshID, this.updateID); */
    ot = this.images[0].nativeElement.offsetTop;
    rt = this.images[cur].nativeElement.offsetTop;
    this.ready = true;
    TweenLite.to(this.window, 0.6, { scrollTo: { y: rt, autoKill: true }, ease: Sine.easeOut });
    this.updateID = this.freshID;
  }

  updateIndex(n?: number, surpressNav: boolean = false) {
    this.index = n !== undefined ? n : cur;
    this.curID = this.projects[this.index].id;
    if (!surpressNav) {
      this.updateID = this.curID;
      this.router.navigate(['portfolio', this.curID]);
    }
  }

  private gotToNearestInfo(addY: number = 0) {
    for (i = 0; i < l; i++) {
      img = this.images[i].nativeElement;
      top = img.offsetTop;
      height = img.offsetHeight / 2;
      //
      if ((top <= (this.window.scrollY + addY) + ot + height && top >= (this.window.scrollY + addY) + ot - height) && i !== cur) {
        cur = i;
        rt = top;
        this.updateID = img.id;
      }
    }
  }

  private getFreshIndex(): number {
    this.freshID = this.route.snapshot.url[1].path;
    for (i = 0; i < this.projects.length; i++) {
      if (this.projects[i].id === this.freshID) {
        return i;
      }
    }
    return null;
  }
}
