import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMustBeSecure(): ValidatorFn {

  return (form: AbstractControl): ValidationErrors | null => {
    let passwordCtrl = form.get('password');
    let confirmPasswordCtrl = form.get('confirmPassword');
    let regex = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (passwordCtrl != undefined && confirmPasswordCtrl != undefined) {
      if (passwordCtrl.value === '' || confirmPasswordCtrl.value === '') {
        return null;
      }
      if (!regex.test(passwordCtrl.value) || !regex.test(confirmPasswordCtrl.value)) {
        return { notSecure: 'Not secure' };
      }

    };
    return null;
  }
}