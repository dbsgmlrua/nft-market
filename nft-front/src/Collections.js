import { Container, Card, CardGroup, Button, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { useState, useEffect } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const Collections = (webdata) => {   
    const [gamja, setGamja] = useState();
    const [account, setAccount] = useState();
    const [market, setMarket] = useState();
    const [items, setItems] = useState([]);

    useEffect(() => {
        setGamja(webdata.gamja)
        setAccount(webdata.account)
        setMarket(webdata.market)
    }, [webdata])
    useEffect(()=>{
        async function getItemList(){
            const balanceOf = await market.methods.getMyItemList().call({from: account})
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

        if(market && gamja)
            getItemList()
    }, [market])

    function getPrice(n) {
        return window.web3.utils.fromWei(n, 'ether');
    }
    return ( 
        <Container>
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
                                    <Card.Text align="right"><FontAwesomeIcon icon={faEthereum} size="lg"/>&nbsp; {item.price}&nbsp;ETH</Card.Text>
                                    <Card.Text align="right">
                                        
                                    <p className="text-muted">On Sale : <FontAwesomeIcon icon={item.onSale ? faCheckCircle : faExclamationCircle} size="lg" className={item.onSale ? "text-success" : "text-danger"}/></p>
                                            
                                    </Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem><Button variant="info">Buy</Button></ListGroupItem>
                                </ListGroup>
                            </Card>
                        </div>
                    )
                })}
            </CardGroup>

        </Container>
     );
}
 
export default Collections;