import { Navbar, Container, Nav } from "react-bootstrap";
import Identicon from "identicon.js";

const ReactNav = ( { account } ) => {

    return ( 
        <Navbar bg="dark" variant="dark">
              <Container>
                  <Navbar.Brand href="/">
                      NFT Market
                  </Navbar.Brand>
                  <Nav className="me-auto">
                      <Nav.Link href="/">Home</Nav.Link>
                      <Nav.Link href="/create">Create</Nav.Link>
                      <Nav.Link href="/collection">MyCollections</Nav.Link>
                  </Nav>
                    <small className="text-secondary">
                        
                        <small id="account">{account}</small>
                        {account ? <img
                            className="ml-2"
                            width="30"
                            height="30"
                            src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
                        /> : <span></span>}
                    </small>
              </Container>
          </Navbar>
     );
}
 
export default ReactNav;