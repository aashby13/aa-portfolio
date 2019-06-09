import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { GhostDragService } from '../ghost-drag-service/ghost-drag.service';
import { Subscription } from 'rxjs';
import { Draggable, TweenLite } from 'gsap/all';
import { ThrowPropsPlugin } from 'src/gsap-bonus/ThrowPropsPlugin';

@Component({
  selector: 'app-ghost-drag',
  templateUrl: './ghost-drag.component.html',
  styleUrls: ['./ghost-drag.component.scss']
})
export class GhostDragComponent implements OnInit, OnDestroy {

  @ViewChild('dragger') dragger: ElementRef;
  show = false;

  private subs: Subscription[];
  private drag: Draggable;

  @HostListener('touchstart', ['$event'])
  onDown(e: TouchEvent) {
    this.onEnable(true);
  }

  /* @HostListener('pointerup', ['$event'])
  onUp(e: TouchEvent) {
    this.show = false;
    this.drag.endDrag(e);
  } */

  /* @HostListener('window: pointerdown', ['$event'])
  onDown(e: TouchEvent) {
    this.onStartDrag(e);
  } */

  constructor(private service: GhostDragService) { }

  ngOnInit() {
    if (this.drag) this.drag.kill();
    this.subs = [
      this.service.vars$.subscribe(vars => this.onVars(vars)),
      this.service.enable$.subscribe(boo => this.onEnable(boo)),
      this.service.set$.subscribe(vars => this.onSet(vars)),
      this.service.startDrag$.subscribe(e => this.onStartDrag(e))
    ];
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private onVars(vars: any) {
    this.drag = Draggable.create(this.dragger.nativeElement, vars)[0];
  }

  private onEnable(b: boolean) {
    this.show = b;
    this.drag.enable(b);
  }

  private onSet(vars: any) {
    TweenLite.set(this.dragger.nativeElement, vars);
  }

  private onStartDrag(e: MouseEvent | TouchEvent | PointerEvent) {
    this.show = true;
    this.drag.startDrag(e);
  }

}
