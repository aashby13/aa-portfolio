import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostDragComponent } from './ghost-drag.component';

describe('GhostDragComponent', () => {
  let component: GhostDragComponent;
  let fixture: ComponentFixture<GhostDragComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhostDragComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhostDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
