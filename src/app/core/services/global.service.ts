import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  bodyClass$ = new BehaviorSubject<string>(null);
  imageScrollEnabled$ = new BehaviorSubject<boolean>(null);

  constructor() {
    this.bodyClass$.subscribe(cls => document.body.className = cls);
   }

}
