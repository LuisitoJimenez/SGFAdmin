import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsMgmtComponent } from './tournaments-mgmt.component';

describe('TournamentsMgmtComponent', () => {
  let component: TournamentsMgmtComponent;
  let fixture: ComponentFixture<TournamentsMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentsMgmtComponent]
    });
    fixture = TestBed.createComponent(TournamentsMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
