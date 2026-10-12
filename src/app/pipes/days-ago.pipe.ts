import { Pipe, PipeTransform } from '@angular/core';
import { daysSince } from '../utils/date';

/** Turns 2026-10-05 into "7 days ago", "yesterday", "3 weeks ago", and so on. */
@Pipe({ name: 'daysAgo' })
export class DaysAgoPipe implements PipeTransform {
  transform(iso: string | null | undefined): string {
    if (!iso) return '';
    const days = daysSince(iso);
    if (days < 0) return 'upcoming';
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 14) return `${days} days ago`;
    if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }
}
