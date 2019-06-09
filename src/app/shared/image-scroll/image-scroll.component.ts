import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TweenLite, Power2 } from 'gsap/all';
import { ThrowPropsPlugin } from 'src/gsap-bonus/ThrowPropsPlugin';
import { Subscription } from 'rxjs';
import { ScrollImageItemData } from 'src/app/models';

@Component({
  selector: 'app-image-scroll',
  templateUrl: './image-scroll.component.html',
  styleUrls: ['./image-scroll.component.scss']
})
export class ImageScrollComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('holder') holder: ElementRef;

  items: ScrollImageItemData[];
  ready = false;

  private curID: string;
  private curIndex: number;
  private rootPath: string;
  private end: number[];
  private newIndex: number;
  private thresh: number;
  private sub: Subscription;
  private touching = false;
  private timeout: any;
  private curY: number;
  private prevY: number;
  private down: boolean;

  @HostListener('window:mousewheel', ['$event'])
  onMouseWheel(e: WheelEvent) {
    if (Math.abs(e.deltaY) > 10)
    TweenLite.to(this.holder.nativeElement, 1, {
      throwProps: {
        y: {
          velocity: -e.deltaY * 8,
          end: this.end
        },
      },
      ease: Power2.easeOut,
      onUpdate: () => this.onTweenUpdate()
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event) {
    this.setEnd();
    this.goToCurrent(true);
  }

  /* @HostListener('window:touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    console.log(e);
    this.timeout = setTimeout(() => {
      this.curY = e.touches[0].pageY;
      this.touching = true;
    }, 100);
  } */

  /* @HostListener('window:touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    clearTimeout(this.timeout);
    this.touching = false;
    ThrowPropsPlugin.to(this.holder.nativeElement, {
      onUpdate: () => this.onTweenUpdate(),
      throwProps: {
        y: {
          velocity: -((this.prevY - this.curY) * 4) * 12,
          resistance: 400,
          end: this.end
        }
      }}, 2, 0.8);
    this.curY = 0;
  } */

  /* @HostListener('window:touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    if (this.touching) {
      this.prevY = this.curY;
      this.curY = e.touches[0].pageY;
      this.down = this.curY < this.prevY;
      const vel = -((this.prevY - this.curY) * 4) * 10;
      console.log(this.down, vel);
      TweenLite.to(this.holder.nativeElement, 1, {
        throwProps: {
          y: {
            velocity: vel,
            end: this.end
          },
        },
        ease: Power2.easeOut,
        onUpdate: () => this.onTweenUpdate()
      });
    }
  } */

  constructor(private route: ActivatedRoute, private router: Router) {
    ThrowPropsPlugin.defaultResistance = 1000;
  }

  ngOnInit() {
    this.items = this.route.snapshot.data.jsonData;
    this.rootPath = this.route.snapshot.data.rootPath;
    this.sub = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.goToCurrent();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    this.setEnd();
    this.goToCurrent(true);
    setTimeout(() => {
      this.ready = true;
    }, 200);
  }

  private goToCurrent(set = false) {
    this.curID = this.router.url.split(this.rootPath)[1].split('/')[0];
    this.newIndex = this.items.find(obj => obj.id === this.curID).index;
    if (set) {
      TweenLite.set(this.holder.nativeElement, { y: this.end[this.newIndex] });
    } else {
      TweenLite.to(this.holder.nativeElement,
        0.6 + (Math.abs(this.curIndex - this.newIndex) * 0.06),
        { y: this.end[this.newIndex], ease: Power2.easeOut }
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
      this.router.navigateByUrl(this.rootPath + this.curID);
      console.log(this.curID);
    }
  }

}
