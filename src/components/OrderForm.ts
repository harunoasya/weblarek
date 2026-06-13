import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/Events';
import { TPayment } from '../types';

interface IOrderForm {
  payment: TPayment | '';
  address: string;
  valid: boolean;
  errors: string;
}

export class OrderForm extends Component<IOrderForm> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;
  protected form: HTMLFormElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.form = container;

    this.cardButton = container.querySelector('button[name="card"]')!;
    this.cashButton = container.querySelector('button[name="cash"]')!;
    this.addressInput = container.querySelector('input[name="address"]')!;
    this.submitButton = container.querySelector('.order__button')!;
    this.errorsContainer = container.querySelector('.form__errors')!;

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

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('order:submit');
    });
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

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsContainer.textContent = value;
  }
}