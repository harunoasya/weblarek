import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { WebLarekApi } from './components/WebLarekApi';

import { Catalog } from './components/base/models/catalog';

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const catalog = new Catalog();

webLarekApi
  .getProducts()
  .then((data) => {
    catalog.setProducts(data.items);

    console.log(
      'Каталог товаров, полученный с сервера:',
      catalog.getProducts()
    );
  })
  .catch((error) => {
    console.error('Ошибка получения товаров:', error);
  });

// import { apiProducts } from './utils/data';

// import { Catalog } from './components/base/models/catalog';
// import { Cart } from './components/base/models/cart';
// import { Customer } from './components/base/models/customer';

// const catalog = new Catalog();

// catalog.setProducts(apiProducts.items);

// console.log('Все товары:', catalog.getProducts());

// const firstProduct = apiProducts.items[0];

// catalog.setPrewiew(firstProduct);

// console.log(
//   'Выбранный товар:',
//   catalog.getPrewiew()
// );

// console.log(
//   'Поиск по id:',
//   catalog.getProduct(firstProduct.id)
// );

// const cart = new Cart();

// cart.addItem(firstProduct);

// console.log(
//   'Товары в корзине:',
//   cart.getItems()
// );

// console.log(
//   'Количество товаров:',
//   cart.getItemCount()
// );

// console.log(
//   'Общая стоимость:',
//   cart.getTotalPrice()
// );

// console.log(
//   'Товар в корзине:',
//   cart.hasItem(firstProduct.id)
// );

// cart.removeItem(firstProduct);

// console.log(
//   'После удаления:',
//   cart.getItems()
// );

// cart.clear();

// console.log(
//   'После очистки:',
//   cart.getItems()
// );

// const customer = new Customer();

// customer.setData({
//   payment: 'card',
//   address: 'Москва',
//   phone: '+79991234567',
//   email: 'test@test.ru'
// });

// console.log(customer.getData());
// console.log(customer.validate());

// customer.clearData();

// console.log(
//   'После очистки:',
//   customer.getData()
// );