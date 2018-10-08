import React, { Component } from 'react';
import {HashRouter} from 'react-router-dom';
import './reset.css';
import './App.css';
import Routes from './components/nav/routes'
import Nav from './components/nav/nav'
import Footer from './components/nav/footer'

class App extends Component {
  render() {
    return (
      <HashRouter>
      <div className="App">
        <Nav/>
        <Routes/>
        {/* <Footer/> */}
      </div>
      </HashRouter>
    );
  }
}

export default App;
