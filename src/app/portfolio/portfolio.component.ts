import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import { TweenLite, TimelineMax, Sine, Cubic, Power3 } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ProjectData, ProjectTypeData, TypesData, RolesData } from '../interfaces/project-data';


@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements AfterViewInit, OnDestroy {

    projects: Array<ProjectData>;
    roles: RolesData;
    types: TypesData = {};
    index: number;
    errorMessage: string;

    private _cur = 0;
    private _tl: TimelineMax;
    private _to: NodeJS.Timer;
    private _rt: number;
    private _ot: number;
    private _i: number;
    private _l: number;
    private _images: NodeList;
    private _top: number;
    private _height: number;
    private _img: HTMLElement;
    private _timeScale: number;

    constructor(private _dataService: DataService) { }

    ngAfterViewInit() {
        CSSPlugin.defaultTransformPerspective = 4000;
        //
        this._dataService.getData()
            .subscribe(data => {
                const prjs = data.projects;
                this.roles = data.roles;
                // add id to all roles objects
                for (const key in this.roles) {
                    if (this.roles.hasOwnProperty(key)) {
                        this.roles[key].id = key;
                    }
                }
                // change project.type to ProjectTypeData object {text:string, id:string}
                for (let i = prjs.length - 1; i >= 0; i--) {
                    console.log(prjs[i]);
                    const p = prjs[i],
                        t = (p.type as string).toLowerCase().replace(/ /g, '-'),
                        typeObj = { text: p.type, id: t } as ProjectTypeData;
                    p.type = typeObj;
                    p.index = i;
                    // build types object - no duplicates
                    if (!this.types.hasOwnProperty(t)) {
                        this.types[t] = p.type;
                    }
                }
                this.projects = prjs;
                //
                /* TweenLite.delayedCall(0.1, this._build); */

            },
                error => this.errorMessage = <any>error
            );
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', this._onScroll);
        if (this._tl) {
            this._tl.kill();
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
        this._tl = new TimelineMax({ paused: true });
        this._l = this.projects.length;
        //
        for (this._i = 0; this._i < this._l; this._i++) {
            // add labels for each project .6sec apart
            this._tl.addLabel(this.projects[this._i].id, this._i * 0.6);
            //
            if (this._i < this._l - 1) {
                // anim project-info sections at label
                this._tl.to(`.project-info[data-index="${this._i}"]`, 0.3, { rotationY: -90 }, this.projects[this._i].id); // hide
                this._tl.call(this._updateIndex, null, null, this.projects[this._i].id + '+=.3');
                this._tl.to(`.project-info[data-index="${this._i + 1})"]`, 0.3, { rotationY: 0 }, this.projects[this._i].id + '+=.3'); // show
                // anim project-role sections if roles dif
                if (this.projects[this._i].role !== this.projects[this._i + 1].role) {
                    this._tl.to(`.project-role[data-role="${this.projects[this._i].role}"]`, 0.3, { rotationX: -90 }, this.projects[this._i].id); // hide
                    this._tl.to(`.project-role[data-role="${this.projects[this._i + 1].role}"]`, 0.3, { rotationX: 0 }, this.projects[this._i].id + '+=.3'); // show
                }
                // anim project-type sections if types dif
                if (this.projects[this._i].type.id !== this.projects[this._i + 1].type.id) {
                    this._tl.to(`.project-type[data-type="${this.projects[this._i].type.id}"]`, 0.3, { rotationX: -90 }, this.projects[this._i].id); // hide
                    this._tl.to(`.project-type[data-type="${this.projects[this._i + 1].type.id}"]`, 0.3, { rotationX: 0 }, this.projects[this._i].id + '+=.3'); // show
                }
            }
        }
        //
        this._images = document.querySelectorAll('.portfolio-image');
        this._ot = (this._images[this._cur] as HTMLElement).offsetTop;
        // animate in current project
        TweenLite.to(this._images[this._cur], 0.5, { 'background-position-y': '0em', ease: Power3.easeOut/*, onComplete:updateIndex*/ });
        TweenLite.to([`.project-type[data-type="${this.projects[this._cur].type.id}"]`, `.project-role[data-role="${this.projects[this._cur].role}"]`],
            0.5, { rotationX: 0, ease: Sine.easeOut });
        TweenLite.to(`.project-info[data-index="${this._cur}"]`, 0.5, { rotationY: 0, ease: Sine.easeOut });
        this._updateIndex();
        //
        window.addEventListener('scroll', this._onScroll);
    }

    private _onScroll() {
        /* console.log('onScroll()'); */
        clearTimeout(this._to);
        this._to = global.setTimeout(() => {
            TweenLite.to(window, 0.6, { scrollTo: { y: this._rt - this._ot, autoKill: true }, ease: Sine.easeOut });
        }, 100);
        //
        this._l = this._images.length;
        for (this._i = 0; this._i < this._l; this._i++) {
            this._img = this._images[this._i] as HTMLElement;
            this._top = this._img.offsetTop;
            this._height = this._img.offsetHeight / 2;
            //
            if ((this._top <= window.scrollY + this._ot + this._height && this._top >= window.scrollY + this._ot - this._height) && this._i !== this._cur) {
                this._cur = this._i;
                this._rt = this._top;
                this._timeScale = Math.abs(this._tl.time() - this._tl.getLabelTime(this._img.id));
                this._timeScale = this._timeScale / 0.6;
                this._tl.timeScale(this._timeScale);
                this._tl.tweenTo(this._img.id, { ease: Sine.easeOut });
                /* console.log('do tween'); */
            }
        }
    }

    private _updateIndex() {
        this.index = this._cur;
    }

    public goTo(indx) {
        this._rt = (this._images[indx] as HTMLElement).offsetTop;
        TweenLite.to(window, 0.6 + (Math.abs(indx - this._cur) * 0.06),
            { scrollTo: { y: this._rt - this._ot, autoKill: true }, ease: Cubic.easeOut });
    }

}
