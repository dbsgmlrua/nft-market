import './App.css';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import ReactNav from './ReactNav';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './Home';
import Create from './Create';
import Game from './Game';
import Collections from './Collections';

import Gamja from './abis/Gamja.json'
import NFTMarket from './abis/NFTMarket.json'

function App(){
  const [account, setAccount] = useState('');
  const [gamja, setGamja] = useState(null);
  const [market, setMarket] = useState(null);
  const [marketItems, setMarketItems] = useState([])
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

      // Network Id
      const networkId = await web3.eth.net.getId()
      const gamjaData = Gamja.networks[networkId]
      let token
      if(gamjaData){
        token = new web3.eth.Contract(Gamja.abi, gamjaData.address)
        setGamja(token)
      }else{
        window.alert('MemoryToken contract not deployed to detected network.')
      }

      const marketData = NFTMarket.networks[networkId]
      if(marketData){
        const market = new web3.eth.Contract(NFTMarket.abi, marketData.address)
        setMarket(market)
        const balanceOf = await market.methods.getItemList().call({from: accounts[0]})
        console.log("balanceOf", balanceOf)
        const items = await Promise.all(balanceOf.map(async i => {
          const tokenUri = await token.methods.tokenURI(i.tokenId).call()
          const ownerOf = await token.methods.ownerOf(i.tokenId).call()
          let item = {
              itemId: i.itemId.toString(),
              price: i.price.toString(),
              tokenId: i.tokenId.toString(),
              onSale: i.onSale,
              owner: ownerOf,
              tokenUri
          }
          return item
      }))
      setMarketItems(items)
      console.log("items", items)
      }else{
        window.alert('MemoryToken contract not deployed to detected network.')
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
              {market && <Home items={marketItems}/>}
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
