import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() message = '';
  @Input() header = 'Confirm';
  @Input() icon = 'pi pi-exclamation-triangle';
  @Input() acceptLabel = 'OK';
  @Input() rejectLabel = 'Cancel';

  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  onAccept(): void {
    this.accept.emit();
  }

  onReject(): void {
    this.reject.emit();
  }
}
