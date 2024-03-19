import {Navbar, Nav, Container} from 'react-bootstrap';

const Header = () => {
  return (
    <header>
        <Navbar className='navbar navbar-light' expand='lg' collapseOnSelect>
            <Container>
                <Navbar.Brand href='/'>TUF-TASK</Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav'></Navbar.Toggle>
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ms-auto'>
                        <Nav.Link href='/usercode'>List Of Submissions</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header
