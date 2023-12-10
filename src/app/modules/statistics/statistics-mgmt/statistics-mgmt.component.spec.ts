import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsMgmtComponent } from './statistics-mgmt.component';

describe('StatisticsMgmtComponent', () => {
  let component: StatisticsMgmtComponent;
  let fixture: ComponentFixture<StatisticsMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsMgmtComponent]
    });
    fixture = TestBed.createComponent(StatisticsMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
