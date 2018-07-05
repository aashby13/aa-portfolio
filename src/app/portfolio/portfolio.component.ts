import { Component, AfterViewInit, OnDestroy, HostListener, ViewChildren, QueryList, ElementRef} from '@angular/core';
import { DataService } from '../services/data.service';
import { TweenLite, TimelineMax, CSSPlugin, Sine, Power3, Power2 } from 'gsap/TweenMax';
import { ProjectData, ProjectTypeData, TypesData, ProjectRoleData } from '../interfaces/project-data';
import { WindowService } from '../services/window.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlatformLocation } from '@angular/common';

require('gsap/ScrollToPlugin');

let cur = 0;
let tl: TimelineMax;
let to: number;
let rt: number;
let ot: number;
let i: number;
let l = 0;
let top: number;
let height: number;
let img: HTMLElement;
let timeScale: number;

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements /* OnInit, */ AfterViewInit, OnDestroy {

    @ViewChildren('images')
    imageList: QueryList<HTMLElement>;

    projects: Array<ProjectData>;
    roles: Array<ProjectRoleData>;
    types: Array<ProjectTypeData>;
    index: number;
    curID: string;
    errorMessage: string;
    images: Array<ElementRef>;

    private _window: Window;
    private _ready = false;
    private _freshID: string;
    private _imgSub: Subscription;
    private _dataSub: Subscription;
    private delta: number;

    constructor(
        private _windowService: WindowService,
        private _dataService: DataService,
        private _router: Router,
        private _loc: PlatformLocation
    ) {
        this._window = this._windowService.nativeWindow;
    }

    ngAfterViewInit() {
        CSSPlugin.defaultTransformPerspective = 4000;
        window.scrollTo(0, 0);
        //
        this._loc.onPopState(() => {
            const c = this._getFreshIndex();
            this.goTo(c);
        });
        //
        this._imgSub = this.imageList.changes.subscribe(q => {
            this.images = q.toArray();
            l = this.images.length;
            this._buildTL();
            this._animIn();
        });
        //
        this._dataSub = this._dataService.getData()
            .subscribe(data => {
                this.projects = data.projects;
                this.roles = data.roles;
                this.types = data.types;
                cur = this._getFreshIndex();
                this._updateIndex();
            },
                error => this.errorMessage = <any>error
            );
        //
    }

    ngOnDestroy() {
        if (tl) {
            tl.kill();
        }
        this._loc = null;
        this._dataSub.unsubscribe();
        this._imgSub.unsubscribe();
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (!this._ready) { return; }
        clearTimeout(to);
        to = this._window.setTimeout(() => {
            const b = (rt - ot) - this._window.scrollY > (height / 8) ? true : false;
            TweenLite.to(this._window, b ? 1.4 : 0.8, { scrollTo: { y: rt - ot, autoKill: true }, ease: Sine.easeOut });
        }, 17);
        //
        for (i = 0; i < l; i++) {
            img = this.images[i].nativeElement;
            top = img.offsetTop;
            height = img.offsetHeight / 2;
            //
            if ((top <= this._window.scrollY + ot + height && top >= this._window.scrollY + ot - height) && i !== cur) {
                cur = i;
                rt = top;
                timeScale = Math.abs(tl.time() - tl.getLabelTime(img.id));
                timeScale = timeScale / 0.6;
                tl.timeScale(timeScale);
                tl.tweenTo(img.id, { ease: Sine.easeOut });
            }
        }
    }

    onScrollUp(e: any) {
        if (!this.delta) {this.delta = e.delta; }
        TweenLite.set(this._window, { scrollTo: { y: this._window.scrollY - Math.abs(e.delta / 4) }});
    }

    onScrollDown(e: any) {
        if (!this.delta) { this.delta = e.delta; }
        TweenLite.set(this._window, { scrollTo: { y: this._window.scrollY + Math.abs(e.delta / 4) } });
    }

    private _getFreshIndex() {
        let c;
        const arr = window.location.pathname.split('/');
        this._freshID = arr[arr.length - 1];
        if (this._freshID === '0') {
            c = 0;
        } else {
            for (i = 0; i < this.projects.length; i++) {
                if (this.projects[i].id === this._freshID) {
                    c = i;
                    break;
                }
            }
        }
        return c;
    }

    private _buildTL() {
        console.log('PortfolioComponent_buildTL()');
        // set .project-type rotation
        TweenLite.set('.project-type', { rotationX: 90, transformOrigin: 'center center', display: 'block' });
        // set .project-role rotation
        TweenLite.set('.project-role', { rotationX: 90, transformOrigin: 'center center', display: 'block' });
        // set .project-info rotation
        TweenLite.set('.project-info', { rotationY: 90, transformOrigin: 'top left', display: 'block' });
        // build timeline
        tl = new TimelineMax({ paused: true });
        //
        for (i = 0; i < l; i++) {
            // add labels for each project .6sec apart
            tl.addLabel(this.projects[i].id, i * 0.6);
            //
            if (i < l - 1) {
                // anim project-info sections at label
                tl.to(`.project-info[data-index="${i}"]`, 0.3, { rotationY: -90 }, this.projects[i].id); // hide
                tl.call(this._updateIndex, null, this, this.projects[i].id + '+=.3');
                tl.to(`.project-info[data-index="${i + 1}"]`, 0.3, { rotationY: 0 }, this.projects[i].id + '+=.3'); // show
                // anim project-role sections if roles dif
                if (this.projects[i].role !== this.projects[i + 1].role) {
                    tl.to(`.project-role[data-role="${this.projects[i].role}"]`, 0.3, { rotationX: -90 }, this.projects[i].id); // hide
                    tl.to(`.project-role[data-role="${this.projects[i + 1].role}"]`, 0.3, { rotationX: 0 }, this.projects[i].id + '+=.3'); // show
                }
                // anim project-type sections if types dif
                if (this.projects[i].type.id !== this.projects[i + 1].type.id) {
                    tl.to(`.project-type[data-type="${this.projects[i].type.id}"]`, 0.3, { rotationX: -90 }, this.projects[i].id); // hide
                    tl.to(`.project-type[data-type="${this.projects[i + 1].type.id}"]`, 0.3, { rotationX: 0 }, this.projects[i].id + '+=.3'); // show
                }
            }
        }
    }

    private  _animIn() {
        const t = cur === 0 ? 0.5 : 0.3;
        // animate in current project after load
        TweenLite.to('#image-holder', t, { marginTop: '0em', visibility: 'visible', ease: Power3.easeOut,
            onComplete: () => {
                ot = this.images[0].nativeElement.offsetTop;
                rt = this.images[cur].nativeElement.offsetTop;
                this._ready = true;
                timeScale = Math.abs(tl.time() - tl.getLabelTime(this._freshID));
                timeScale = timeScale / 0.6;
                tl.timeScale(timeScale);
                TweenLite.to(this._window, 0.6, {scrollTo: {y: rt, autoKill: true}, ease: Sine.easeOut });
                tl.tweenTo(this._freshID, { ease: Sine.easeOut });
            }
        });
        TweenLite.to([`.project-type[data-type="${this.projects[0].type.id}"]`, `.project-role[data-role="${this.projects[0].role}"]`],
            t, { rotationX: 0, ease: Sine.easeOut });
        TweenLite.to(`.project-info[data-index="0"]`, t, { rotationY: 0, ease: Sine.easeOut });
    }

    private  _updateIndex() {
        this.index = cur;
        this.curID = this.projects[this.index].id;
        this._router.navigate(['/portfolio', this.curID]);
        /* console.log('_updateIndex', this.index, 'curID', this.curID); */
    }

    public goTo(indx: number) {
        rt = this.images[indx].nativeElement.offsetTop;
        TweenLite.to(this._window, 0.6 + (Math.abs(indx - cur) * 0.06),
            { scrollTo: { y: rt - ot, ease: Power2.easeOut,
                autoKill: true,
                onCompleteScope: this
            }});
    }

}
