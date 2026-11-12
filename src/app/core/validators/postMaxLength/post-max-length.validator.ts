import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function postMaxLength(MaxLength: Number): ValidatorFn {

  return (form: AbstractControl): ValidationErrors | null => {
    let contentValue = form.get('content')?.value;
    if(contentValue == undefined) return null;

    const text = contentValue.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    return text.length > MaxLength
      ? {
        postMaxLength: {
          current: text.length,
          Max: MaxLength
        }
      }
      : null;
  };

}