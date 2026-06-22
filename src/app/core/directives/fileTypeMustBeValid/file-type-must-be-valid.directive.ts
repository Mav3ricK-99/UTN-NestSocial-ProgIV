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

    const file = control.value;

    if (!file || file == undefined) {
      return null;
    }
    const lastDot = file.lastIndexOf('.');

    const result = lastDot !== -1 ? file.substring(lastDot + 1) : "";

    return allowedTypes.includes(result)
      ? null
      : { invalidFileType: true };
  };

}