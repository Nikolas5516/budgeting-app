import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthControllerService } from '../../api';
import { TokenService } from '../../services/token.service';
import { FormUtilsService } from '../../services/form-utils.service';
import { HttpResponseService } from '../../services/http-response.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
  ],
})
export class LoginComponent {
  email = '';
  password = '';

  isLoading = false;
  errorMessage = '';

  constructor(
    private authController: AuthControllerService,
    private tokenService: TokenService,
    private router: Router,
    private formUtils: FormUtilsService,
    private httpResponseService: HttpResponseService,
  ) {
  }

  onSubmit(): void {
    const validation = this.formUtils.validateLoginForm(this.email, this.password);
    if (!validation.isValid) {
      this.errorMessage = Object.values(validation.errors)[0];
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = { email: this.email.trim(), password: this.password };

    this.authController.login(credentials).subscribe({
      next: (response) => {
        this.handleLoginSuccess(response);
      },
      error: (error) => {
        this.handleLoginError(error);
      },
    });
  }

  // Validation moved to FormUtilsService

  /**
   * Handles successful login
   * @param response - Authentication response
   */
  private async handleLoginSuccess(response: any): Promise<void> {
    this.isLoading = false;
    this.errorMessage = '';

    try {
      let parsedResponse;
      if (response instanceof Blob) {
        const text = await response.text();
        parsedResponse = JSON.parse(text);
      } else {
        parsedResponse = response;
      }
      const token = (parsedResponse as any)?.token;

      if (token) {
        this.tokenService.setToken(token);
        await this.router.navigate(['/user']);
      } else {
        this.errorMessage = 'No authentication token received';
      }
    } catch (error) {
      this.errorMessage = 'Failed to process login response';
    }
  }

  /**
   * Handles login errors
   * @param error - Authentication error
   */
  private async handleLoginError(error: any): Promise<void> {
    this.isLoading = false;

    try {
      this.errorMessage = await this.httpResponseService.handleError(error, 'Login failed. Please try again.');
    } catch {
      this.errorMessage = 'Login failed. Please try again.';
    }

    this.password = '';
  }

}
