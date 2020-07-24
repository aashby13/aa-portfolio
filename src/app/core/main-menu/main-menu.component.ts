import { Component, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Power3, Back, TimelineLite, TweenLite } from 'gsap';

@Component({
  selector: 'app-main-menu',
  template: `
    <nav>
      <ul>
        <li><a #links routerLinkActive="active" [routerLink]="['portfolio']">portfolio</a></li>
		    <li><a #links routerLinkActive="active" [routerLink]="['about']">about</a></li>
		    <li><a #links routerLinkActive="active" [routerLink]="['contact']">contact</a></li>
      </ul>
      <div #line class="line"></div>
    </nav>`,
  styleUrls: ['./main-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainMenuComponent implements AfterViewInit {

  @ViewChild('line', { static: true }) line: ElementRef;
  @ViewChildren('links') links: QueryList<ElementRef>;

  private lineWidth: number;
  private linksObj = {};
  id: string;

  @HostListener('window:resize', ['$event'])
  onResize(e: Event) {
    if (this.id) {
      this.lineWidth = this.linksObj[this.id].nativeElement.clientWidth;
      TweenLite.set(this.line.nativeElement, { width: this.lineWidth, x: this.linksObj[this.id].nativeElement.offsetLeft});
    }
  }

  constructor(
    private router: Router) { }

  ngAfterViewInit() {
    this.links.forEach(el => {
      const id = el.nativeElement.innerHTML;
      this.linksObj[id] = el;
    });

    this.router.events.subscribe(e => {
      if (e instanceof ActivationEnd) {
        /* console.log(e.snapshot.url); */
        if (!e.snapshot.url[0]) return;
        const id = e.snapshot.url[0].path;
        if (this.linksObj[id] && this.id !== id) {
          this.id = id;
          this.animLine();
        }
      }
    });
  }

  private animLine() {
    this.lineWidth = this.linksObj[this.id].nativeElement.clientWidth;
    new TimelineLite()
      .to(this.line.nativeElement, 0.2, { width: this.lineWidth * 0.2, ease: Power3.easeOut }, 0)
      .to(this.line.nativeElement, 0.25, { width: this.lineWidth, ease: Back.easeOut })
      .to(this.line.nativeElement, 0.45, { x: this.linksObj[this.id].nativeElement.offsetLeft, ease: Back.easeOut }, 0);
  }

}
