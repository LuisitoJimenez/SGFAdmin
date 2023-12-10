import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubsMgmtComponent } from './clubs-mgmt.component';

describe('ClubsMgmtComponent', () => {
  let component: ClubsMgmtComponent;
  let fixture: ComponentFixture<ClubsMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubsMgmtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClubsMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
