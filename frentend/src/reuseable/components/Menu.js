import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { playerAction } from '../../store/player';
import axios from 'axios';
import AddPlaylist from './AddPlaylist';
import { likeSong, unlikeSong } from '../../store/asyncAction';
import { FaRegHeart, FaHeart ,FaUser, FaPlus, FaMusic,FaRecordVinyl } from 'react-icons/fa';
import { MdOutlinePlaylistAdd } from "react-icons/md";



function Menu({ show, setShow, song }) {
    const [addToPlaylist, setAddToPlaylist] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addNewPlaylist, setAddNewPlaylist] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const{isLogin,likedSongs,user}=useSelector(state=>state.player)


    const navigate=useNavigate();

    const dispatch = useDispatch();
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShow(false);
        }
    };

    useEffect(() => {
        const fetchPlaylists = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/playlist/`, {
                    params: {
                        userId: JSON.parse(localStorage.getItem('user'))._id
                    }
                });
                setPlaylists(response.data.playlists);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            } finally {
                setLoading(false);
            }
        };

        if (show) {
            fetchPlaylists();
        }
    }, [show]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const AddToQueue = () => {
        dispatch(playerAction.addToQueue(song));
        setShow(false);
    };

  

    const addSongToPlaylist = async (playlist) => {
        try {
            const response = await axios.post(`http://localhost:5000/playlist/${playlist._id}/addsong`, { song });
            console.log('Song added to playlist successfully:', response.data);
            setAddToPlaylist(false);
            setShow(false);
        } catch (error) {
            console.error('Error adding song to playlist:', error);
        }
    };

    useEffect(() => {

        setIsLiked(likedSongs.includes(song.id));
        
    }, [song.id, likedSongs])


    const handleToggleLike = () => {
        console.log(song.id, song._id);

        if (!isLogin) {
            navigate('/login')
            return;

        }


        if (isLiked) {
          
            dispatch(unlikeSong({ songId: song.id, userId: user._id }));
        } else {
            dispatch(likeSong({ songId: song.id, userId: user._id }));
        }
        // setIsLiked((prev) => !prev);

    };
    return (
        <>
            {show && !addToPlaylist && (
                <div className="vertical-menu py-1" ref={menuRef}>
                    <p role='button' onClick={AddToQueue}><MdOutlinePlaylistAdd size={"1.2rem"}/> Add to Queue</p>
                    <p role='button' onClick={handleToggleLike}>{isLiked?<><FaHeart style={{ color: "#ff140a", }}/> Unlike Song</>:<><FaRegHeart/> Like Song</>}</p>
                    <p role='button' onClick={() => setAddToPlaylist(true)}><FaPlus/> Add to playlist</p>
                    <Link to={`/song/${song.id}`}><FaMusic/> View Song</Link>
                    <Link to={`/artist/${song.artists.primary[0].id}`}><FaUser/> View Artist</Link>
                    <Link to={`/album/${song.album.id}`}><FaRecordVinyl/> View Album</Link>
                </div>
            )}

            {show && addToPlaylist && (
                <div className="vertical-menu py-1" ref={menuRef}>
                    <p role='button' className='d-flex align-content-center' onClick={() => setAddToPlaylist(false)}>
                        <IoIosArrowBack size='1.5rem' /> Back
                    </p>
                    <p role='button' onClick={() => setAddNewPlaylist(true)}> <FaPlus /> Add New</p>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        playlists.map((item) => (
                            <p key={item._id} role='button' onClick={() => addSongToPlaylist(item)}>
                                {item.name}
                            </p>
                        ))
                    )}
                </div>
            )}
            {
                addNewPlaylist&&<AddPlaylist show={addNewPlaylist} setShow={setAddNewPlaylist} song={song}/>
            }
{/* 
            <Modal show={addNewPlaylist} onHide={() => setAddNewPlaylist(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a New Playlist</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-0'>
                    <Form className='p-5 py-1 rounded-2'>
                        <Row>
                            <Form.Group as={Col} className='py-2 p-0'>
                                <Form.Label>Playlist Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter playlist Name"
                                    value={playlistName}
                                    onChange={(e) => setPlaylistName(e.target.value)}
                                    isInvalid={!!playlistNameErr}
                                />
                                <Form.Control.Feedback type='invalid'>{playlistNameErr}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col className='p-0 py-2 d-flex justify-content-end'>
                                <Button variant="secondary" className='mx-2' onClick={() => setAddNewPlaylist(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={addToNewPlaylist}>Create</Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal> */}
        </>
    );
}

export default Menu;
