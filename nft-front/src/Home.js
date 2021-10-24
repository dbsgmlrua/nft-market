import { Container, Col, Card, CardGroup, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { useState, useEffect } from 'react';
import ethLogo from './eth-logo.png'
const Home = (items) => {
    useEffect(() => {

    }, [items])
    return ( 
        <Container>
            <CardGroup>
                <div className="col-md-4 p-3">
                    <Card border="dark">
                        <Card.Img variant="top" src="/images/lotte.png" />
                        <Card.Body>
                            <Card.Title><img src={ethLogo} height='32' alt=""/>&nbsp;&nbsp;&nbsp; 10 ETH</Card.Title>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem><Button variant="info">Buy</Button></ListGroupItem>
                        </ListGroup>
                    </Card>
                </div>
                <div className="col-md-4 p-3">
                    <Card border="dark">
                        <Card.Img variant="top" src="/images/lotte.png" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem><Button variant="info">Buy</Button></ListGroupItem>
                        </ListGroup>
                    </Card>
                </div>
                <div className="col-md-4 p-3">
                    <Card border="dark">
                        <Card.Img variant="top" src="/images/lotte.png" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem><Button variant="info">Buy</Button></ListGroupItem>
                        </ListGroup>
                    </Card>
                </div>
                <div className="col-md-4 p-3">
                    <Card border="dark">
                        <Card.Img variant="top" src="/images/lotte.png" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem><Button variant="info">Buy</Button></ListGroupItem>
                        </ListGroup>
                    </Card>
                </div>
                <div className="col-md-4 p-3">
                    <Card border="dark">
                        <Card.Img variant="top" src="/images/lotte.png" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem><Button variant="info">Buy</Button></ListGroupItem>
                        </ListGroup>
                    </Card>
                </div>
                <div className="col-md-4 p-3">
                    <Card border="dark">
                        <Card.Img variant="top" src="/images/lotte.png" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem><Button variant="info">Buy</Button></ListGroupItem>
                        </ListGroup>
                    </Card>
                </div>
            </CardGroup>

        </Container>
     );
}
 
export default Home;