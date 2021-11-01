import { useHistory, useParams } from "react-router";
import { useState, useEffect } from 'react';
import { Container, Row, Modal, Button, InputGroup, FormControl, Card, CardGroup } from "react-bootstrap";
import ethLogo from './eth-logo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faPen, faArrowRight, faCheckCircle, faExclamationCircle  } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const DetailPage = (webdata) => {
    const [gamja, setGamja] = useState();
    const [account, setAccount] = useState();
    const [market, setMarket] = useState();
    const [item, setItem] = useState();

    const [buyShow, setBuyShow] = useState(false);
    const [priceEditShow, setPriceEditShow] = useState(false);
    const [onSaleEditShow, setOnSaleEditShow] = useState(false);
    const [buyProcess, setBuyProcess] = useState(false);
    const [confirmProcess, setConfirmProcess] = useState(false);
    const [newPrice, setNewPrice] = useState('');

    const [isOwnerOf, setIsOwnerOf] = useState(false);

    const handleBuyClose = () => {
        setBuyShow(false);
        setBuyProcess(false);
    }
    const handleBuyShow = () => {
        setBuyShow(true);
        setBuyProcess(true);
        setConfirmProcess(false);
    }
    const handlePriceEditClose = () => setPriceEditShow(false);
    const handlePriceEditShow = () => setPriceEditShow(true);
    const handleOnSaleEditClose = () => setOnSaleEditShow(false);
    const handleOnSaleEditShow = () => setOnSaleEditShow(true);
  
    useEffect(() => {
        setGamja(webdata.gamja)
        setAccount(webdata.account)
        setMarket(webdata.market)
    }, [webdata])
    useEffect(()=>{
        if(market && gamja)
            getItemDetail()
    }, [market])

    async function getItemDetail(){
        const balanceOf = await market.methods.getItemDetail(id).call({from: account})
        console.log("balanceOf", balanceOf)

        const tokenUri = await gamja.methods.tokenURI(balanceOf.tokenId).call()
        const ownerOf = await gamja.methods.ownerOf(balanceOf.tokenId).call()
        const response = await axios.get(tokenUri)
        let item = {
            itemId: balanceOf.itemId.toString(),
            price: getPrice(balanceOf.price.toString()),
            tokenId: balanceOf.tokenId.toString(),
            onSale: balanceOf.onSale,
            owner: ownerOf,
            tokenUri,
            image: response.data.image,
            name: response.data.name,
            attributes: response.data.attributes,
            description: response.data.description
        }

        setItem(item);
        setIsOwnerOf(account == item.owner);
        setBuyProcess(account == item.owner);
    }

    function getPrice(n) {
        return window.web3.utils.fromWei(n, 'ether');
    }
    function getWeiFromPrice(n) {
        return window.web3.utils.toWei(n, 'ether');
    }
    function getOnSaleStatus(onSale){
        return <FontAwesomeIcon icon={onSale ? faCheckCircle : faExclamationCircle} size="lg" className={onSale ? "text-success" : "text-danger"}/>
    }

    async function confirmCheckout(){
        await market.methods.buyItem(item.itemId).send({from: account, value: getWeiFromPrice(item.price)})
        .on('receipt', (receipt) => {
            getItemDetail()
            handleBuyClose()
        })
        // handleBuyClose()
    }
    async function priceEdit(){
        await market.methods.changeSalePrice(item.itemId, getWeiFromPrice(newPrice)).send({from: account})
        .on('receipt', (receipt) => {
            getItemDetail()
            handlePriceEditClose()
        })
    }

    async function onSaleEdit(){
        await market.methods.changeOnSaleStatus(item.itemId, !item.onSale).send({from: account})
        .on('receipt', (receipt) => {
            getItemDetail()
            handleOnSaleEditClose()
        })

    }
    const enabled = newPrice && newPrice.length > 0;
    const { id } = useParams();


    return (
        <Container>
            { item &&
            <Row>
                <div className="col-md-6 m-2">
                    <img src={item.image} width="100%" height="auto" />
                    <hr />
                    <h3>Properties</h3>
                    <Row>
                        <CardGroup>
                            {item.attributes && item.attributes.map((x,i)=>{
                                return(
                                    <div className="col-md-3 p-1" key={i}>
                                        <Card className="text-center">
                                            <Card.Body>
                                                <Card.Subtitle className="mb-2 text-muted ">{x.trait_type}</Card.Subtitle>
                                                <Card.Text>
                                                    {x.value}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                )
                            })}
                        </CardGroup>
                    </Row>
                </div>
                <div className="col-md-5 m-2">
                    <h1>{item.name}</h1>
                    <div className="card">
                        <div className="card-header">
                            <p className="text-muted">
                                Owned by {item.owner}
                            </p>
                        </div>
                        <div className="card-body">
                            <p className="text-muted">Current price</p>
                            <h5 className="card-title"><FontAwesomeIcon icon={faEthereum} size="lg"/> &nbsp;{item.price}&nbsp; ETH&nbsp;&nbsp;&nbsp; {isOwnerOf && <a href="#" onClick={()=>{ handlePriceEditShow() }} className="text-reset"><FontAwesomeIcon icon={faPen} /></a>}</h5>
                            <Button variant="primary" onClick={handleBuyShow} disabled={buyProcess}>
                                Buy now
                            </Button>
                        </div>
                    </div>
                    <hr />
                    <h3>Description</h3>
                    <p className="text-justify">{item.description}</p>
                    <hr />
                    <p className="d-inline text-muted">On Sale : {getOnSaleStatus(item.onSale)}&nbsp;&nbsp;&nbsp;&nbsp;</p>
                    {isOwnerOf && 
                    <Button variant="light" onClick={handleOnSaleEditShow}>
                        Change status
                    </Button>}
                </div>
            </Row>}

            {item && 
            <Modal show={buyShow} onHide={handleBuyClose}>
                <Modal.Header closeButton>
                <Modal.Title>Complete checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <div className="col-md-2 m-1">
                            <img src={item.image} width="auto" height="60px"/>    
                        </div>
                        <div className="col-md-6 m-1">
                            <h4>{item.name}</h4>
                            <p><FontAwesomeIcon icon={faEthereum} size="lg"/> &nbsp;{item.price}&nbsp; ETH</p>
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
            
            {item && 
            <Modal show={priceEditShow} onHide={handlePriceEditClose}>
                <Modal.Header closeButton>
                <Modal.Title>Edit price</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted">Current price</p>
                    <Row>
                        <div className="col-md-4 m-1">
                            <p><FontAwesomeIcon icon={faEthereum} size="lg"/> &nbsp;{item.price}&nbsp; ETH &nbsp;&nbsp; <FontAwesomeIcon icon={faArrowRight} size="lg"/></p>
                        </div>
                        <div className="col-md-7 m-1">
                        <InputGroup className="mb-3">
                            <FormControl
                            type="number" 
                            min="0"
                            placeholder="Place new price"
                            onChange={e=>{
                                setNewPrice(e.target.value)
                                console.log("enabled", enabled)
                            }}
                            />
                        </InputGroup>
                        </div>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handlePriceEditClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={priceEdit} disabled={!enabled}>
                    Confirm checkout
                </Button>
                </Modal.Footer>
            </Modal>}

            {item && 
            <Modal show={onSaleEditShow} onHide={handleOnSaleEditClose}>
                <Modal.Header closeButton>
                <Modal.Title>Change sale status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted">On Sale : </p>
                    <Row>
                        <div className="col-md-12 m-1" align="center">
                            <p>{getOnSaleStatus(item.onSale)}&nbsp;&nbsp;&nbsp; <FontAwesomeIcon icon={faArrowRight} size="lg"/>&nbsp;&nbsp;&nbsp; {getOnSaleStatus(!item.onSale)}</p>
                        </div>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleOnSaleEditClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={onSaleEdit}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>}
        </Container>
     );
}
 
export default DetailPage;