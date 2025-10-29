import {Routes} from '@angular/router';
import {LoginComponent} from './component/login/login.component';
import {DashboardComponent} from './component/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import {RegisterComponent} from './component/register/register.component';
import { IncomeListComponent } from './component/incomes/income-list/income-list';
import { AddIncomeComponent } from './component/incomes/add-income/add-income';
import { IncomeComponent } from './component/incomes/income_overview/income';
import {MainLayoutComponent} from './component/main-layout/main-layout';

//import { TestComponent } from './component/test-component/test-component';
import {OverviewComponent} from './component/payments/overview-payments/overview.component';
import {AllPaymentsComponent} from './component/payments/list-payments/all-payments.component';
import {AddPaymentComponent} from './component/payments/add-payments/add-payments.component';
import {EditPaymentComponent} from './component/payments/edit-payments/edit-payments.component';
import {SidebarPaymentComponent} from './component/payments/sidebar/sidebar.component';


export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: '',
    redirectTo: 'payments',
    pathMatch: 'full'
  },
  {
    path: 'payments',
    component: OverviewComponent
  },
  {
    path: 'all-payments',
    component: AllPaymentsComponent
  },
  {
    path: 'add-payments',
    component: AddPaymentComponent
  },
  {
    path: 'edit-payments',
    component: EditPaymentComponent
  },
  {
    path: 'sidebar-payments',
    component: SidebarPaymentComponent
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: '',
    redirectTo: 'payments',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  {
      path: '',
      component: MainLayoutComponent,
      children: [
        { path: 'income', component: IncomeComponent },
        { path: 'income/list', component: IncomeListComponent },
        { path: 'income/add', component: AddIncomeComponent },
        { path: 'income/edit/:id', component: AddIncomeComponent },
        { path: '', redirectTo: '/income', pathMatch: 'full' },
    ],
  },

  //   ]
  // },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
  { path: '**', redirectTo: '/dashboard/income' },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '', redirectTo: 'income', pathMatch: 'full' },
  { path: 'income', component: IncomeComponent },
  { path: 'income/list', component: IncomeListComponent },
  { path: 'income/add', component: AddIncomeComponent },
  { path: '**', redirectTo: 'income' },
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: '',
    redirectTo: 'payments',
    pathMatch: 'full'
  },
  {
    path: 'payments',
    component: OverviewComponent
  },
  {
    path: 'all-payments',
    component: AllPaymentsComponent
  },
  {
    path: 'add-payments',
    component: AddPaymentComponent
  },
  {
    path: 'edit-payments',
    component: EditPaymentComponent
  },
  {
    path: 'sidebar-payments',
    component: SidebarPaymentComponent
  }
  { path: '**', redirectTo: '/income' },
];
