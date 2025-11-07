// frontend/src/app/component/expenses/list-expense/list-expense.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllExpensesComponent } from './list-expense';

describe('AllExpensesComponent', () => {
  let component: AllExpensesComponent;
  let fixture: ComponentFixture<AllExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllExpensesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
