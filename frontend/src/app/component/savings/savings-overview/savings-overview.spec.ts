import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsOverview } from './savings-overview';

describe('SavingsOverview', () => {
  let component: SavingsOverview;
  let fixture: ComponentFixture<SavingsOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
