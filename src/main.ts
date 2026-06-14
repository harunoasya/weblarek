import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { WebLarekApi } from './components/WebLarekApi';

import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { Modal } from './common/Modal';
import { Basket } from './components/Basket';
import { BasketItem } from './components/BasketItem';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';
import { CatalogCard } from './components/CatalogCard';
import { PreviewCard } from './components/PreviewCard';

import { Catalog } from './components/base/models/catalog';
import { Cart } from './components/base/models/cart';
import { Customer } from './components/base/models/customer';

import { EventEmitter } from './components/base/Events';
import { TPayment } from './types';

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const events = new EventEmitter();

const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const modal = new Modal(document.getElementById('modal-container')!, events);

const catalog = new Catalog(events);
const cart = new Cart(events);
const customer = new Customer(events);

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const basketView = new Basket(basketElement, events);

const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderElement = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
const orderForm = new OrderForm(orderElement, events);

const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsElement = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsElement, events);

const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const successElement = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const success = new Success(successElement, events);


events.on('catalog:changed', () => {
  const cards = catalog.getProducts().map((product) => {
    const template = document.querySelector('#card-catalog') as HTMLTemplateElement;

    const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new CatalogCard(cardElement, () => events.emit('card:select', { id: product.id }));

    return card.render(product);
  })

  gallery.items = cards;
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

  const card = new PreviewCard(cardElement, () => events.emit('card:action'));

  if (product.price === null) {
    card.buttonDisabled = true;
    card.buttonText = 'Недоступно';
  } else {
    card.buttonDisabled = false;
    card.buttonText = cart.hasItem(product.id)
    ? 'Удалить из корзины'
    : 'Купить';
  }

  const content = card.render(product);

  modal.render({
    content,
  });

  modal.open();

});

events.on('card:action', () => {
  const product = catalog.getPreview();

  if (!product) {
    return;
  }

  if (cart.hasItem(product.id)) {
    cart.removeItem(product);
  } else {
    cart.addItem(product);
  }

  modal.close();
});

events.on('cart:changed', () => {
  header.counter = cart.getItemCount();

  const basketItems = cart.getItems().map((product, index) => {
    const itemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

    const itemElement = itemTemplate.content.firstElementChild!
      .cloneNode(true) as HTMLElement;

    const item = new BasketItem(itemElement, () => {
      events.emit('basket:remove', { id: product.id })
    });

    return item.render({
      title: product.title,
      price: product.price ?? 0,
      index: index + 1,
    });
  });

  basketView.items = basketItems;
  basketView.total = cart.getTotalPrice();

});

events.on('basket:open', () => {
  modal.render({
    content: basketView.render(),
  });

  modal.open();
})

events.on<{ id:string }>('basket:remove', ({ id }) => {
  const product = catalog.getProduct(id);

  if (!product) {
    return;
  }

  cart.removeItem(product);
});

events.on('basket:order', () => {

  modal.render({
    content: orderForm.render(),
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
  
  modal.render({
    content: contactsForm.render(),
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
    success.render({
      total: result.total,
    });
    
    modal.render({
      content: success.render(),
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