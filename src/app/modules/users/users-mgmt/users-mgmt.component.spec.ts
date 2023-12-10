import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMgmtComponent } from './users-mgmt.component';

describe('UsersMgmtComponent', () => {
  let component: UsersMgmtComponent;
  let fixture: ComponentFixture<UsersMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersMgmtComponent]
    });
    fixture = TestBed.createComponent(UsersMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
