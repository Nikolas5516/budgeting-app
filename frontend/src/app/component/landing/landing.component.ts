import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  standalone: true,
  imports: [ButtonModule, CommonModule]
})
export class LandingComponent {
  constructor(private router: Router) {}

  onGetStarted(): void {
    this.router.navigate(['/login']);
  }

  menuItems = [
    {label: 'Home', icon: 'pi pi-home', active: false},
    {label: 'User', icon: 'pi pi-user', active: false},
    {label: 'Shared Account', icon: 'pi pi-users', active: false},
    {label: 'Incomes', icon: 'pi pi-dollar', active: false},
    {label: 'Expenses', icon: 'pi pi-minus-circle', active: false},
    {label: 'Payments', icon: 'pi pi-credit-card', active: false},
    {label: 'Savings', icon: 'pi pi-money-bill', active: false},
    {label: 'Settings', icon: 'pi pi-cog', active: false},
    {label: 'Help', icon: 'pi pi-question-circle', active: false},
    {label: 'Log out', icon: 'pi pi-sign-out', active: false}
  ];
}
