import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersMgmtComponent } from './players-mgmt.component';

describe('PlayersMgmtComponent', () => {
  let component: PlayersMgmtComponent;
  let fixture: ComponentFixture<PlayersMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersMgmtComponent]
    });
    fixture = TestBed.createComponent(PlayersMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
