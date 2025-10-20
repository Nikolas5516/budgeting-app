import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import {SidebarPaymentComponent} from '../sidebar/sidebar.component';
import {MenuService} from '../services/menu.service';

interface MenuItem {
  label: string;
  icon: string;
  active: boolean;
}

interface Transaction {
  name: string;
  date: string;
  icon: string;
  type: 'card' | 'transfer';
}

interface Tip {
  title: string;
  note: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule, SidebarPaymentComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {
  constructor(private router: Router, private menuService: MenuService) {}

  goToAllPayments() {
    this.router.navigate(['/all-payments']);
  }

  transactions: Transaction[] = [
    { name: 'Groceries', date: '2025-09-22', icon: 'pi pi-shopping-cart', type: 'card' },
    { name: 'Rent', date: '2025-09-20', icon: 'pi pi-dollar', type: 'transfer' },
    { name: 'Transport', date: '2025-09-18', icon: 'pi pi-car', type: 'card' },
  ];

  tips: Tip[] = [
    { title: 'Pay bills on time', note: '- Avoid late fees' },
    { title: 'Use cards wisely', note: '- Track your spending' },
    { title: 'Set up auto-transfers', note: '- Save time' },
    { title: 'Check statements', note: '- Spot errors quickly' },
    {title: 'Review your subscriptions', note: '- Cancel unused services'},
];

  paymentChartData = {
    labels: ['Card', 'Transfer'],
    datasets: [
      { label: 'Payments', data: [1100, 750], backgroundColor: ['#A16EFF', '#C080FF'] }
    ]
  };

  chartOptions = { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };

  onMenuSelect(label: string) {
    this.menuService.navigate(label);
  }
  editPayment(index: number) {
    const payment = this.transactions[index];
    this.router.navigate(['/edit-payments'], { state: { payment, index } });
  }
  deletePayment(index: number) {
    const payment = this.transactions[index];
    this.router.navigate(['/edit-payments'], { state: { payment, index } });
  }
}
