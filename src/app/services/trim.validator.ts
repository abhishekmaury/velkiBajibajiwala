import { AbstractControl, ValidatorFn } from '@angular/forms';

export function trimValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (control.value && typeof control.value === 'string') {
      const trimmedValue = control.value.trim();
      if (trimmedValue !== control.value) {
        control.setValue(trimmedValue);
      }
    }
    return null; // Return null to indicate validation success
  };
}
