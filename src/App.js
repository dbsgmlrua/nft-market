import './App.css';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import ReactNav from './ReactNav';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './Home';
import Create from './Create';
import Collections from './Collections';

import Gamja from './abis/Gamja.json'
import NFTMarket from './abis/NFTMarket.json'

function App(){
  const [account, setAccount] = useState('');
  useEffect(() => {
    async function componentWillMount(){
      await loadWeb3()
      await loadBlockchainData()
    }
    async function loadWeb3(){
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
      }
      else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
      }
      else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }
    async function loadBlockchainData(){
      const web3 = window.web3
      // Load account
      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0]);


    }

    componentWillMount();
  })
  return (
    <Router>
      <div className="App">
        <ReactNav account={account}/>
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/create">
              <Create />
            </Route>
            <Route path="/collection">
              <Collections />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
