import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMustMatch(): ValidatorFn {

  return (form: AbstractControl): ValidationErrors | null => {
    let passwordCtrl = form.get('password');
    let confirmPasswordCtrl = form.get('confirmPassword');
    if (passwordCtrl != undefined && confirmPasswordCtrl != undefined) {
      if (passwordCtrl.value !== confirmPasswordCtrl.value) {
        return { noMatch: 'No match' };
      }
    }
    return null;
  };

}