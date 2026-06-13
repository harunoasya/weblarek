import { ICustomer, TPayment, TCustomerErrors } from '../../../types/index.ts';
import { IEvents } from "../Events.ts"

export class Customer {
  private _payment: TPayment | '' = '';
  private _address: string = '';
  private _phone: string = '';
  private _email: string = '';

  constructor(protected events: IEvents) {}

  get payment(): string { return this._payment; }
  get address(): string { return this._address; }
  get phone(): string { return this._phone; }
  get email(): string { return this._email; }

  setData(data: Partial<ICustomer>): void {
    if (data.payment !== undefined) {
      this._payment = data.payment;
    }

    if (data.address !== undefined) {
      this._address = data.address;
    }

    if (data.phone !== undefined) {
      this._phone = data.phone;
    }

    if (data.email !== undefined) {
      this._email = data.email;
    }

    this.events.emit('customer:changed');
  }

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

    this.events.emit('customer:changed');
  }

  validate(): TCustomerErrors {
    const errors: TCustomerErrors = {};

    if (!this._payment.trim()) {
      errors.payment = 'Выберите способ оплаты';
    }

    if (!this._address.trim()) {
      errors.address = 'Укажите адрес';
    }

    if (!this._phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    if (!this._email.trim()) {
      errors.email = 'Укажите email';
    }

    return errors;
  }
}