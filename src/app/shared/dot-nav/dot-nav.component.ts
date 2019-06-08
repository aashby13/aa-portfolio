import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotNavItemData } from 'src/app/models';

@Component({
  selector: 'app-dot-nav',
  templateUrl: './dot-nav.component.html',
  styleUrls: ['./dot-nav.component.scss']
})
export class DotNavComponent implements OnInit {

  index = 0;
  items: DotNavItemData[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.items = this.route.snapshot.data.jsonData;
  }

}
