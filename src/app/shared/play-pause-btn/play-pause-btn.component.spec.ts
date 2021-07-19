import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayPauseBtnComponent } from './play-pause-btn.component';

describe('PlayPauseBtnComponent', () => {
  let component: PlayPauseBtnComponent;
  let fixture: ComponentFixture<PlayPauseBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayPauseBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayPauseBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
