/* eslint-disable no-unused-vars */
import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../Context/Auth';

function Header1() {
  const { isAuth, handleLogout } = useAuthContext()



  return (
    <Navbar expand="lg" className="bg-dark navbar-dark p-4">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Link className='text-light nav-link mx-3 fw-bold ' to="/user-booking">Booking</Link>
          <Link className='text-light nav-link mx-3 fw-bold ' to="/user-data">Show Data</Link>
          <Link className='text-light nav-link  text-center  fw-bold p-1' onClick={handleLogout} >Logout</Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header1;