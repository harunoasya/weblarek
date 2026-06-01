import { ICustomer } from '../../../types/index.ts';

export class Customer implements ICustomer {
  private _payment: string = '';
  private _address: string = '';
  private _phone: string = '';
  private _email: string = '';

  get payment(): string { return this._payment; }
  get address(): string { return this._address; }
  get phone(): string { return this._phone; }
  get email(): string { return this._email; }

  updatePaymentMethod(method: string): void { this._payment = method; }
  updateAddress(addr: string): void { this._address = addr; }
  updatePhone(phone: string): void { this._phone = phone; }
  updateEmail(email: string): void { this._email = email; }

  getData(): ICustomer {
    return {
      payment: this._payment,
      address: this._address,
      phone: this._phone,
      email: this._email
    };
  }

  clearData(): void {
    this._payment = '';
    this._address = '';
    this._phone = '';
    this._email = '';
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this._payment.trim()) errors.push('Вид оплаты не указан');
    if (!this._address.trim()) errors.push('Адрес не указан');
    if (!this._phone.trim()) errors.push('Телефон не указан');
    if (!this._email.trim()) errors.push('Email не указан');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}