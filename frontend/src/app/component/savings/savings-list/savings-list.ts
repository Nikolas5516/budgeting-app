import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SavingDTO, SavingService, UserControllerService } from '../../../api';
import { TokenService } from '../../../services/token.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-savings-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TableModule,
    ButtonModule,
    DatePickerModule,
    InputTextModule,
    SidebarComponent
  ],
  templateUrl: './savings-list.html',
  styleUrl: './savings-list.css'
})
export class SavingsList implements OnInit {

  savings: SavingDTO[] = [];
  filteredSavings: SavingDTO[] = [];

  filterDate: string = '';
  filterGoal: string = '';
  loading = false;
  private userId?: number;

  constructor(
      private savingService: SavingService,
      private userService: UserControllerService,
      private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const email = this.tokenService.getEmailFromToken();
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user) => {
          this.userId = user.id;
          this.loadSavings();
        },
        error: (err) => console.error('Error loading user:', err)
      });
    }
  }

  loadSavings(): void {
    const userId = this.userId;
    this.loading = true;
    this.savingService.getAllSavings().subscribe({
      next: (data) => {
        this.savings = data.filter(s => s.userId === userId);
        this.filteredSavings = data.filter(s => s.userId === userId);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading savings:', err);
        this.loading = false;
      }
    });
  }

  filterSavings(): void {
    const dateFilter = this.filterDate
        ? new Date(this.filterDate).toISOString().split('T')[0]
        : '';

    const goalFilter = this.filterGoal?.toLowerCase().trim() ?? '';

    this.filteredSavings = this.savings.filter(saving => {
      const savingDate = saving.date?.split('T')[0];
      const matchesDate = dateFilter ? savingDate === dateFilter : true;
      const matchesGoal = goalFilter ? (saving.goal?.toLowerCase().includes(goalFilter) ?? false) : true;
      return matchesDate && matchesGoal;
    });
  }

  deleteSaving(id: number): void {
    if (confirm('Are you sure you want to delete this saving?')) {
      this.savingService.deleteSaving(id).subscribe({
        next: () => {
          this.savings = this.savings.filter(s => s.id !== id);
          this.filteredSavings = this.filteredSavings.filter(s => s.id !== id);
        },
        error: (err: any) => console.error('Error deleting saving:', err)
      });
    }
  }
}
