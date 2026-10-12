import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { STATUSES, Status } from '../../models/application.model';
import { DaysAgoPipe } from '../../pipes/days-ago.pipe';
import { ApplicationService } from '../../services/application.service';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-application-detail',
  imports: [RouterLink, StatusBadgeComponent, DaysAgoPipe],
  templateUrl: './application-detail.component.html',
})
export class ApplicationDetailComponent {
  private readonly service = inject(ApplicationService);
  private readonly router = inject(Router);
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  readonly statuses = STATUSES;
  readonly loading = this.service.loading;
  readonly app = computed(() => this.service.items().find((a) => a.id === this.id));

  onStatusChange(event: Event): void {
    this.service.setStatus(this.id, (event.target as HTMLSelectElement).value as Status);
  }

  remove(): void {
    const name = this.app()?.company ?? 'this application';
    if (confirm(`Delete the application to ${name}?`)) {
      this.service.remove(this.id);
      this.router.navigate(['/applications']);
    }
  }
}
