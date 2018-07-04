import { Component, AfterViewInit, /* OnInit, */ OnDestroy, HostListener, ViewChildren, QueryList, ElementRef} from '@angular/core';
import { DataService } from '../services/data.service';
import { TweenLite, TimelineMax, CSSPlugin, Sine, Power3, Power2 } from 'gsap/TweenMax';
import { ProjectData, ProjectTypeData, TypesData, ProjectRoleData } from '../interfaces/project-data';
import { WindowService } from '../services/window.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

require('gsap/ScrollToPlugin');

let cur = 0;
let tl: TimelineMax;
let to: number;
let rt: number;
let ot: number;
let i: number;
let l: number;
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
    types = new Array<ProjectTypeData>();
    index: number;
    curID: string;
    errorMessage: string;
    images: Array<ElementRef>;

    private _window: Window;
    private _ready = false;
    private _first: string;

    constructor(
        private _windowService: WindowService,
        private _dataService: DataService,
        private _router: Router
    ) {
        this._window = this._windowService.nativeWindow;
    }

    ngAfterViewInit() {
        CSSPlugin.defaultTransformPerspective = 4000;
        window.scrollTo(0, 0);
        const arr = window.location.pathname.split('/');
        this._first = arr[arr.length - 1];
        //
        this.imageList.changes.subscribe(q => {
            console.log('changes', q);
            this.images = q.toArray();
            l = this.images.length;
            this._build();
            this._animIn();
        });
        //
        this._dataService.getData()
            .subscribe(data => {
                const typesData: TypesData = {};
                const prjs = data.projects;
                this.roles = data.roles;
                // change project.type to ProjectTypeData object {text:string, id:string}
                for (i = prjs.length - 1; i >= 0; i--) {
                    const p = prjs[i],
                        t = (p.type as string).toLowerCase().replace(/ /g, '-'),
                        typeObj = { text: p.type, id: t } as ProjectTypeData;
                    p.type = typeObj;
                    p.index = i;
                    // build typesData object - no duplicates
                    if (!typesData.hasOwnProperty(t)) {
                        typesData[t] = typeObj;
                        this.types.push(typeObj);
                    }
                    console.log(prjs[i]);
                }
                this.projects = prjs;
                if (this._first === '0') {
                    cur = 0;
                } else {
                    for (i = 0; i < this.projects.length; i++) {
                        if (this.projects[i].id === this._first) {
                            cur = i;
                            break;
                        }
                    }
                }
                console.log('cur', cur, 'first', this._first);
                console.log('types', this.types);
                console.log('projects', this.projects);
                this._updateIndex();
            },
                error => this.errorMessage = <any>error
            );
    }

    ngOnDestroy() {
        if (tl) {
            tl.kill();
        }
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (!this._ready) { return; }
        clearTimeout(to);
        to = this._window.setTimeout(() => {
            TweenLite.to(this._window, 0.6, { scrollTo: { y: rt - ot, autoKill: true }, ease: Sine.easeOut });
        }, 100);
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
                console.log('do tween');
            }
        }
    }

    private _build() {
        console.log('PortfolioComponent.build()');
        // set .project-type rotation
        TweenLite.set('.project-type', { rotationX: 90, transformOrigin: 'center center', display: 'block' });
        // set .project-role rotation
        TweenLite.set('.project-role', { rotationX: 90, transformOrigin: 'center center', display: 'block' });
        // set .project-info rotation
        TweenLite.set('.project-info', { rotationY: 90, transformOrigin: 'top left', display: 'block' });
        // build timeline
        tl = new TimelineMax({ paused: true });
        l = this.projects.length;
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
        // animate in current project
        TweenLite.to('#image-holder', t, { marginTop: '0em', visibility: 'visible', ease: Power3.easeOut,
            onComplete: () => {
                console.log(this.images[0]);
                ot = this.images[0].nativeElement.offsetTop;
                rt = this.images[cur].nativeElement.offsetTop; console.log(this.images[cur], cur, rt, ot);
                this._ready = true;
                timeScale = Math.abs(tl.time() - tl.getLabelTime(this._first));
                timeScale = timeScale / 0.6;
                tl.timeScale(timeScale);
                /* this._updateIndex(); */
                TweenLite.to(this._window, 0.6, { scrollTo: { y: rt, autoKill: true }, ease: Sine.easeOut });
                tl.tweenTo(this._first, { ease: Sine.easeOut });
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
        console.log('_updateIndex', this.index, 'curID', this.curID);
    }

    public goTo(indx, delay = 0) {
        rt = this.images[indx].nativeElement.offsetTop;
        TweenLite.to(this._window, 0.6 + (Math.abs(indx - cur) * 0.06),
            { scrollTo: { y: rt - ot, autoKill: true }, ease: Power2.easeOut, delay: delay });
    }

}
