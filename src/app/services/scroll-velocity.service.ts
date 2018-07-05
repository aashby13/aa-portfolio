import { Injectable } from '@angular/core';
import { Observable, fromEvent  } from 'rxjs';
import { map } from 'rxjs/operators';
import { WindowService } from '../services/window.service';
import { ScrollData } from '../interfaces/scroll-data';

@Injectable({
  providedIn: 'root'
})
export class ScrollVelocityService {

    private _window: Window;
    private vel = {curScroll: 0, prevScroll: 0, curVel: 0, prevVel: 0} as ScrollData;

    constructor(private _windowService: WindowService) {
        this._window = this._windowService.nativeWindow;
    }

    public getVelStream(): Observable<ScrollData> {
        // When we watch the DOCUMENT, we need to pull the scroll event from the
        // WINDOW, but then check the scroll offsets of the DOCUMENT.
        return fromEvent(this._window, 'scroll').pipe(
            map(
                (): ScrollData => {
                    this.vel.prevScroll = this.vel.curScroll;
                    this.vel.curScroll = this._window.pageYOffset;
                    this.vel.prevVel = this.vel.curVel;
                    this.vel.curVel =  Math.abs(this.vel.curScroll - this.vel.prevScroll) / 100;
                    this.vel.count++;
                    return this.vel;

                }
            )
        );
    }

    public reset() {
        this.vel = { curScroll: 0, prevScroll: 0, curVel: 0, prevVel: 0, count: 0 } as ScrollData;
    }

}
