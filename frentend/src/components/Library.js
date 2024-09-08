import React, { useEffect, useState, } from 'react';
import { Container, Card, Col, Row, Image, Button, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { playerAction } from '../store/player';
import Coustam from '../reuseable/components/Coustam';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";
import AddPlaylist from '../reuseable/components/AddPlaylist';
import Loader from '../reuseable/components/Loader';
import ArtistCard from '../reuseable/components/ArtistCard';
import SongTable from '../reuseable/components/SongTable';
import UpdateImage from '../reuseable/components/UpdateImage';
import { backend_Base_url } from '../constants';

function Library() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('playlists');
    const [myPlaylists, setMyPlaylists] = useState([]);
    const [addNewPlaylist, setAddNewPlaylist] = useState(false);
    const { isLogin, likedSongs, likedArtists, user } = useSelector(state => state.player);
    const [likedSongsData, setLikedSongsData] = useState([]);
    const [likedArtistData, setLikedArtistData] = useState([]);
    const [likedSongError, setLikedSongError] = useState(null);
    const [artistError, setArtistError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState('');




    useEffect(() => {
        if (!isLogin) {
            navigate('/login')
        }
        if (user) {
            setProfileImage(user.profileURL)
        }
    })

    const handleLogout = () => {
        dispatch(playerAction.logout());
        navigate('/');
    };

    useEffect(() => {
        if (user) {

            setProfileImage(user.profileURL);
        }
    }, [user])




    useEffect(() => {
        
        const fetchPlaylists = async () => {
            try {
                 const response = await axios.get(`${backend_Base_url}/playlist`, {
                    params: {
                        userId: JSON.parse(localStorage.getItem('user'))._id
                    }
                });
                setMyPlaylists(response.data.playlists);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };
        fetchPlaylists();
    }, [addNewPlaylist]);

    useEffect(() => {
        if (!isLogin) {
            navigate('/login');
        }


        const fetchSongs = async () => {
            try {
                const responses = await Promise.all(
                    likedSongs.map(id => axios.get(`https://saavn.dev/api/songs/${id}`))
                );
                const data = responses.map(response => response.data.data[0]);
                setLikedSongsData(data);
            } catch (err) {
                setLikedSongError(err.message);
                console.error(err);
            }
        };

        if (likedSongs.length > 0) {

            fetchSongs();
        }


    }, []);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true);
                const responses = await Promise.all(
                    likedArtists.map(artistId => axios.get(`https://saavn.dev/api/artists/${artistId}`))
                );
                const data = responses.map(response => response.data.data);
                setLikedArtistData(data);
            } catch (err) {
                setArtistError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (likedArtists.length > 0) fetchArtists();
    }, [likedArtists]);

    const [showModal, setShowModal] = useState(false);


    if (!user) {
        return null;
    }
    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <UpdateImage showModal={showModal} setShowModal={setShowModal} />


            <Container fluid className='h-100  bg-body-secondary  flex-grow-1 scroll overflow-auto'>
                <Row className='m-0 py-3 '>
                    <Col md={3} className='d-flex  justify-content-center align-content-center' style={{ maxHeight: "400px" }}>
                        <Image
                            style={{ width: '400px', maxWidth: "10rem", cursor: 'pointer', transition: 'transform 0.3s ease-in-out' }}
                            className='w-100  shadow h-100'
                            roundedCircle
                            src={profileImage}
                            alt={user.name}
                            onClick={() => setShowModal(true)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />

                    </Col>
                    <Col md={8} className=' text-capitalize d-flex justify-content-between  align-items-center '>
                        <div>

                            <h3>{user.name}</h3>
                        </div>
                        <div>
                            <Button
                                variant='outline-secondary'
                                className=' rounded-pill '
                                onClick={handleLogout}>
                                logout
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row className='p-0 m-0 w-100'>
                    <Col xs={12} md={3} className="p-0 py-4 mb-4 h-100 flex-grow-1 scroll overflow-auto">
                        <div className='d-flex d-md-block justify-content-around w-100'>
                            <p role='button'
                                onClick={() => setActiveTab('playlists')}
                                className={` p-2 mb-0 border  flex-grow-1 text-center ${activeTab === 'playlists' ? "bg-primary text-white rounded border-white" : "bg-white"}`}>
                                Playlists
                            </p>
                            <p role='button'
                                onClick={() => setActiveTab('likedSongs')}
                                className={` p-2 mb-0 border rounded flex-grow-1 text-center ${activeTab === 'likedSongs' ? "bg-primary  text-white border-white" : "bg-white"}`}>
                                liked Songs
                            </p>
                            <p role='button'
                                onClick={() => setActiveTab('likedArtists')}
                                className={` p-2 mb-0 border rounded flex-grow-1 text-center ${activeTab === 'likedArtists' ? "bg-primary  text-white border-white" : "bg-white"}`}>
                                Liked Artists
                            </p>
                        </div>
                    </Col>
                    <Col xs={12} md={9} className='py-4'>
                        {
                            activeTab === 'playlists' &&
                            <Row >
                                <Card role='button' style={{ width: '14vw', minWidth: "10rem", position: 'relative' }} onClick={() => setAddNewPlaylist(true)} className='p-0 m-3'>

                                    <Button className='w-100 '>
                                        <FaPlus size="3rem" />
                                    </Button>
                                    <Card.Body>
                                        <Card.Text className='w-100 fs-6 text-nowrap fw-semibold' style={{ overflow: "hidden", textOverflow: 'ellipsis' }}>
                                            {"Add New"}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>



                                {
                                    myPlaylists && myPlaylists.length > 0 &&
                                    myPlaylists.map((playlist, i) => (
                                        <Coustam key={i} playlist={playlist} />
                                    ))

                                }


                            </Row>
                        }
                        {
                            activeTab === 'likedSongs' &&
                            <Row>
                                <Col className="my-3 ">
                                    {likedSongError && <p className="text-danger">Error loading liked songs: {likedSongError}</p>}
                                    {likedSongsData.length > 0 ?
                                        <SongTable songs={likedSongsData} /> : (

                                            <Col xs={12}><h2>No liked songs yet.</h2></Col>
                                        )}
                                </Col>
                            </Row>
                        }
                        {
                            activeTab === 'likedArtists' &&
                            <Row>
                                <Col className="my-3 ">
                                    {artistError && <p className="text-danger">Error loading Artist songs: {likedSongError}</p>}
                                    {likedArtistData.length > 0 ?
                                        likedArtistData.map((artist, index) =>
                                            <ArtistCard artist={artist} key={index} />) : (

                                            <Col xs={12}><h2>No liked songs yet.</h2></Col>
                                        )}
                                </Col>
                            </Row>
                        }

                        {/* <Tab eventKey="settings" title="Settings">
                                <Setting />
                            </Tab> */}

                    </Col>
                </Row >


            </Container >

            {addNewPlaylist && <AddPlaylist show={addNewPlaylist} setShow={setAddNewPlaylist} />
            }
        </>
    );
}

export default Library;
