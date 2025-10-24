import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserControllerService } from '../../api';
import { UserDTO } from '../../api';
import { TokenService } from '../../services/token.service';
import { HttpResponseService } from '../../services/http-response.service';

@Component({
  standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  imports: [CommonModule, FormsModule]
})
export class UserComponent implements OnInit, OnDestroy {
  menuShown = false;
  isLoading = true;
  errorMessage = '';
  user: UserDTO | null = null;
  currentUserEmail = '';

  constructor(
    private userController: UserControllerService,
    private tokenService: TokenService,
    private router: Router,
    private httpResponseService: HttpResponseService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  toggleMenu(): void {
    this.menuShown = !this.menuShown;
  }

  /**
   * Loads user data from backend
   */
  protected loadUserData(): void {
    this.currentUserEmail = this.tokenService.getEmailFromToken();

    if (!this.currentUserEmail) {
      this.errorMessage = 'Unable to get user email from token';
      this.isLoading = false;
      return;
    }

    this.userController.getUserByEmail(this.currentUserEmail).subscribe({
      next: (userData) => {
        this.handleUserDataSuccess(userData);
      },
      error: (error) => {
        this.handleUserDataError(error);
      }
    });
  }

  /**
   * Handles successful user data retrieval
   * @param userData - User data from backend
   */
  private async handleUserDataSuccess(userData: any): Promise<void> {
    this.isLoading = false;
    this.errorMessage = '';

    try {
      this.user = await this.httpResponseService.handleResponse(userData);
    } catch (error) {
      this.errorMessage = 'Failed to process user data';
    }
  }

  /**
   * Handles user data retrieval errors
   * @param error - Error response
   */
  private async handleUserDataError(error: any): Promise<void> {
    this.isLoading = false;

    try {
      this.errorMessage = await this.httpResponseService.handleError(error, 'Failed to load user data. Please try again.');
    } catch {
      this.errorMessage = 'Failed to load user data. Please try again.';
    }
  }

  /**
   * Logs out the current user
   */
  logout(): void {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }

  /**
   * Formats date for display
   * @param dateString - Date string from backend
   * @returns Formatted date string
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }

  /**
   * Formats balance for display
   * @param balance - Balance number from backend
   * @returns Formatted balance string
   */
  formatBalance(balance: number | undefined): string {
    if (balance === undefined || balance === null) return 'N/A';
    return `$${balance.toFixed(2)}`;
  }

  /**
   * Gets user display name
   * @returns User display name
   */
  getUserDisplayName(): string {
    return this.user?.name || 'User';
  }

  /**
   * Gets user email
   * @returns User email
   */
  getUserEmail(): string {
    return this.user?.email || this.currentUserEmail || 'N/A';
  }


  /**
   * Gets user balance
   * @returns User balance
   */
  getUserBalance(): string {
    return this.formatBalance(this.user?.balance);
  }

  /**
   * Gets user creation date
   * @returns User creation date
   */
  getUserCreationDate(): string {
    return this.formatDate(this.user?.createdAt);
  }
}
