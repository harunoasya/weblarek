import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { WebLarekApi } from './components/WebLarekApi';

import { Page } from './components/Page';
import { Modal } from './common/Modal';
import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { BasketItem } from './components/BasketItem';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';

import { Catalog } from './components/base/models/catalog';
import { Cart } from './components/base/models/cart';
import { Customer } from './components/base/models/customer';

import { EventEmitter } from './components/base/Events';
import { TPayment } from './types';

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const events = new EventEmitter();

const page = new Page(document.body, events);
const modal = new Modal(document.getElementById('modal-container')!, events);

const catalog = new Catalog(events);
const cart = new Cart(events);
const customer = new Customer(events);

let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;

events.on('catalog:changed', () => {
  const cards = catalog.getProducts().map((product) => {
    const template = document.querySelector('#card-catalog') as HTMLTemplateElement;

    const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new Card(cardElement, events);

    return card.render(product);
  })

  page.catalog = cards;
});

events.on<{ id:string }>('card:select', ({ id }) => {
  const product = catalog.getProduct(id);

  if (product) {
    catalog.setPreview(product);
  }
});

events.on('catalog:selected', () => {
  const product = catalog.getPreview();

  if (!product) {
    return;
  }

  const template = document.querySelector('#card-preview') as HTMLTemplateElement;

  const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const card = new Card(cardElement, events);

  const content = card.render(product);

  card.inCart = cart.hasItem(product.id);

  modal.render({
    content,
  });

  modal.open();

});

events.on<{ id:string }>('card:action', ({ id }) => {
  const product = catalog.getProduct(id);

  if (!product) {
    return;
  }

  if (cart.hasItem(id)) {
    cart.removeItem(product);
  } else {
    cart.addItem(product);
  }

  modal.close();
});

function renderBasket() {
  const basketTemplate = document.querySelector(
    '#basket'
  ) as HTMLTemplateElement;

  const basketElement = basketTemplate.content.firstElementChild!
    .cloneNode(true) as HTMLElement;

  const basketView = new Basket(basketElement, events);

  const basketItems = cart.getItems().map((product, index) => {
    const itemTemplate = document.querySelector(
      '#card-basket'
    ) as HTMLTemplateElement;

    const itemElement = itemTemplate.content.firstElementChild!
      .cloneNode(true) as HTMLElement;

    const item = new BasketItem(itemElement, events);

    return item.render({
      id: product.id,
      title: product.title,
      price: product.price ?? 0,
      index: index + 1,
    });
  });

  basketView.items = basketItems;
  basketView.total = cart.getTotalPrice();

  modal.render({
    content: basketView.render(),
  });
}

events.on('basket:open', () => {
  renderBasket();
  modal.open();
})

events.on('cart:changed', () => {
  page.counter = cart.getItemCount();

  const isBasketOpen = document.getElementById('modal-container')?.classList.contains('modal_active');

  if (isBasketOpen) {
    renderBasket();
  }
});

events.on<{ id:string }>('basket:remove', ({ id }) => {
  const product = catalog.getProduct(id);

  if (!product) {
    return;
  }

  cart.removeItem(product);
});

events.on('basket:order', () => {
  const template = document.querySelector(
    '#order'
  ) as HTMLTemplateElement;

  const formElement = template.content.firstElementChild!
    .cloneNode(true) as HTMLFormElement;

  orderForm = new OrderForm(formElement, events);

  modal.render({
    content: orderForm.render({
      payment: customer.getData().payment,
      address: customer.getData().address,
      valid: false,
      errors: '',
    }),
  });

  modal.open();
});

events.on<{ payment: TPayment }>('order.payment:change', ({ payment }) =>  {
  customer.setData({ payment });
});

events.on<{ address: string }>('order.address:change', ({ address }) => {
  customer.setData({ address });
});

events.on('order:submit', () => {
  const template = document.querySelector(
    '#contacts'
  ) as HTMLTemplateElement;

  const formElement = template.content.firstElementChild!
    .cloneNode(true) as HTMLFormElement;

  contactsForm = new ContactsForm(formElement, events);

  modal.render({
    content: contactsForm.render({
      email: customer.getData().email,
      phone: customer.getData().phone,
      valid: false,
      errors: '',
    }),
  });
});

events.on<{ email: string }>(
  'contacts.email:change',
  ({ email }) => {
    customer.setData({ email });
  }
);

events.on<{ phone: string }>(
  'contacts.phone:change',
  ({ phone }) => {
    customer.setData({ phone });
  }
);

events.on('customer:changed', () => {
  if (!orderForm) {
    return;
  }

  const errors = customer.validate();

  const orderErrors: string[] = [];

  if (errors.payment) {
    orderErrors.push(errors.payment);
  }

  if (errors.address) {
    orderErrors.push(errors.address);
  }

  orderForm.render({
    payment: customer.getData().payment,
    address: customer.getData().address,
    valid: orderErrors.length === 0,
    errors: orderErrors.join(', '),
  });

  if (contactsForm) {
  const errors = customer.validate();

  const contactErrors: string[] = [];

  if (errors.email) {
    contactErrors.push(errors.email);
  }

  if (errors.phone) {
    contactErrors.push(errors.phone);
  }

  contactsForm.render({
    email: customer.getData().email,
    phone: customer.getData().phone,
    valid: contactErrors.length === 0,
    errors: contactErrors.join(', '),
  });
}
});

events.on('contacts:submit', () => {
  const customerData = customer.getData();

  webLarekApi.createOrder({
    payment: customerData.payment,
    address: customerData.address,
    email: customerData.email,
    phone: customerData.phone,
    items: cart.getItems().map(item => item.id),
    total: cart.getTotalPrice(),
  })
  .then((result) => {
  const template = document.querySelector(
    '#success'
  ) as HTMLTemplateElement;

  const element = template.content.firstElementChild!
    .cloneNode(true) as HTMLElement;

  const success = new Success(element, events);

  modal.render({
    content: success.render({
      total: result.total,
    }),
  });

  cart.clear();
  customer.clearData();
})
  .catch((error) => {
    console.error('Ошибка оформления заказа:', error);
  });
});

events.on('success:close', () => {
  modal.close();
});

webLarekApi
  .getProducts()
  .then((data) => {
    catalog.setProducts(data.items);
  })

  .catch((error) => {
    console.error('Ошибка получения товаров:', error);
  });