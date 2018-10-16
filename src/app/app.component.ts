import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivationEnd } from '@angular/router';
import { ProjectData } from './interfaces/project-data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  errorMessage: string;
  title: string;
  projectTitles: {[key: string]: string};

  constructor (
    private titleService: Title,
    private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe( e => {
      if (e instanceof ActivationEnd) {
        /* console.log(e.snapshot); */
        this.title = e.snapshot.data.title;
        if (e.snapshot.url[0].path === 'portfolio') {
          if (!this.projectTitles) {
            this.projectTitles = {};
            e.snapshot.data.projectsData.projects.forEach( (proj: ProjectData) => {
              this.projectTitles[proj.id] = proj.name;
            });
          }
          this.title += ` [ ${this.projectTitles[e.snapshot.params.id]} ]`;
        }
        this.titleService.setTitle(this.title);
      }
    });
  }
}
