import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BodyClassService {

  constructor() { }

  set(cls: string) {
    document.body.className = cls;
  }

}
