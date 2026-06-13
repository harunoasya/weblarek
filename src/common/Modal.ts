import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/Events';

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = container.querySelector('.modal__close')!;
    this.contentContainer = container.querySelector('.modal__content')!;

    // Закрытие по крестику
    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    // Закрытие по клику вне окна
    this.container.addEventListener('click', () => {
      this.close();
    });

    // Не закрывать при клике внутри окна
    container
      .querySelector('.modal__container')!
      .addEventListener('click', (event) => {
        event.stopPropagation();
      });
  }

  set content(value: HTMLElement) {
    this.contentContainer.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentContainer.replaceChildren();
    this.events.emit('modal:close');
  }

  render(data: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}