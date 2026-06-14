import { IEvents } from '../components/base/Events';
import { Form } from './Form';

interface IContactsForm {
  email: string;
  phone: string;
  valid: boolean;
  errors: string;
}

export class ContactsForm extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events)

    this.emailInput = container.querySelector('input[name="email"]')!;
    this.phoneInput = container.querySelector('input[name="phone"]')!;

    this.emailInput.addEventListener('input', () => {
      this.events.emit('contacts.email:change', {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contacts.phone:change', {
        phone: this.phoneInput.value,
      });
    });
  }

  protected onSubmit(): void {
      this.events.emit('contacts:submit')
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

}