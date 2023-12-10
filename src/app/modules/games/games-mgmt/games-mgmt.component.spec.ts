import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesMgmtComponent } from './games-mgmt.component';

describe('GamesMgmtComponent', () => {
  let component: GamesMgmtComponent;
  let fixture: ComponentFixture<GamesMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GamesMgmtComponent]
    });
    fixture = TestBed.createComponent(GamesMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
