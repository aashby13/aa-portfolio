import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  private window = window;

  constructor() { }

    get nativeWindow(): Window {
        return this.window;
    }
}
