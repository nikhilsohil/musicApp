import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Row, Col, Button, Image, ListGroup, OverlayTrigger } from 'react-bootstrap';
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchList from '../reuseable/components/SearchList';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import { playerAction } from '../store/player';
import logo from "../images/logo2.png";
import { song_api } from '../constants';

function SearchBar() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isLogin, user } = useSelector(state => state.player);
    const [show, setShow] = useState(false);
    const iconRef = useRef(null);
    const listGroupRef=useRef(null);
    const dispatch = useDispatch();

    const searchBarRef = useRef(null);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        if (!query.trim()) {
            setResults({});
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${song_api}/search?query=${query}`);
            setResults(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        const timeoutId = setTimeout(fetchData, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setIsFocused(false);
            }
            if (listGroupRef.current && !listGroupRef.current.contains(event.target)) {
                setShow(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNavigation = (path) => {
        setIsFocused(false);
        navigate(path);
    };

    return (
        <Container ref={searchBarRef} className={`p-0 bg-body-secondary position-relative z-3   text-center ${isFocused ? 'shadow-lg' : ''}`}>
            <Row className='rounded-top w-100 '>
                {
                    !isFocused &&
                    <Col md={2} className='d-none d-md-block h-100'>
                        <Link to='/' className='text-decoration-none text-black h-100'>
                            <Image src={logo} alt='Tunetream' className='w-100 ' />
                        </Link>
                    </Col>
                }
                <Col className='d-flex mx-3 pb-2 justify-content-center align-content-center'>
                    <div className={`position-relative searchBar ${isFocused ? 'w-100' : 'w-50'}`} >
                        <input
                            className='w-100 rounded-pill border border-3 bg-white'
                            style={{ outline: 'none', height: '2rem', padding: '0rem 2rem' }}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search..."
                            onFocus={() => setIsFocused(true)}
                            aria-label="Search"
                        />
                        <CiSearch style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', fontSize: '1.2rem', color: '#888' }} />
                    </div>
                </Col>
                {

                    !isFocused &&
                    <Col md={2} className='d-none d-md-block position-relative' >
                        {
                            isLogin ?
                                <>
                                    <span className='d-inline' role='button' ref={iconRef} placement='buttom' as={OverlayTrigger} onClick={() => setShow(!show)}>
                                        <FaRegUserCircle size={"2rem"} className='' />
                                    </span>{
                                        show &&
                                        <ListGroup ref={listGroupRef} className='h-100 position-absolute end-0' >
                                            <ListGroup.Item className="text-start aria-labels" role='' >{user.name}</ListGroup.Item>
                                            <ListGroup.Item className="text-start" role='button'
                                                onClick={() => { setShow(false); navigate('/myaccount') }} >My Account</ListGroup.Item>
                                            <ListGroup.Item className="text-start" role='button'
                                                onClick={() => {dispatch(playerAction.logout()) ;setShow(false);}}>Log Out</ListGroup.Item>
                                        </ListGroup>
                                    }

                                </>
                                :
                                <>
                                    <Link to='/login' className='text-decoration-none fw-semibold me-3 text-black'>Log In</Link>
                                    {/* <Link to='/signUp' className='text-decoration-none fw-semibold text-black'>Sign Up</Link> */}
                                </>

                        }
                    </Col>
                }

            </Row>
            {isFocused && (
                <>
                    <Row className={`position-absolute rounded-bottom searchResults m-0  w-100  shadow-lg bg-body-secondary ${isFocused ? 'active' : ''}`}>
                        <Col>
                            <Row className='p-3'>
                                {error ? (
                                    <div className="text-danger">{error}</div>
                                ) : loading ? (
                                    <div className="text-center">
                                        <p>Loading...</p>
                                    </div>
                                ) : (
                                    <>
                                        <Col md={4} className="text-start">
                                            {results.songs && (
                                                <>
                                                    <div className='d-flex justify-content-between mb-2'>
                                                        <p className='fw-semibold m-0'>Songs</p>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            className='fs-6 py-0 rounded-pill'
                                                            onClick={() => handleNavigation(`/search/songs/${query}`)}
                                                        >
                                                            View more
                                                        </Button>
                                                    </div>
                                                    {results.songs.results.map((song) => (
                                                        <SearchList key={song.id} data={song} link={`/song/${song.id}`} />
                                                    ))}
                                                </>
                                            )}
                                        </Col>
                                        <Col md={4} className="text-start">
                                            {results.artists && (
                                                <>
                                                    <div className='d-flex justify-content-between mb-2'>
                                                        <p className='fw-semibold m-0'>Artists</p>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            className='fs-6 py-0 rounded-pill'
                                                            onClick={() => handleNavigation(`/search/artists/${query}`)}
                                                        >
                                                            View more
                                                        </Button>
                                                    </div>
                                                    {results.artists.results.map((artist) => (
                                                        <SearchList key={artist.id} data={artist} link={`/artist/${artist.id}`} />
                                                    ))}
                                                </>
                                            )}
                                        </Col>
                                        <Col md={4} className="text-start">
                                            {results.albums && (
                                                <>
                                                    <div className='d-flex justify-content-between mb-2'>
                                                        <p className='fw-semibold m-0'>Albums</p>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            className='fs-6 py-0 rounded-pill'
                                                            onClick={() => handleNavigation(`/search/albums/${query}`)}
                                                        >
                                                            View more
                                                        </Button>
                                                    </div>
                                                    {results.albums.results.map((album) => (
                                                        <SearchList key={album.id} data={album} link={`/album/${album.id}`} />
                                                    ))}
                                                </>
                                            )}
                                        </Col>
                                    </>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default SearchBar;
