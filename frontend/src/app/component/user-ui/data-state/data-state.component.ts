import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-state.component.html',
  styleUrl: './data-state.component.css'
})
export class DataStateComponent {
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
