import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDTO } from '../../../api';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css'
})
export class AccountDetailsComponent {
  @Input() user: UserDTO | null = null;
  @Output() changePasswordClicked = new EventEmitter<void>();

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

  formatBalance(balance: number | undefined): string {
    if (balance === undefined || balance === null) return 'N/A';
    return `$${balance.toFixed(2)}`;
  }

  getUserDisplayName(): string {
    return this.user?.name || 'N/A';
  }

  getUserEmail(): string {
    return this.user?.email || 'N/A';
  }

  getUserCreationDate(): string {
    return this.formatDate(this.user?.createdAt);
  }

  getUserBalance(): string {
    return this.formatBalance(this.user?.balance);
  }

  onChangePassword(): void {
    this.changePasswordClicked.emit();
  }
}
