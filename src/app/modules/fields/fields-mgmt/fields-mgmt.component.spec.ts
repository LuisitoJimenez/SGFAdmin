import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsMgmtComponent } from './fields-mgmt.component';

describe('FieldsMgmtComponent', () => {
  let component: FieldsMgmtComponent;
  let fixture: ComponentFixture<FieldsMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsMgmtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FieldsMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
