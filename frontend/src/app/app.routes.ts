import {Routes} from '@angular/router';
import {LoginComponent} from './component/login/login.component';
import {DashboardComponent} from './component/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import {RegisterComponent} from './component/register/register.component';

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
  }
];
