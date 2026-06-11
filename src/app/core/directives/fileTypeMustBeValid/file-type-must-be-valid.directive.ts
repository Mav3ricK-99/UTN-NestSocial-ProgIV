import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export function fileTypeMustBeValid(
  allowedTypes: string[]
): ValidatorFn {

  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const file = control.value as File;

    if (!file) {
      return null;
    }

    return allowedTypes.includes(file.type)
      ? null
      : { invalidFileType: true };
  };

}