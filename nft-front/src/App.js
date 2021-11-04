import './App.css';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import ReactNav from './ReactNav';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './Home';
import Create from './Create';
import Game from './Game';
import Collections from './Collections';
import DetailPage from './DetailPage';

import Gamja from './abis/Gamja.json'
import NFTMarket from './abis/NFTMarket.json'

function App(){
  const [account, setAccount] = useState('');
  const [gamja, setGamja] = useState(null);
  const [gamjaAddress, setGamjaAddress] = useState('');
  const [market, setMarket] = useState(null);
  const [marketItems, setMarketItems] = useState([])
  useEffect(() => {
    async function componentWillMount(){
      await loadWeb3()
      await loadBlockchainData()
    }
    async function loadWeb3(){
      // if (window.ethereum) {
      //     window.web3 = new Web3(window.ethereum);
      //     await window.ethereum.enable();
      // }
      // else if (window.web3) {
      //     window.web3 = new Web3(window.web3.currentProvider);
      // }
      // else {
      //     window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      // }
    }
    async function loadBlockchainData(){
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
      }
      else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
      }
      else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
          return;
      }
      const web3 = window.web3
      // Load account
      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0]);

      // Network Id
      const networkId = await web3.eth.net.getId()
      const gamjaData = Gamja.networks[networkId]
      let token
      if(gamjaData){
        token = new web3.eth.Contract(Gamja.abi, gamjaData.address)
        setGamjaAddress(gamjaData.address)
        setGamja(token)
      }else{
        window.alert('Token contract not deployed to detected network.')
      }

      const marketData = NFTMarket.networks[networkId]
      if(marketData){
        const market = new web3.eth.Contract(NFTMarket.abi, marketData.address)
        setMarket(market)
      }else{
        window.alert('Market contract not deployed to detected network.')
      }
    }

    componentWillMount();
  }, [])
  return (
    <Router>
      <div className="App">
        <ReactNav account={account}/>
        <div className="content">
          <Switch>
            <Route exact path="/">
              {(market && gamja) && <Home account={account} gamja={gamja} market= {market} items={marketItems}/>}
            </Route>
            <Route path="/create">
              {(market && gamja) && <Create account={account} gamja={gamja} market= {market} gamjaAddress={gamjaAddress}/>}
            </Route>
            <Route path="/collection">
              {(market && gamja) && <Collections account={account} gamja={gamja} market= {market} items={marketItems}/>}
            </Route>
            <Route path="/item/:id">
              {(market && gamja) && <DetailPage account={account} gamja={gamja} market= {market}/>}
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
