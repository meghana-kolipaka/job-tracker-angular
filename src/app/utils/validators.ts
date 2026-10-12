import { AbstractControl, ValidationErrors } from '@angular/forms';
import { todayIso } from './date';

/** Custom validator: a date string (YYYY-MM-DD) must not be later than today. */
export function notInFuture(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value;
  return value && value > todayIso() ? { future: true } : null;
}
