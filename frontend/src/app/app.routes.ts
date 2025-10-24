import {Routes} from '@angular/router';
import {LoginComponent} from './component/login/login.component';
import {AuthGuard} from './guards/auth.guard';
import {RegisterComponent} from './component/register/register.component';
import {UserComponent} from './component/user-ui/user.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];
