import { IEvents } from '../components/base/Events';
import { TPayment } from '../types';
import { Form } from './Form';

interface IOrderForm {
  payment: TPayment | '';
  address: string;
  valid: boolean;
  errors: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events)

    this.cardButton = container.querySelector('button[name="card"]')!;
    this.cashButton = container.querySelector('button[name="cash"]')!;
    this.addressInput = container.querySelector('input[name="address"]')!;

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', {
        payment: 'card',
      });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', {
        payment: 'cash',
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('order.address:change', {
        address: this.addressInput.value,
      });
    });
  }

  protected onSubmit(): void {
    this.events.emit('order:submit')
  }

  set payment(value: TPayment) {
    this.cardButton.classList.toggle(
      'button_alt-active',
      value === 'card'
    );

    this.cashButton.classList.toggle(
      'button_alt-active',
      value === 'cash'
    );
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

}