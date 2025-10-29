import {Routes} from '@angular/router';
import {LoginComponent} from './component/login/login.component';
import {AuthGuard} from './guards/auth.guard';
import {RegisterComponent} from './component/register/register.component';
import {IncomeListComponent} from './component/incomes/income-list/income-list';
import {AddIncomeComponent} from './component/incomes/add-income/add-income';
import {IncomeComponent} from './component/incomes/income_overview/income';
import {UserComponent} from './component/user-ui/user.component';
import { LandingComponent } from './component/landing/landing.component';

export const routes: Routes = [
  {path: '', redirectTo: '/landing-page', pathMatch: 'full'},
  {path: 'landing-page', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  { path: 'income', component: IncomeComponent , canActivate: [AuthGuard]},
  { path: 'income/list', component: IncomeListComponent , canActivate: [AuthGuard]},
  { path: 'income/add', component: AddIncomeComponent , canActivate: [AuthGuard]},
  { path: 'income/edit/:id', component: AddIncomeComponent , canActivate: [AuthGuard]},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
];
