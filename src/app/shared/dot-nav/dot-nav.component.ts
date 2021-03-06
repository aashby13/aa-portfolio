import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DotNavItemData } from 'src/app/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dot-nav',
  templateUrl: './dot-nav.component.html',
  styleUrls: ['./dot-nav.component.scss']
})
export class DotNavComponent implements OnInit, OnDestroy {

  curIndex: number;
  items: DotNavItemData[];
  seg: string;
  private sub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.items = this.route.snapshot.data.jsonData;
    this.findLastSeg();
    this.sub = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.findLastSeg();
        setTimeout(() => {
          this.findLastSeg();
        }, 1000);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private findLastSeg() {
    this.items.forEach((item, i) => this.router.url.includes(item.path) ? this.curIndex = i : null);
    this.seg = this.router.url.split(this.items.find(item => this.router.url.includes(item.path)).path + '/')[1] || null;
    /* console.log(this.seg, this.curIndex); */
  }

}
