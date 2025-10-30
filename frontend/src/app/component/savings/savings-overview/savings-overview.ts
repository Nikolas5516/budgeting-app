import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SavingService, SavingDTO } from '../../../api';
import { CommonModule } from '@angular/common';
import {SidebarComponent} from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-savings-overview',
  standalone: true,
  imports: [
    RouterLink,
    ChartModule,
    ButtonModule,
    CardModule,
    CommonModule,
    SidebarComponent
  ],
  templateUrl: './savings-overview.html',
  styleUrls: ['./savings-overview.css']
})
export class SavingsOverview implements OnInit {
  savings: SavingDTO[] = [];
  totalSavings = 0;
  emergencyFund = 0;
  retirement = 0;
  otherSavings = 0;
  recentTransactions: any[] = [];

  chartData: any;
  chartOptions: any;

  constructor(private savingService: SavingService) {}

  ngOnInit() {
    this.loadSavings();
  }

  loadSavings(): void {
    this.savingService.getAllSavings().subscribe({
      next: (data: any) => {
        this.savings = Array.isArray(data) ? data : [];

        this.totalSavings = this.savings.reduce(
          (sum: number, saving: SavingDTO) => sum + (saving.amount ?? 0),
          0
        );

        // Categorii de savings bazate pe goal
        this.emergencyFund = this.savings
          .filter(s => s.goal?.toLowerCase().includes('emergency'))
          .reduce((sum, s) => sum + (s.amount ?? 0), 0);

        this.retirement = this.savings
          .filter(s => s.goal?.toLowerCase().includes('retirement'))
          .reduce((sum, s) => sum + (s.amount ?? 0), 0);

        this.otherSavings = this.savings
          .filter(s =>
            !s.goal?.toLowerCase().includes('emergency') &&
            !s.goal?.toLowerCase().includes('retirement')
          )
          .reduce((sum, s) => sum + (s.amount ?? 0), 0);

        // Recent 3 transactions
        this.recentTransactions = [...this.savings]
          .sort((a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime())
          .slice(0, 3);

        this.setupChart();
      },
      error: (err) => console.error('Error loading savings:', err)
    });
  }

  private setupChart(): void {
    this.chartData = {
      labels: ['Emergency', 'Retirement', 'Other'],
      datasets: [
        {
          label: 'Savings by Category',
          data: [this.emergencyFund, this.retirement, this.otherSavings],
          backgroundColor: ['#7c3aed', '#a78bfa', '#f472b6'],
          borderRadius: 6,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#000000',
            font: { weight: 500 },
          },
          grid: {
            color: 'transparent',
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: '#000000',
            stepSize: 500,
          },
          grid: {
            color: '#e5e7eb',
            drawBorder: false,
          },
        },
      },
    };
  }

  deleteTransaction(id?: number) {
    if (!id) return;

    if (confirm('Are you sure you want to delete this saving?')) {
      this.savingService.deleteSaving(id).subscribe(() => {
        this.savings = this.savings.filter(s => s.id !== id);
        this.loadSavings();
      });
    }
  }

  // Determină iconița bazată pe goal
  getIconClass(goal?: string): string {
    if (!goal) return 'pi-wallet';

    const goalLower = goal.toLowerCase();
    if (goalLower.includes('emergency')) return 'pi-shield';
    if (goalLower.includes('retirement')) return 'pi-briefcase';
    return 'pi-gift';
  }
}
