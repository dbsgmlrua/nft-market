import { Card, CardGroup, Button, ListGroup, ListGroupItem } from "react-bootstrap";
const Home = () => {
    return ( 
        <div className="home">
                <Card border="dark" style={{ width: '18rem' }}>
                <Card.Img variant="top" src="/images/lotte.png" />
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem><Button variant="info">Buy</Button></ListGroupItem>
                </ListGroup>
                </Card>
                <Card border="dark" style={{ width: '18rem' }}>
                <Card.Img variant="top" src="/images/lotte.png" />
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem><Button variant="info">Buy</Button></ListGroupItem>
                </ListGroup>
                </Card>
        </div>
     );
}
 
export default Home;