import { Component } from './base/Component';
import { IEvents } from './base/Events';

export abstract class Form<T> extends Component<T> {
  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container);

    this.form = container;

    this.submitButton = container.querySelector(
      'button[type="submit"]'
    )!;

    this.errorsContainer = container.querySelector(
      '.form__errors'
    )!;

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();

      this.onSubmit();
    });
  }

  protected abstract onSubmit(): void;

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsContainer.textContent = value;
  }
}