import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefereesMgmtComponent } from './referees-mgmt.component';

describe('RefereesMgmtComponent', () => {
  let component: RefereesMgmtComponent;
  let fixture: ComponentFixture<RefereesMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefereesMgmtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RefereesMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
