import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Add this


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule], // ✅ Add CommonModule here
  template: `
  <div class="app-container">
    <h1 class="header">HustleDays</h1>
    <p>Logging for <strong>{{ formatDisplayDate(selectedDate) }}</strong></p>

    <div class="input-group">
      <input type="date" [(ngModel)]="selectedDate" />
      <textarea [(ngModel)]="entry" placeholder="What happened on this day?"></textarea>
      <button (click)="save()">Save</button>
    </div>

    <div class="log-list">
  <div *ngFor="let log of logs()" class="log-card">
    <div class="emoji">🗓️</div>
    <div class="text">{{ log }}</div>
    <div class="date">{{ selectedDate }}</div>
  </div>
</div>
`

})

export class AppComponent {
  entry = '';
  selectedDate = this.formatDate(new Date());
  logs = signal<string[]>(this.loadLogs());

  save() {
    if (this.entry.trim()) {
      const dateStr = this.formatDate(new Date(this.selectedDate));
      const updated = [...this.logs(), `${dateStr}: ${this.entry}`];
      this.logs.set(updated);
      localStorage.setItem('hustledays_logs', JSON.stringify(updated));
      this.entry = '';
      this.selectedDate = this.formatDate(new Date()); // Reset to today
    }
  }

  formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const suffix = this.getDaySuffix(day);
  return `${day}${suffix} ${month}`;
}

getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}


  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
  }

  loadLogs(): string[] {
    return JSON.parse(localStorage.getItem('hustledays_logs') || '[]');
  }
}
