import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDTO } from '../../../api';

@Component({
  selector: 'app-user-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class UserProfileCardComponent {
  @Input() user: UserDTO | null = null;
  @Output() editClicked = new EventEmitter<void>();

  onEdit(): void {
    this.editClicked.emit();
  }

  getUserDisplayName(): string {
    return this.user?.name || 'User';
  }

  getUserEmail(): string {
    return this.user?.email || 'N/A';
  }
}
