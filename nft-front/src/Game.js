import { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import Web3 from 'web3';

import Gamja from './abis/Gamja.json'
import NFTMarket from './abis/NFTMarket.json'
const CARD_ARRAY = [
    {
      name: 'fries',
      img: '/images/fries.png'
    },
    {
      name: 'cheeseburger',
      img: '/images/cheeseburger.png'
    },
    {
      name: 'ice-cream',
      img: '/images/ice-cream.png'
    },
    {
      name: 'pizza',
      img: '/images/pizza.png'
    },
    {
      name: 'milkshake',
      img: '/images/milkshake.png'
    },
    {
      name: 'hotdog',
      img: '/images/hotdog.png'
    },
    {
      name: 'fries',
      img: '/images/fries.png'
    },
    {
      name: 'cheeseburger',
      img: '/images/cheeseburger.png'
    },
    {
      name: 'ice-cream',
      img: '/images/ice-cream.png'
    },
    {
      name: 'pizza',
      img: '/images/pizza.png'
    },
    {
      name: 'milkshake',
      img: '/images/milkshake.png'
    },
    {
      name: 'hotdog',
      img: '/images/hotdog.png'
    }
  ]
const Game = (token, account) => {
    const [tokenURIs, setTokenURIs] = useState([]);
    const [cardArray, setCardArray] = useState([]);
    const [cardsChosen, setCardsChosen] = useState([]);
    const [cardsChosenId, setCardsChosenId] = useState([]);
    const [cardsWon, setCardsWon] = useState([]);
    
    useEffect(()=>{
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
        //   setAccount(accounts[0]);
    
          // Network Id
          const networkId = await web3.eth.net.getId()
          const gamjaData = Gamja.networks[networkId]
          let token
          if(gamjaData){
            token = new web3.eth.Contract(Gamja.abi, gamjaData.address)
          }else{
            window.alert('MemoryToken contract not deployed to detected network.')
          }
    
          const marketData = NFTMarket.networks[networkId]
          if(marketData){
            const market = new web3.eth.Contract(NFTMarket.abi, marketData.address)
            const balanceOf = await market.methods.getItemList().call({from: accounts[0]})
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
          setTokenURIs(items)
          console.log("items", items)
          }else{
            window.alert('MemoryToken contract not deployed to detected network.')
          }
        }

        componentWillMount()
        setCardArray(CARD_ARRAY.sort(() => 0.5 - Math.random()))
    }, [])

    function chooseImage(cardId){
        cardId = cardId.toString()
        if(cardsWon.includes(cardId)) {
          return window.location.origin + '/images/white.png'
        }
        else if(cardsChosenId.includes(cardId)) {
          return CARD_ARRAY[cardId].img
        } else {
          return window.location.origin + '/images/blank.png'
        }
    }
    
    async function flipCard(cardId){
        // let alreadyChosen = cardsChosen.length
    
        setCardsChosen([...cardsChosen, cardArray[cardId].name])
        setCardsChosenId([...cardsChosenId, cardId])
        console.log("cardsChosenId", cardsChosenId)
      }
    useEffect(()=> {
        let alreadyChosen = cardsChosen.length

        if (alreadyChosen === 2) {
          setTimeout(checkForMatch, 100)
        }
    }, [cardsChosenId])
      
    async function checkForMatch(){
        const optionOneId = cardsChosenId[0]
        const optionTwoId = cardsChosenId[1]
        console.log("optionOneId", optionOneId)
        console.log("optionTwoId", optionTwoId)
        if(optionOneId == optionTwoId) {
          alert('You have clicked the same image!')
        } else if (cardsChosen[0] === cardsChosen[1]) {
          alert('You found a match')
          token.methods.mint(
            account,
            window.location.origin + CARD_ARRAY[optionOneId].img.toString()
          )
          .send({ from: account })
          .on('transactionHash', (hash) => {
            setCardsWon([...cardsWon, optionOneId, optionTwoId])
            setTokenURIs([...tokenURIs, {tokenUri: CARD_ARRAY[optionOneId].img}])
          })
        } else {
          alert('Sorry, try again')
        }
        
        setCardsChosen([]);
        setCardsChosenId([]);
        if (cardsWon.length === CARD_ARRAY.length) {
          alert('Congratulations! You found them all!')
        }
      }
      
    return ( 
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content center">
                <div  className="col-md-4">
                    {cardArray.map((card, key)=>{
                    return(
                        <img 
                        key={key}
                        src={chooseImage(key)}
                        data-id={key}
                        onClick={(event) => {
                            let cardId = event.target.getAttribute('data-id')
                            if(!cardsWon.includes(cardId.toString())){
                                flipCard(cardId)
                            }
                        }}
                        />
                    )
                    })}
                </div>

                <div>

                  {tokenURIs && <h5>Tokens Collected: <span id="result">&nbsp;{tokenURIs.length}</span></h5>}

                  <div className="grid mb-4" >

                    { tokenURIs && tokenURIs.map((tokenURI, key) => {
                      return(
                        <img 
                          key={key}
                          src={tokenURI.tokenUri}
                        />
                      )
                    })}

                  </div>

                </div>

              </div>

            </main>
          </div>
        </div>
     );
}
 
export default Game;