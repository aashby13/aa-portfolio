import { Directive, Output, Input, HostListener, EventEmitter } from '@angular/core';


@Directive({
    selector: '[appUserScroll]'
})
export class UserScrollDirective {

    @Output() mouseWheelUp = new EventEmitter();
    @Output() mouseWheelDown = new EventEmitter();

    delta = 0;
    thresh = 65;

    @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
        this.mouseWheelFunc(event);
    }

    @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
        this.mouseWheelFunc(event);
    }

    @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
        this.mouseWheelFunc(event);
    }

    mouseWheelFunc(e: any) {
        const event = e;
        this.delta = event.wheelDelta || -event.detail;
        /* console.log('delta', this.delta); */
        if (this.delta > this.thresh) {
            this.mouseWheelUp.emit({ delta: this.delta });
        } else if (this.delta < -this.thresh) {
            this.mouseWheelDown.emit({ delta: this.delta });
        }
        // for IE
        event.returnValue = false;
        // for Chrome and Firefox
        if (event.preventDefault) {
            event.preventDefault();
        }
    }

}
