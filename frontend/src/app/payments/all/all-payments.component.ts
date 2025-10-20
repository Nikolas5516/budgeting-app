import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {SidebarPaymentComponent} from '../sidebar/sidebar.component';
import {MenuService} from '../services/menu.service';
import { PaymentService, Payment } from '../services/payments.service';



@Component({
  selector: 'app-all-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, SidebarPaymentComponent],
  templateUrl: './all-payments.component.html',
  styleUrls: ['./all-payments.component.css']
})
export class AllPaymentsComponent {
  constructor(/*private paymentsService: PaymentService,*/ private router: Router, private menuService: MenuService) {
   // this.loadPayments();
  }
  payments: Payment[] =[];

  filterDate: string = '';
  filterName: string = '';
  filterStatus: string = '';


  //loadPayments(): void {
    //this.paymentsService.getAll().subscribe({
      //next: (data) => this.payments = data,
      //error: (err) => console.error('Failed to load payments', err)
    //});
  //}

  editPayment(payment: Payment) {
    if (!payment) return;
    this.router.navigate(['/edit-payments'], { state: { payment } });
  }

  goToAddPayment() {
    this.router.navigate(['/add-payments']);
  }

 // deletePayment(payment: Payment): void {
   // if (confirm('Are you sure you want to delete this payment?')) {
      //this.paymentsService.delete(payment.id!).subscribe({
     //   next: () => this.loadPayments(),
        //error: (err) => console.error('Failed to delete payment', err)
      //});
    //}
  //}

  filteredPayments(): Payment[] {
    return this.payments.filter(p => {
      const matchDate = !this.filterDate || p.payment_date === this.filterDate;
      const matchName = !this.filterName || p.name.toLowerCase().includes(this.filterName.toLowerCase());
      const matchStatus = !this.filterStatus || p.status === this.filterStatus;
      return matchDate && matchName && matchStatus;
    });
  }


  onMenuSelect(label: string) {
    this.menuService.navigate(label);
  }

  }
