import React from 'react';
import { Container, ListGroup,Image } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import logo from "../images/logo2.png";

function SideNavbar() {
    const location = useLocation();
    return (
        <>
            <Container fluid className='h-100 m-0 p-0 bg-body-secondary  border border-5 border-top-0 border-bottom-0 ' >
                <ListGroup className='h-100' >
                    <ListGroup.Item className=' bg-body-secondary py-4' role='heading' to="" > <Image src={logo} alt='Tunetream' className=' w-100 h-100' /> </ListGroup.Item>
                    <ListGroup.Item className={` ${location.pathname === "/" ? 'bg-white' : 'bg-body-secondary'}`} action as={Link} to="/">Home</ListGroup.Item>
                    <ListGroup.Item className={` ${location.pathname === "/topplaylists" ? 'bg-white' :'bg-body-secondary'} `} action as={Link} to="/topplaylists">Playlist</ListGroup.Item>
                    <ListGroup.Item className={` ${location.pathname === "/topsongs" ? 'bg-white' : 'bg-body-secondary'}  `} action as={Link} to="/topsongs">Songs</ListGroup.Item>
                    {/* <ListGroup.Item className={` ${location.pathname === "/album" ? 'bg-white' : 'bg-body-secondary'}  `} action as={Link} to="/album">Album</ListGroup.Item> */}
                    <ListGroup.Item className={` ${location.pathname === "/library" ? 'bg-white' : 'bg-body-secondary'}  `} action as={Link} to="/library">Library</ListGroup.Item>
                    {/* <ListGroup.Item action as={Link} to="#">Genre</ListGroup.Item>
                    <ListGroup.Item action as={Link} to="#">About</ListGroup.Item>
                    <ListGroup.Item action as={Link} to="#">Contact</ListGroup.Item> */}
                </ListGroup>
            </Container>
        </>
    )
}

export default SideNavbar