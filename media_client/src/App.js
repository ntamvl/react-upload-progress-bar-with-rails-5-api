import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Upload from './components/Upload';
import { v4 } from 'node-uuid';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          ...
        </p>
        <div>
          <Upload key={ v4() } />
        </div>
      </div>
    );
  }
}

export default App;
