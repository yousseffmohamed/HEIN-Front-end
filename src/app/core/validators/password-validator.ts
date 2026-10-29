import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export class PasswordValidator {
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;

      if (!password) {
        return null;
      }

      const hasNumber = /[0-9]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isValidLength = password.length >= 8;

      const isValid =
        hasNumber &&
        hasUpperCase &&
        hasLowerCase &&
        hasSpecialChar &&
        isValidLength;

      return !isValid ? { strongPassword: true } : null;
    };
  }

  static matchPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const retypePassword = control.value;
      const password = control.parent?.get('password')?.value;

      if (!retypePassword || !password) {
        return null;
      }

      return retypePassword === password
        ? null
        : { matchPassword: true };
    };
  }
}
