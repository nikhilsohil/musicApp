import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button, Tabs, Tab, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { playerAction } from '../store/player';
import { useSelector, useDispatch } from 'react-redux';
import TrackRow from '../reuseable/components/TrackRow';
import AlbumCard from '../reuseable/components/AlbumCard';
import ArtistCard from '../reuseable/components/ArtistCard';
import Loader from '../reuseable/components/Loader';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { likeArtist, unlikeArtist } from '../store/asyncAction';
import { song_api } from '../constants';


function Artist() {
    const { isLogin, likedArtists } = useSelector(state => state.player);
    const [artist, setArtist] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { artistId } = useParams();


    useEffect(() => {
        const getArtist = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${song_api}/artists/${artistId}`);
           

                setArtist(response.data.data);
            } catch (error) {
                console.error("Failed to fetch artist data:", error);
            } finally {
                setLoading(false);
            }
        };
        getArtist();
    }, [artistId]);

    useEffect(() => {

        setIsLiked(likedArtists.includes(artistId));

    }, [artistId, likedArtists])


    const handleArtistPlay = () => {
        if (!isLogin) {
            navigate('/login');
        } else {

            dispatch(playerAction.updateQueue({ songs: artist.topSongs, playlistId: artistId }));
            dispatch(playerAction.updateCurrentTrack(0));
            dispatch(playerAction.updateProgress(0));
            dispatch(playerAction.play());
        }

    };

    const handleToggleLike = () => {
        if (!isLogin) {
            navigate('/login');
            return;
        }

        if (isLiked) {
            dispatch(unlikeArtist({artistId: artist.id}));
        } else {
            dispatch(likeArtist({artistId: artist.id}));
        }
        setIsLiked((prev) => !prev);
    };



    if (loading) {
        return <Loader />;
    };
    if (!artist?.name) return <div>No artist data available.</div>;

    return (
        <Container className=' h-100 px-2'>
            <Row className='m-0 h-100 w-100  '>

                <Col className="h-100 flex-grow-1 scroll overflow-auto" >
                    <Row className='m-0 my-5 '>
                        <Col md={3}
                            className='d-flex  justify-content-center align-content-center'
                        >
                            {artist.image && artist.image.length > 0 && (
                                <Image
                                    // style={{ width: '14vw' }}
                                    className='w-100 shadow'
                                    roundedCircle
                                    src={artist.image.find(img => img.quality === "150x150")?.url || ""}
                                    alt={artist.name}
                                />
                            )}
                        </Col>
                        <Col md={9}
                            className=' text-capitalize d-flex flex-column justify-content-center align-content-center'
                        >
                            <h1>{artist.name}</h1>
                            <p>{artist.type} {artist.fanCount} Listeners</p>
                            <div>

                                <Button
                                    onClick={handleArtistPlay}

                                    className='w-25 rounded-pill me-3 '>
                                    Play
                                </Button>
                                {

                                    !isLiked ? <FaRegHeart role='button' size={"1.7rem"} onClick={handleToggleLike} /> :
                                        <FaHeart role='button' size={"1.7rem"} style={{ color: "#ff140a", }} onClick={handleToggleLike} />

                                }

                            </div>
                        </Col>
                    </Row>



                    <Row className='m-0 w-100'>

                        <Tabs
                            defaultActiveKey="songs"
                        // onSelect={(k) => setKey(k)}
                        className='p-0'
                        >
                            <Tab eventKey="songs" title="Songs" className='p-0 '>
                                <h1>Top Songs</h1>
                                <Table className='w-100' hover>
                                    <tbody>
                                        {
                                            artist.topSongs && artist.topSongs.length > 0 ?
                                                artist.topSongs.map((song, i) =>
                                                    <TrackRow key={i} playList={artist} index={i} track={song} songs={artist.topSongs} />
                                                ) :
                                                <tr>No songs available.</tr>
                                        }
                                    </tbody>
                                </Table>
                            </Tab>


                            <Tab eventKey="albums" title="Albums" className='p-0'  >
                                <h1>Top Albums</h1>
                                <Row className='flex-grow-1 scroll overflow-auto'>
                                    <Col className='d-flex scroll  overflow-auto'>

                                    {/* <Col className='p-0 d-flex flex-wrap scroll  overflow-auto justify-content-around'> */}

                                        {
                                            artist.topAlbums && artist.topAlbums.length > 0 &&
                                            artist.topAlbums.map((album, i) => (
                                                <AlbumCard album={album} key={i} />
                                            ))
                                        }
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Row>
                    <Row className='m-0 w-100 '>
                        {
                            artist.similarArtists && artist.similarArtists.length > 0 ? (<>
                                <h2>Related Artists</h2>
                                <Row className='flex-grow-1 scroll overflow-auto m-0 p-0 w-100'>
                                    <Col className='p-0 d-flex scroll  overflow-auto w-100'>
                                        {
                                            artist.similarArtists.map((artist) =>
                                                <ArtistCard artist={artist} key={artist.id} />

                                            )
                                        }
                                    </Col>
                                </Row>
                            </>
                            )
                                : <></>

                        }
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Artist;
