import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import InvoiceForm from './components/InvoiceForm';
import Home from './components/Home';

class App extends Component {
  render() {
  return (
    <div className="App d-flex flex-column align-items-center w-100">
      <Container>
        <Provider store={store}>
          <Home />
        </Provider>
      </Container>
    </div>
  );
}}

export default App;
