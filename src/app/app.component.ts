import { Component } from '@angular/core';
/* import { Title } from '@angular/platform-browser'; */

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'app';
    public constructor(/* private titleService: Title */) { }

    /* public setTitle(newTitle: string) {
        console.log('newTitle', newTitle);
        this.titleService.setTitle(newTitle);
    } */
}
