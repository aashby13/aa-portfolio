import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GhostDragService {

  vars$ = new Subject<any>();
  enable$ = new Subject<boolean>();
  set$ = new BehaviorSubject<any>(null);
  startDrag$ = new Subject<MouseEvent | TouchEvent | PointerEvent>();

  constructor() { }

}
