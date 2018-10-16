import { Component, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Power3, Back, TimelineLite } from 'gsap';

@Component({
  selector: 'app-main-menu',
  template: `
    <nav>
      <ul>
        <li routerLinkActive="active"><a #links [routerLink]="['portfolio']">portfolio</a></li>
		    <li routerLinkActive="active"><a #links [routerLink]="['about']">about</a></li>
		    <li routerLinkActive="active"><a #links [routerLink]="['contact']">contact</a></li>
      </ul>
      <div #line class="line"></div>
    </nav>`,
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements AfterViewInit {

  @ViewChild('line') line: ElementRef;
  @ViewChildren('links') links: QueryList<ElementRef>;

  private lineWidth: number;
  private linksObj = {};
  id: string;

  constructor(
    private _router: Router) { }

  ngAfterViewInit() {
    this.links.forEach(el => {
      const id = el.nativeElement.innerHTML;
      this.linksObj[id] = el;
    });

    this._router.events.subscribe(e => {
      if (e instanceof ActivationEnd) {
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
      .to(this.line.nativeElement, 0.45, { y: -this.linksObj[this.id].nativeElement.offsetLeft, ease: Back.easeOut }, 0);
  }

}
