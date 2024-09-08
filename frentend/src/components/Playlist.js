import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, } from 'react-redux';
import { playerAction } from '../store/player';
import Alert from '../reuseable/components/Alert';
import TrackRow from '../reuseable/components/TrackRow';
import Loader from '../reuseable/components/Loader';
import { FaPlus } from 'react-icons/fa';


const Playlist = () => {

    const { playListId, type } = useParams();


    const dispatch = useDispatch();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate=useNavigate();
    // Fetch playlist data from API
    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                if (type === "custom") {

                    const response = await axios.get(`http://localhost:5000/playlist/${playListId}`);
                    console.log(response);
                    setPlaylist(response.data.data);
                } else {
                    const response = await axios.get(`https://saavn.dev/api/playlists?id=${playListId}`);
                    setPlaylist(response.data.data);
                }
            } catch (err) {
                setError(true);
                console.error('Failed to fetch playlist:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylist();
    }, [playListId]);


    const handlePlaylistPlay = () => {
        dispatch(playerAction.updateQueue({ songs: playlist.songs, playlistId: playListId }));
        dispatch(playerAction.updateCurrentTrack(0));
        dispatch(playerAction.updateProgress(0));
        dispatch(playerAction.play());

    };


    if (loading) {
        return <Loader />;
    }
    // Render error state
    if (error) {

        return (<>
            <Container className=' h-100 px-2 d-flex flex-wrap justify-content-center align-content-center'>

                <Alert msg={"Error in getting playlist "} />
            </Container>
        </>)
    }

    // Render playlist and songs
    return (
        <Container className=' h-100 p-2'>
            <Row className='m-0 h-100 w-100  '>
                <Col className="h-100 flex-grow-1 scroll overflow-auto" >
                    <Row className='m-0 my-5'>
                        <Col md={3}
                            className='d-flex  justify-content-center align-content-center'>
                            {playlist.image?.length > 0 && (
                                <Image
                                    style={{ width: '14vw' }}
                                    className='w-75 shadow'
                                    src={playlist.image.find(img => img.quality === "500x500").url}
                                    alt={playlist.name}
                                />
                            )}
                        </Col>
                        <Col md={9}
                            className='text-capitalize d-flex flex-column justify-content-center align-content-center'>
                            <h3>{playlist.name}</h3>
                            {
                                playlist.description &&
                                <p>{playlist.description}</p>
                            }
                            <div>
                                <Button
                                    onClick={handlePlaylistPlay}
                                    className='w-25 rounded-pill me-3'>
                                    Play
                                </Button>
                                {
                                    type === "custom"&&
                                    <Button
                                        variant='outline-secondary'
                                        onClick={() => navigate("/")}
                                        className='rounded-circle justify-content-center align-content-center'>
                                        <FaPlus className='h-100' />
                                    </Button>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row className='m-0 w-100'>
                        <Table className='w-100' hover>
                            <tbody>
                                {playlist.songs?.map((track, i) =>
                                    <TrackRow key={i} playList={playlist} index={i} track={track} songs={playlist.songs} />
                                )
                                }
                            </tbody>
                        </Table>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Playlist;