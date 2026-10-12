import { Component, effect, inject, untracked } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationDraft, STATUSES, Status } from '../../models/application.model';
import { ApplicationService } from '../../services/application.service';
import { todayIso } from '../../utils/date';
import { notInFuture } from '../../utils/validators';

/** One form for both "add" (no id in the URL) and "edit" (/applications/:id/edit). */
@Component({
  selector: 'app-application-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './application-form.component.html',
})
export class ApplicationFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(ApplicationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly statuses = STATUSES;
  readonly today = todayIso();
  readonly editingId = this.route.snapshot.paramMap.get('id');

  readonly form = this.fb.group({
    company: ['', [Validators.required, Validators.minLength(2)]],
    role: ['', [Validators.required]],
    location: [''],
    status: ['Applied' as Status, [Validators.required]],
    appliedOn: [todayIso(), [Validators.required, notInFuture]],
    link: ['', [Validators.pattern(/^$|^https?:\/\/\S+$/i)]],
    notes: ['', [Validators.maxLength(500)]],
  });

  constructor() {
    if (this.editingId) {
      const id = this.editingId;
      let filled = false;
      // Runs again when the application list finishes loading, then fills the form once.
      effect(() => {
        const item = this.service.getById(id);
        const loading = this.service.loading();
        if (filled || loading) return;
        if (!item) {
          this.router.navigate(['/applications']);
          return;
        }
        filled = true;
        untracked(() => this.form.patchValue(item));
      });
    }
  }

  showError(name: 'company' | 'role' | 'appliedOn' | 'link' | 'notes'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const draft: ApplicationDraft = {
      company: v.company.trim(),
      role: v.role.trim(),
      location: v.location.trim(),
      status: v.status,
      appliedOn: v.appliedOn,
      link: v.link.trim(),
      notes: v.notes.trim(),
    };

    if (this.editingId) {
      this.service.update(this.editingId, draft);
      this.router.navigate(['/applications', this.editingId]);
    } else {
      const created = this.service.add(draft);
      this.router.navigate(['/applications', created.id]);
    }
  }
}
