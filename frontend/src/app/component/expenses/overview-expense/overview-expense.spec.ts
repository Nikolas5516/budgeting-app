// typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewExpenseComponent } from './overview-expense';

describe('OverviewExpenseComponent', () => {
  let component: OverviewExpenseComponent;
  let fixture: ComponentFixture<OverviewExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewExpenseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
