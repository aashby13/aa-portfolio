import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLaunchBtnComponent } from './player-launch-btn.component';

describe('PlayerLaunchBtnComponent', () => {
  let component: PlayerLaunchBtnComponent;
  let fixture: ComponentFixture<PlayerLaunchBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerLaunchBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerLaunchBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
