import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, UrlSegment } from '@angular/router';
import { TweenLite, Power2 } from 'gsap/all';
import { ThrowPropsPlugin } from 'src/gsap-bonus/ThrowPropsPlugin';
import { Subscription } from 'rxjs';
import { ScrollImageItemData } from 'src/app/models';
import { GhostDragService } from '../ghost-drag-service/ghost-drag.service';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-image-scroll',
  templateUrl: './image-scroll.component.html',
  styleUrls: ['./image-scroll.component.scss']
})
export class ImageScrollComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('holder', { static: true }) holder: ElementRef;

  items: ScrollImageItemData[];
  ready = false;

  private curID: string;
  private curIndex: number;
  private end: number[];
  private newIndex: number;
  private thresh: number;
  private subs: Subscription[];
  private urlArr: string[];
  private scrollEnabled: boolean;

  @HostListener('window:mousewheel', ['$event'])
  onMouseWheel(e: WheelEvent) {
    if (/* this.scrollEnabled &&  */Math.abs(e.deltaY) > 10) {
      TweenLite.to(this.holder.nativeElement, 1, {
        throwProps: {
          y: {
            velocity: -e.deltaY * 8,
            end: this.end
          },
        },
        ease: Power2.easeOut,
        onUpdate: () => this.onTweenUpdate(),
        onComplete: () => this.globalService.bodyClass1$.next(this.curID)
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event) {
    this.setEnd();
    this.goToCurrent(true);
  }

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private dragService: GhostDragService,
      private globalService: GlobalService,
      private zone: NgZone
    ) {
    ThrowPropsPlugin.defaultResistance = 500;
  }

  ngOnInit() {
    this.items = this.route.snapshot.data.jsonData;
    this.subs = [
      /* this.globalService.imageScrollEnabled$.subscribe(b => this.scrollEnabled = b), */
      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.goToCurrent();
        }
      })
    ];
  }

  ngOnDestroy() {
    this.globalService.bodyClass1$.next(null);
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit() {
    this.setEnd();
    this.goToCurrent(true);
    setTimeout(() => {
      const self = this;
      this.ready = true;
      this.dragService.vars$.next({
        type: 'y',
        throwProps: true,
        snap: this.end,
        throwResistance: 0,
        maxDuration: 4.5,
        minDuration: 0.5,
        // tslint:disable-next-line:object-literal-shorthand
        onDrag: function() {
          self.onDrag(this.y);
        },
        onDragEnd: () => this.dragService.enable$.next(false),
        // tslint:disable-next-line:object-literal-shorthand
        onThrowUpdate: function() {
          self.onThrowUpdate(this.y);
        }
      });
    }, 200);
  }

  private goToCurrent(set = false) {
    this.router.url.split('/')
      .filter(s => s !== '')
      .forEach(s => {
        const obj = this.items.find(itm => itm.id === s);
        if (obj) {
          this.curID = obj.id;
          this.newIndex = obj.index;
        }
      });
    /* console.log(this.curID, this.newIndex); */
    this.dragService.set$.next({ y: this.end[this.newIndex] });
    if (set) {
      TweenLite.set(this.holder.nativeElement, { y: this.end[this.newIndex],
        onComplete: () => this.globalService.bodyClass1$.next(this.curID) });
    } else {
      TweenLite.to(this.holder.nativeElement,
        0.6 + (Math.abs(this.curIndex - this.newIndex) * 0.06),
        {
          y: this.end[this.newIndex],
          ease: Power2.easeOut,
          onComplete: () => this.globalService.bodyClass1$.next(this.curID)
        }
      );
    }
    this.curIndex = this.newIndex;
  }

  private setEnd() {
    this.end = [];
    const itemHeight = this.holder.nativeElement.clientHeight / this.items.length;
    this.items.forEach((item, i) => {
      this.end.push(-itemHeight * i);
    });
    this.thresh = Math.round(itemHeight / 8);
  }

  private onTweenUpdate() {
    this.newIndex = this.end.findIndex(num =>
      Math.abs(num - this.holder.nativeElement._gsTransform.y) < this.thresh
    );
    //
    if (this.newIndex !== -1 && this.items[this.newIndex].id !== this.curID) {
      this.curIndex = this.newIndex;
      this.curID = this.items[this.curIndex].id;
      this.urlArr = this.router.url.split('/')
        .filter(s => s !== '')
        .map(s => this.items.find(itm => itm.id === s) ? this.curID : s);
      /* console.log(this.urlArr); */
      this.zone.run(this.router.navigateByUrl, this.router, [`/${this.urlArr.join('/')}`]);
    }
  }

  private onDrag(y: number) {
    TweenLite.set(this.holder.nativeElement, { y });
    this.zone.run(this.onTweenUpdate, this);
  }

  private onThrowUpdate(y: number) {
    TweenLite.set(this.holder.nativeElement, { y });
    this.zone.run( this.onTweenUpdate, this );
  }

}
