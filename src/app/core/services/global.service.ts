import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  bodyClass1$ = new BehaviorSubject<string>(null);
  bodyClass2$ = new BehaviorSubject<string>(null);
  imageScrollEnabled$ = new BehaviorSubject<boolean>(null);

  private class1: string;
  private class2: string;

  constructor() {
    this.bodyClass1$.subscribe(cls => {
      this.class1 = cls;
      this.setClassName();
    });

    this.bodyClass2$.subscribe(cls => {
      this.class2 = cls;
      this.setClassName();
    });
   }

   private setClassName() {
     document.body.className = this.class1 ? (this.class2 ? `${this.class1} ${this.class2}` : this.class1) : this.class2 || null ;
   }

}
