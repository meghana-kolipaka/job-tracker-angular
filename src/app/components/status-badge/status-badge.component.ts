import { Component, input } from '@angular/core';
import { Status } from '../../models/application.model';

/** Small coloured label for an application's status. Colours come from global styles. */
@Component({
  selector: 'app-status-badge',
  template: `<span class="badge" [attr.data-status]="status()">{{ status() }}</span>`,
})
export class StatusBadgeComponent {
  readonly status = input.required<Status>();
}
