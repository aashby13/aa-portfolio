import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotNavComponent } from './dot-nav.component';

describe('DotNavComponent', () => {
  let component: DotNavComponent;
  let fixture: ComponentFixture<DotNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
