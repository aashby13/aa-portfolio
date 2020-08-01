import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { GhostDragService } from '../ghost-drag-service/ghost-drag.service';
import { Subscription } from 'rxjs';
import { gsap, Draggable } from 'gsap/all';

@Component({
  selector: 'app-ghost-drag',
  templateUrl: './ghost-drag.component.html',
  styleUrls: ['./ghost-drag.component.scss']
})
export class GhostDragComponent implements OnInit, OnDestroy {

  @ViewChild('dragger', { static: true }) dragger: ElementRef;
  show = false;

  private subs: Subscription[];
  private drag: Draggable;
  private touching = false;
  private dragging = false;

  @HostListener('window: touchstart', ['$event'])
  onDown(e: TouchEvent) {
    /* this.onEnable(true); */
    /* console.log('touchstart'); */
    this.show = true ;
  }

  @HostListener('window: touchend', ['$event'])
  onUp(e: TouchEvent) {
    /* console.log('touchend'); */
    /* this.onEnable(false); */
    this.touching = false;
    this.show = false;
  }

  @HostListener('window: touchmove', ['$event'])
  onMove(e: TouchEvent) {
    /* console.log('window: touchmove'); */
    if (!this.touching) {
      this.onStartDrag(e);
      this.touching = true;
    }

  }

  constructor(private service: GhostDragService) {
    gsap.registerPlugin(Draggable);
   }

  ngOnInit() {
    this.subs = [
      this.service.vars$.subscribe(vars => this.onVars(vars)),
      this.service.enable$.subscribe(boo => this.onEnable(boo)),
      this.service.set$.subscribe(vars => this.onSet(vars)),
      this.service.startDrag$.subscribe(e => this.onStartDrag(e))
    ];
  }

  ngOnDestroy() {
    if (this.drag) this.drag.kill();
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private onVars(vars: any) {
    this.drag = Draggable.create(this.dragger.nativeElement, vars)[0];
  }

  private onEnable(b: boolean) {
    this.show = b;
    this.drag.enabled(b);
  }

  private onSet(vars: any) {
    gsap.set(this.dragger.nativeElement, vars);
  }

  private onStartDrag(e: MouseEvent | TouchEvent | PointerEvent) {
    this.drag.startDrag(e);
  }

}
