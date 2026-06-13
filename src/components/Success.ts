import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/Events';

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected description: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.description = container.querySelector(
      '.order-success__description'
    )!;

    this.closeButton = container.querySelector(
      '.order-success__close'
    )!;

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}