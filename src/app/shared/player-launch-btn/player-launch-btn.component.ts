import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { gsap, MorphSVGPlugin } from 'gsap/all';

@Component({
  selector: 'app-player-launch-btn',
  templateUrl: './player-launch-btn.component.html',
  styleUrls: ['./player-launch-btn.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayerLaunchBtnComponent implements OnInit {

  message = 'more';

  private urlArr: string[];
  private link: string;
  private linkIndex: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    gsap.registerPlugin(MorphSVGPlugin);
    MorphSVGPlugin.defaultType = 'linear';
   }

  ngOnInit(): void {
    this.link = this.route.snapshot.data.link;
    this.urlArr = this.router.url.split('/').filter(s => s !== '');
    this.linkIndex = this.urlArr.indexOf(this.link);
    if (this.linkIndex !== -1) this.setBtn('less');
  }

  onClick() {
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
  }

  private setBtn(msg: string) {
    this.message = msg;
    if (this.message === 'more') {

    } else {

    }
  }

}
