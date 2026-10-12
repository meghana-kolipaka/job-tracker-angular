import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Application, ApplicationDraft, STATUSES, Status } from '../models/application.model';

const STORAGE_KEY = 'job-tracker.applications.v1';
const SEED_URL = 'seed-applications.json';

export type StatusCounts = Record<Status | 'All', number>;

/**
 * Holds every application in a signal, saves changes to localStorage,
 * and loads sample data over HTTP the first time the app runs.
 */
@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly http = inject(HttpClient);
  private readonly _items = signal<Application[]>([]);

  readonly items = this._items.asReadonly();
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);

  readonly counts = computed<StatusCounts>(() => {
    const counts = { All: 0 } as StatusCounts;
    for (const status of STATUSES) counts[status] = 0;
    for (const item of this._items()) {
      counts[item.status]++;
      counts.All++;
    }
    return counts;
  });

  constructor() {
    this.load();
  }

  getById(id: string): Application | undefined {
    return this._items().find((a) => a.id === id);
  }

  add(draft: ApplicationDraft): Application {
    const created: Application = { ...draft, id: crypto.randomUUID() };
    this._items.update((list) => [created, ...list]);
    this.persist();
    return created;
  }

  update(id: string, draft: ApplicationDraft): void {
    this._items.update((list) => list.map((a) => (a.id === id ? { ...draft, id } : a)));
    this.persist();
  }

  setStatus(id: string, status: Status): void {
    this._items.update((list) => list.map((a) => (a.id === id ? { ...a, status } : a)));
    this.persist();
  }

  remove(id: string): void {
    this._items.update((list) => list.filter((a) => a.id !== id));
    this.persist();
  }

  /** Throws away saved data and loads the sample applications again. */
  resetToSampleData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore blocked storage */
    }
    this.loading.set(true);
    this.loadSeed();
  }

  private load(): void {
    const stored = this.readStorage();
    if (stored) {
      this._items.set(stored);
      this.loading.set(false);
    } else {
      this.loadSeed();
    }
  }

  private loadSeed(): void {
    this.http.get<Application[]>(SEED_URL).subscribe({
      next: (data) => {
        this._items.set(data);
        this.persist();
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Sample data could not be loaded. You can still add your own applications.');
        this.loading.set(false);
      },
    });
  }

  private readStorage(): Application[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Application[]) : null;
    } catch {
      return null;
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
    } catch {
      /* storage can be full or blocked; the app keeps working in memory */
    }
  }
}
