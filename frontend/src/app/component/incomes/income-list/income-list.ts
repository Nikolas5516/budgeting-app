import { Component, OnInit } from '@angular/core';
import {IncomeDTO, UserControllerService} from '../../../api';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import {IncomeControllerService} from '../../../api';
import {CommonModule} from '@angular/common';
import {TokenService} from '../../../services/token.service';

@Component({
  selector: 'app-income-list',
  templateUrl: 'income-list.html',
  imports: [
    RouterLink,
    FormsModule,
    ButtonModule,
    TableModule,
    DatePickerModule,
    InputTextModule,
    CommonModule,
  ],
  styleUrls: ['income-list.css']
})
export class IncomeListComponent implements OnInit {

  incomes: IncomeDTO[] = [];
  filteredIncomes: IncomeDTO[] = [];

  filterDate: string = '';
  filterSource: string = '';
  loading = false;
  private userId?: number;

 constructor(private incomeService: IncomeControllerService,
             private userService: UserControllerService,
             private tokenService: TokenService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadIncomes();
  }

  private loadCurrentUser(): void {
    const email = this.tokenService.getEmailFromToken();
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user) => {
          this.userId = user.id;
        },
        error: (err) => console.error('Error loading user:', err)
      });
    }
  }


  loadIncomes(): void {
    const userId = this.userId;
    this.loading = true;
    this.incomeService.getAllIncomes().subscribe({
      next: (data) => {
        this.incomes = data.filter(i => i.userId === userId);
        this.filteredIncomes = data.filter(i => i.userId === userId);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading incomes:', err);
        this.loading = false;
      }
    });
  }

  filterIncomes(): void {
    const dateFilter = this.filterDate
      ? new Date(this.filterDate).toISOString().split('T')[0]
      : '';

    const sourceFilter = this.filterSource?.toLowerCase().trim() ?? '';

    this.filteredIncomes = this.incomes.filter(income => {
      const incomeDate = income.date?.split('T')[0];
      const matchesDate = dateFilter ? incomeDate === dateFilter : true;
      const matchesSource = sourceFilter ? (income.source?.toLowerCase().includes(sourceFilter) ?? false) : true;
      return matchesDate && matchesSource;
    });
  }
  deleteIncome(id: number): void {
    if (confirm('Are you sure you want to delete this income?')) {
      this.incomeService.deleteIncome(id).subscribe( {
        next:()=> {
          this.incomes = this.incomes.filter(i => i.id !== id);
          this.filteredIncomes = this.filteredIncomes.filter(i => i.id !== id);
        },
        error: (err: any) => console.error('Error deleting income:', err)
      });
    }
  }

}
