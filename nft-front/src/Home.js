import { Container, Card, CardGroup, Button, ListGroup, ListGroupItem, Modal, Row } from "react-bootstrap";
import { useState, useEffect } from 'react';
import ethLogo from './eth-logo.png'
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApplePay, faEthereum } from "@fortawesome/free-brands-svg-icons";
const Home = (webdata) => {
    const [gamja, setGamja] = useState();
    const [account, setAccount] = useState();
    const [market, setMarket] = useState();
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState();
    const [buyShow, setBuyShow] = useState(false);
    const [buyProcess, setBuyProcess] = useState(false);
    const [confirmProcess, setConfirmProcess] = useState(false);
    const handleBuyClose = () => {
        setBuyShow(false);
        setBuyProcess(false);
    }
    const handleBuyShow = () => {
        setBuyShow(true);
        setBuyProcess(true);
        setConfirmProcess(false);
    }
    async function confirmCheckout(){
        await market.methods.buyItem(currentItem.itemId).send({from: account, value: getWeiFromPrice(currentItem.price)})
        .on('receipt', (receipt) => {
            getItemList()
            handleBuyClose()
        })
    }

    function getPrice(n) {
        return window.web3.utils.fromWei(n, 'ether');
    }
    function getWeiFromPrice(n) {
        return window.web3.utils.toWei(n, 'ether');
    }

    useEffect(() => {
        setGamja(webdata.gamja)
        setAccount(webdata.account)
        setMarket(webdata.market)
    }, [webdata])

    async function getItemList(){
        const balanceOf = await market.methods.getItemList().call({from: account})
        console.log("balanceOf", balanceOf)
        const items = await Promise.all(balanceOf.map(async i => {
            const tokenUri = await gamja.methods.tokenURI(i.tokenId).call()
            const ownerOf = await gamja.methods.ownerOf(i.tokenId).call()
            const response = await axios.get(tokenUri)
            console.log(response.data)

            let item = {
                itemId: i.itemId.toString(),
                price: getPrice(i.price.toString()),
                tokenId: i.tokenId.toString(),
                onSale: i.onSale,
                owner: ownerOf,
                tokenUri,
                image: response.data.image,
                name: response.data.name,
                description: response.data.description
            }
            return item
        }))
        console.log("items", items)
        setItems(items)
    }
    useEffect(()=>{

        if(market && gamja)
            getItemList()
    }, [market])

    function getPrice(n) {
        return window.web3.utils.fromWei(n, 'ether');
    }
    return ( 
        <Container>
            {(items && items.length == 0) && <div className="col-md-8 p-3"> <h1>Nothing to display...</h1> </div>}
            <CardGroup>
                {items && items.map((item, key) => {
                    return(
                        <div className="col-md-3 p-3" key={key}>
                            
                            <Card border="dark">
                                <a href={"/item/" + item.itemId} className="text-decoration-none">
                                    <Card.Img variant="top" src={item.image} height="286" />
                                </a>
                                <Card.Body>
                                    <Card.Title href="#">{item.name}</Card.Title>
                                    <Card.Text align="right"><FontAwesomeIcon icon={faEthereum} size="lg"/>&nbsp;&nbsp;{item.price}&nbsp;ETH</Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem><Button variant="primary" disabled={account == item.owner} onClick={()=>{
                                        handleBuyShow()
                                        setCurrentItem(item);
                                    }}>Buy</Button></ListGroupItem>
                                </ListGroup>
                            </Card>
                        </div>
                    )
                })}
            </CardGroup>

            {currentItem && 
            <Modal show={buyShow} onHide={handleBuyClose}>
                <Modal.Header closeButton>
                <Modal.Title>Complete checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <div className="col-md-2 m-1">
                            <img src={currentItem.image} width="auto" height="60px"/>    
                        </div>
                        <div className="col-md-6 m-1">
                            <h4>{currentItem.name}</h4>
                            <p><FontAwesomeIcon icon={faEthereum} size="lg"/> &nbsp;{currentItem.price}&nbsp; ETH</p>
                        </div>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleBuyClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={confirmCheckout} disabled={confirmProcess}>
                    Confirm checkout
                </Button>
                </Modal.Footer>
            </Modal>}
        </Container>
     );
}
 
export default Home;