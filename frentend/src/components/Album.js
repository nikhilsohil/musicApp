import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button, Table, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { playerAction } from '../store/player';
import TrackRow from '../reuseable/components/TrackRow';
import Loader from '../reuseable/components/Loader';
import ArtistCard from '../reuseable/components/ArtistCard';
import { song_api } from '../constants';

function Album() {
    const dispatch = useDispatch();
    const { albumId } = useParams();
    const [album, setAlbum] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { isLogin, } = useSelector(state => state.player);

    useEffect(() => {
        const getAlbum = async () => {
            try {
                const response = await axios.get(`${song_api}/albums?id=${albumId}`);
                setAlbum(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getAlbum();
    }, [albumId]);

    const handleAlbumPlay = () => {
        if (!isLogin) {
            navigate("/login");
        } else {
            dispatch(playerAction.updateQueue({ songs: album.songs, playlistId: albumId }));
            dispatch(playerAction.updateCurrentTrack(0));
            dispatch(playerAction.updateProgress(0));
            dispatch(playerAction.play());
        }
    };



    if (loading) {
        return <Loader />
    };
    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    console.log(album);


    return (
        <Container className=' h-100 px-2'>
            <Row className='m-0 h-100 w-100'>
                <Col className="h-100 flex-grow-1 scroll overflow-auto">

                    <Row className='m-0 my-5'>
                        <Col md={3} className='d-flex justify-content-center align-content-center'>
                            {album && <>
                                <Image
                                    className='w-75 shadow'
                                    src={album.image.find(img => img.quality === "500x500").url}
                                    alt={album.name}
                                />
                            </>}
                        </Col>
                        <Col md={9} className='text-capitalize d-flex flex-column justify-content-center align-content-center'>
                            <h1>{album.name}</h1>
                            <p>{album.description}</p>
                            <Button onClick={handleAlbumPlay} className='w-25 rounded-pill'>
                                Play
                            </Button>
                        </Col>
                    </Row>

                    <Row className='m-0 w-100'>
                        <Table className='w-100' hover>
                            <tbody>
                                {album.songs?.map((track, i) => (
                                    <TrackRow key={i} playList={album} index={i} track={track} songs={album.songs} />
                                ))}
                            </tbody>
                        </Table>
                    </Row>

                    <h2 className="m-0 mt-4 ">Artists</h2>
                    <Row className='m-0 w-100'>
                        <Col className='p-0 d-flex scroll  overflow-auto w-100'>
                            {
                                album.artists.primary.map((artist) => {
                                    return <ArtistCard key={artist.id} artist={artist} />
                                })
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Album;
