import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsMgmtComponent } from './teams-mgmt.component';

describe('TeamsMgmtComponent', () => {
  let component: TeamsMgmtComponent;
  let fixture: ComponentFixture<TeamsMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamsMgmtComponent]
    });
    fixture = TestBed.createComponent(TeamsMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
