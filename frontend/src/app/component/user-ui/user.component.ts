import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserControllerService, UserDTO } from '../../api';
import { TokenService } from '../../services/token.service';
import { HttpResponseService } from '../../services/http-response.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserProfileCardComponent } from './profile-card/profile-card.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DataStateComponent } from './data-state/data-state.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ToastComponent, Toast } from './toast/toast.component';
import {ToastService} from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    UserProfileCardComponent,
    AccountDetailsComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    DataStateComponent,
    ConfirmDialogComponent,
    ToastComponent
  ]
})
export class UserComponent implements OnInit, OnDestroy {
  isLoading = true;
  errorMessage = '';
  user: UserDTO | null = null;
  currentUserEmail = '';
  isEditingProfile = false;
  isChangingPassword = false;
  isSaving = false;

  // Confirm dialog state
  confirmDialogOpen = false;
  confirmDialogMessage = '';
  confirmDialogHeader = 'Confirm';
  confirmDialogAcceptLabel = 'OK';
  confirmDialogRejectLabel = 'Cancel';
  pendingConfirmAction: (() => void) | null = null;

  toasts: Toast[] = [];
  private toastSubscription?: Subscription;

  constructor(
    private userController: UserControllerService,
    private tokenService: TokenService,
    private router: Router,
    private toastService: ToastService,
    private httpResponseService: HttpResponseService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.toastSubscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.toastSubscription?.unsubscribe();
  }

  protected loadUserData(): void {
    this.currentUserEmail = this.tokenService.getEmailFromToken();

    if (!this.currentUserEmail) {
      this.errorMessage = 'Unable to get user email from token';
      this.isLoading = false;
      return;
    }

    this.userController.getUserByEmail(this.currentUserEmail).subscribe({
      next: (userData) => this.handleUserDataSuccess(userData),
      error: (error) => this.handleUserDataError(error)
    });
  }

  private async handleUserDataSuccess(userData: any): Promise<void> {
    this.isLoading = false;
    this.errorMessage = '';

    try {
      this.user = await this.httpResponseService.handleResponse(userData);
    } catch (error) {
      this.errorMessage = 'Failed to process user data';
    }
  }

  private async handleUserDataError(error: any): Promise<void> {
    this.isLoading = false;

    try {
      this.errorMessage = await this.httpResponseService.handleError(error, 'Failed to load user data. Please try again.');
    } catch {
      this.errorMessage = 'Failed to load user data. Please try again.';
    }
  }

  openEditProfile(): void {
    this.isEditingProfile = true;
  }

  closeEditProfile(): void {
    this.isEditingProfile = false;
  }

  openChangePassword(): void {
    this.isChangingPassword = true;
  }

  closeChangePassword(): void {
    this.isChangingPassword = false;
  }

  saveProfile(formData: { name: string; email: string }): void {
    const emailChanged = formData.email !== this.user?.email;

    if (emailChanged) {
      this.showConfirmDialog(
        'You will be logged out after changing your email. Do you want to continue?',
        'Confirm Changes',
        () => this.performProfileUpdate(formData, true)
      );
    } else {
      this.performProfileUpdate(formData, false);
    }
  }

  savePassword(formData: { currentPassword: string; newPassword: string }): void {
    this.showConfirmDialog(
      'You will be logged out after changing your password. Do you want to continue?',
      'Confirm Changes',
      () => this.performPasswordUpdate(formData)
    );
  }

  private showConfirmDialog(message: string, header: string, onAccept: () => void): void {
    this.confirmDialogMessage = message;
    this.confirmDialogHeader = header;
    this.pendingConfirmAction = onAccept;
    this.confirmDialogOpen = true;
  }

  onConfirmAccept(): void {
    this.confirmDialogOpen = false;
    if (this.pendingConfirmAction) {
      this.pendingConfirmAction();
      this.pendingConfirmAction = null;
    }
  }

  onConfirmReject(): void {
    this.confirmDialogOpen = false;
    this.pendingConfirmAction = null;
  }

  private performProfileUpdate(formData: { name: string; email: string }, shouldLogout: boolean): void {
    this.isSaving = true;
    const userId = this.user?.id;

    if (userId == null) {
      this.isSaving = false;
      this.errorMessage = 'User ID is missing';
      return;
    }

    const updatedUser: UserDTO = {
      ...this.user,
      name: formData.name,
      email: formData.email,
      password: undefined
    };

    this.userController.updateUser(userId, updatedUser).subscribe({
      next: (response) => this.handleUpdateSuccess(shouldLogout),
      error: (error) => this.handleUpdateError(error)
    });
  }

  private performPasswordUpdate(formData: { currentPassword: string; newPassword: string }): void {
    this.isSaving = true;
    const userId = this.user?.id;

    if (userId == null) {
      this.isSaving = false;
      this.errorMessage = 'User ID is missing';
      return;
    }

    const updatedUser: UserDTO = {
      ...this.user,
      password: formData.newPassword,
      currentPassword: formData.currentPassword
    } as any;

    this.userController.updateUser(userId, updatedUser).subscribe({
      next: (response) => this.handlePasswordUpdateSuccess(),
      error: (error) => this.handleUpdateError(error)
    });
  }

  private async handleUpdateSuccess(shouldLogout: boolean): Promise<void> {
    this.isSaving = false;
    this.isEditingProfile = false;

    if (shouldLogout) {
      this.toastService.success('Profile updated! Logging out...', 2000);
      setTimeout(() => {
        this.logout();
      }, 2000);
    } else {
      this.toastService.success('Profile updated successfully!');
      this.loadUserData();
    }
  }

  private async handlePasswordUpdateSuccess(): Promise<void> {
    this.isSaving = false;
    this.isChangingPassword = false;
    this.toastService.success('Password changed successfully!');
  }

  private async handleUpdateError(error: any): Promise<void> {
    this.isSaving = false;

    try {
      this.errorMessage = await this.httpResponseService.handleError(error, 'Failed to update. Please try again.');
    } catch {
      this.errorMessage = 'Failed to update. Please try again.';
    }
  }

  onMenuSelect(menuLabel: string): void {
    if (menuLabel === 'Log out') {
      this.logout();
    }
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }
}
