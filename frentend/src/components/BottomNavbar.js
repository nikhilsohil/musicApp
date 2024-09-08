import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

import { FaHome, FaSearch, FaUser } from 'react-icons/fa';
import { MdLibraryMusic } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function BottomNavbar() {
    const {isLogin}=useSelector(state=>state.player)
    return (
        <Navbar bg="light" variant="light" className="d-flex justify-content-around border-top">
                <Nav.Link as={Link} to="/">
                    <FaHome size="1.5rem" />
                    <br />
                    Home
                </Nav.Link>
         
            {/* <Nav.Link as={Link}  to="/search">
                
                    <FaSearch size="1.5rem" />
                    <br />
                    Search
                </Nav.Link> */}
      
            < Nav.Link as={Link} to="/library">
                
                    <MdLibraryMusic size="1.5rem" />
                    <br />
                    Library
                </Nav.Link>
          
            <Nav.Link as={Link}  to={isLogin?"/myaccount":"/login"}>
                    <FaUser size="1.5rem" />
                    <br />
                    {
                        isLogin?
                        <span>Profile</span>
                        :
                        <span>Log In</span>
                    }
                    
                </Nav.Link>
          
        </Navbar>
    );
}

export default BottomNavbar;
