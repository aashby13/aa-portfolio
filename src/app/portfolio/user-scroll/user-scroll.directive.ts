import { Directive, Output, HostListener, EventEmitter } from '@angular/core';

/*
  this directive adds a scroll delta threshold to pass
  before scrolling is allowed: i.e. 65px
*/
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
    this.delta = e.wheelDelta || -e.detail;
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
