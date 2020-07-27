import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-player-launch-btn',
  templateUrl: './player-launch-btn.component.html',
  styleUrls: ['./player-launch-btn.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayerLaunchBtnComponent implements OnInit {

  private rootPath: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.rootPath = this.route.snapshot.data.rootPath;
  }

  onClick() {
    // tslint:disable-next-line: max-line-length
    this.router.navigate([this.router.url.split(this.rootPath)[1].split('/')[0], this.route.snapshot.data.link], { relativeTo: this.route });
  }

}
