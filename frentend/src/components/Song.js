import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { playerAction } from '../store/player';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SongCard from '../reuseable/components/SongCard';
import Loader from '../reuseable/components/Loader';
import Menu from '../reuseable/components/Menu';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { likeSong, unlikeSong } from '../store/asyncAction';
import { BsThreeDotsVertical } from "react-icons/bs";
import SongTable from '../reuseable/components/SongTable';
import { song_api } from '../constants';

function Song() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const { songId } = useParams();
    const [song, setSong] = useState({});
    const [isLiked, setIsLiked] = useState(false);
    const [songAlbum, setSongAlbum] = useState([]);
    const [suggestedSong, setSuggestedSong] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isLogin, isPlayed, currentPlaylistId, currentTrack, likedSongs, user } = useSelector(state => state.player);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const songResponse = await axios.get(`${song_api}/songs/${songId}`);
                setSong(songResponse.data.data[0]);

                const albumResponse = await axios.get(`${song_api}/albums?id=${songResponse.data.data[0].album.id}`);
                setSongAlbum(albumResponse.data.data);

                const suggestionsResponse = await axios.get(`${song_api}/songs/${songId}/suggestions`);
                setSuggestedSong(suggestionsResponse.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [songId]);

    useEffect(() => {
        setIsLiked(likedSongs.includes(songId));
    }, [songId, likedSongs]);

    const handleSongPlay = (index = 0) => {
        if (!isLogin) {
            navigate("/login");
        } else {
            if (currentPlaylistId === songAlbum.id && isPlayed && currentTrack === index) {
                dispatch(playerAction.pause());
            } else {
                dispatch(playerAction.updateQueue({ songs: songAlbum.songs, playlistId: songAlbum.id }));
                dispatch(playerAction.updateCurrentTrack(index));
                dispatch(playerAction.updateProgress(0));
                dispatch(playerAction.play());
            }
        }
    };

    const handleToggleLike = () => {
        if (isLiked) {
            dispatch(unlikeSong({ songId, userId: user._id }));
        } else {
            dispatch(likeSong({ songId, userId: user._id }));
        }
        setIsLiked(prev => !prev);
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <h1>Error: {error}</h1>;
    }

    return (
        <Container className="h-100 px-3 py-4 bg-body-secondary  flex-grow-1 scroll overflow-auto">
            <Row className="m-0  w-100">
                <Col xs={12} md={4} className="d-flex justify-content-center align-items-center mb-2 mb-md-0">
                    <Image
                        className="w-75 shadow rounded"
                        src={song?.image?.find(img => img.quality === "500x500")?.url || 'default-image.jpg'}
                        alt={song.name || 'Default Image'}
                    />
                </Col>
                <Col xs={12} md={8} className="d-flex flex-column justify-content-center align-items-start">
                    <h3 className="text-capitalize">{song.name}</h3>
                    <p className='m-0'>From
                        <Link to={`/album/${song.album?.id}`} className='text-black fw-medium text-decoration-none'>
                            {` ${song.album?.name}`}
                        </Link>
                    </p>
                    <p className='m-0 mb-3'>By {song.artists?.primary.map((artist, index) => (
                        <React.Fragment key={artist.id}>
                            <Link className='text-black fw-medium text-decoration-none' to={`/artist/${artist.id}`}>
                                {artist.name}
                            </Link>
                            {index < song.artists.primary.length - 1 && ', '}
                        </React.Fragment>
                    ))}
                    </p>
                    <div className="d-flex  flex-md-row align-items-start position-relative">
                        <Button onClick={() => handleSongPlay()} className="w-100 px-5 rounded-pill me-3 mb-3">
                            Play
                        </Button>
                        <Button variant="link" className="p-0 me-3 text-black" onClick={handleToggleLike}>
                            {!isLiked ? <FaRegHeart size="1.7rem" /> : <FaHeart size="1.7rem" style={{ color: "#ff140a" }} />}
                        </Button>
                        <Button variant="link" className="p-0 text-black" onClick={() => setShowMenu(!showMenu)}>
                            <BsThreeDotsVertical size="1.7rem" />
                        </Button>
                        <Menu show={showMenu} setShow={setShowMenu} song={song} />


                    </div>
                </Col>
            </Row>

            {songAlbum.songs?.length > 1 && (
                <>
                    <h2 className="mt-4">More from {songAlbum.name}</h2>
                    <SongTable songs={songAlbum.songs}/>
                </>
            )}

            {suggestedSong.length > 0 && (
                <>
                    <h2 className="m-0 mt-4 ">Similar Songs</h2>
                    <Row className='m-0'>
                        <Col xs={12} className='d-flex  scroll overflow-auto'>
                            {suggestedSong.map(song => (
                                <SongCard key={song.id} song={song} />
                            ))}
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default Song;
