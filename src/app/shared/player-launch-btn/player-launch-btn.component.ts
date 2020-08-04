import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TweenLite, Power2 } from 'gsap/all';
import { MorphSVGPlugin } from 'src/gsap-bonus/MorphSVGPlugin';

@Component({
  selector: 'app-player-launch-btn',
  templateUrl: './player-launch-btn.component.html',
  styleUrls: ['./player-launch-btn.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayerLaunchBtnComponent implements OnInit {

  @ViewChild('play', {static: true}) playEl: ElementRef;
  @ViewChild('close', {static: true}) closeEl: ElementRef;
  @ViewChild('more', {static: true}) moreEl: ElementRef;

  message = 'more';

  private urlArr: string[];
  private link: string;
  private linkIndex: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    MorphSVGPlugin.defaultType = 'linear';
  }

  ngOnInit(): void {
    this.link = this.route.snapshot.data.link;
    this.urlArr = this.router.url.split('/').filter(s => s !== '');
    this.linkIndex = this.urlArr.indexOf(this.link);
    if (this.linkIndex !== -1) this.setBtn('less');
  }

  onClick(e: Event) {
    console.log(e);
    this.urlArr = this.router.url.split('/').filter(s => s !== '');
    this.linkIndex = this.urlArr.indexOf(this.link);
    if (this.linkIndex !== -1) {
      // close
      this.urlArr = this.urlArr.slice(0, this.linkIndex);
      this.setBtn('more');
    } else {
      // open link
      this.urlArr.push(this.link);
      this.setBtn('less');
    }
    /* console.log(this.urlArr); */
    this.router.navigate(this.urlArr);
    return false;
  }

  private setBtn(msg: string) {
    this.message = msg;
    if (this.message === 'more') {
      TweenLite.to(this.playEl.nativeElement, 0.6, { morphSVG: this.playEl.nativeElement, ease: Power2.easeOut });
      TweenLite.to(this.moreEl.nativeElement, 0.6, { x: 0, ease: Power2.easeOut });
    } else {
      TweenLite.to(this.playEl.nativeElement, 0.6, { morphSVG: this.closeEl.nativeElement, ease: Power2.easeOut });
      TweenLite.to(this.moreEl.nativeElement, 0.6, { x: -28, ease: Power2.easeOut });
    }
  }

}
