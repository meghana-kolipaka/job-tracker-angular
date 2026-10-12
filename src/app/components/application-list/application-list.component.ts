import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { STATUSES, Status } from '../../models/application.model';
import { DaysAgoPipe } from '../../pipes/days-ago.pipe';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-application-list',
  imports: [RouterLink, ReactiveFormsModule, DaysAgoPipe],
  templateUrl: './application-list.component.html',
})
export class ApplicationListComponent {
  private readonly service = inject(ApplicationService);

  readonly statuses = STATUSES;
  readonly counts = this.service.counts;
  readonly loading = this.service.loading;
  readonly loadError = this.service.loadError;

  /** Search box. RxJS waits 200 ms after typing stops before filtering. */
  readonly search = new FormControl('', { nonNullable: true });
  private readonly query = toSignal(
    this.search.valueChanges.pipe(
      debounceTime(200),
      map((value) => value.trim().toLowerCase()),
      distinctUntilChanged(),
      startWith(''),
    ),
    { initialValue: '' },
  );

  readonly statusFilter = signal<Status | 'All'>('All');

  readonly visible = computed(() => {
    const query = this.query();
    const status = this.statusFilter();
    return this.service
      .items()
      .filter((a) => status === 'All' || a.status === status)
      .filter((a) => !query || `${a.company} ${a.role} ${a.location}`.toLowerCase().includes(query))
      .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));
  });

  /** Share of all applications per status, for the proportional bar. */
  readonly segments = computed(() => {
    const counts = this.counts();
    return STATUSES.filter((s) => counts[s] > 0).map((s) => ({ status: s, count: counts[s] }));
  });

  setFilter(status: Status | 'All'): void {
    this.statusFilter.set(status);
  }

  onStatusChange(id: string, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as Status;
    this.service.setStatus(id, status);
  }

  resetSampleData(): void {
    if (confirm('Replace everything with the sample applications? Your own entries will be lost.')) {
      this.service.resetToSampleData();
      this.search.setValue('');
      this.statusFilter.set('All');
    }
  }
}
