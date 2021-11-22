import React from 'react';
import './App.css';
import { BrowserRouter as Switch, Route } from 'react-router-dom';
import Register from './Register';
import BillingPage from './BillingPage';
import Checkout from './checkout';
import CheckoutPayment from './checkout-payment';

function App(props) {
  return (
    <Switch>
      <Route exact path="/">
        <Register />
      </Route>
      <Route path="/billing-page">
        <BillingPage />
      </Route>
      <Route path="/checkout">
        <Checkout />
      </Route>
      <Route path="/checkout-payment">
        <CheckoutPayment />
      </Route>
    </Switch>
  );
}

export default App;
