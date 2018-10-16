import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectData } from './interfaces/project-data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  errorMessage: string;
  title: string;
  projectTitles: {[key: string]: string};

  constructor (
    private titleService: Title,
    private router: Router) {
      this.router.events.subscribe( e => {
      if (e instanceof ActivationEnd) {
        this.setTitle(e.snapshot);
      }
    }

  private setTitle(snapshot: ActivatedRouteSnapshot) {
    this.title = snapshot.data.title;
    if (snapshot.url[0].path === 'portfolio') {
      if (!this.projectTitles) {
        this.projectTitles = {};
        snapshot.data.projectsData.projects.forEach( (proj: ProjectData) => {
          this.projectTitles[proj.id] = proj.name;
        });
      }
      this.title += ` [ ${this.projectTitles[snapshot.params.id]} ]`;
    }
    this.titleService.setTitle(this.title);
  }
}
