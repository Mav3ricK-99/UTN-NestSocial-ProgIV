import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function postMaxImages(maxImages?: number): ValidatorFn {

  return (form: AbstractControl): ValidationErrors | null => {
    let contentValue = form.get('content')?.value;
    if(contentValue == undefined) return null;

    const imgMatchRegex = /<img\b[^>]*>/gi;
    return (contentValue.match(imgMatchRegex) || []).length > (maxImages ? maxImages : 1)
      ? {
        postMaxImages: {
          exceeded: true
        }
      }
      : null;
  };

}