import React from 'react';
import {  Card, Button } from 'react-bootstrap';
import { FaRegPlayCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { playerAction } from '../../store/player';


const SongCard = ({ song }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLogin } = useSelector(state => state.player);
    const { image, name } = song;
    const songImage = image.find(img => img.quality === '500x500')?.url || '';
    
    const handlePlay = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLogin) {
            navigate('/login');

        }
        else {

            dispatch(playerAction.updateQueue({ songs: [song], playlistId: song.id }));
            dispatch(playerAction.updateCurrentTrack(0));
            dispatch(playerAction.updateProgress(0));
            dispatch(playerAction.play());
        }

    }

    if (!name && !songImage) {
        return null;
    }


    return (
        // <Container fluid className='m-0 p-0 text-decoration-none  ' as={Link} to={`/song/${song.id}`}>
            <Card style={{ width: '14vw', minWidth: "10rem", position: 'relative' }}
                className='m-3 shadow-sm bg-transparent border  text-decoration-none playlist-card dark p-0 m-1'
                as={Link} to={`/song/${song.id}`}>


                <div className=' image-container'>

                    {songImage && (
                        <Card.Img variant="top" src={songImage} alt={`${name} song cover`} />


                    )}
                    <Button
                        variant="link"
                        className="play-button p-0 m-0 position-absolute top-50 start-50 translate-middle"
                        onClick={handlePlay}
                    >
                        <FaRegPlayCircle size="3rem" className="text-white" />

                    </Button>

                </div>

                <Card.Body>
                    <Card.Text className='w-100 m-0 text-nowrap fw-semibold' style={{ overflow: "hidden", textOverflow: 'ellipsis' }}>
                        {song.name}
                    </Card.Text>
                    <Card.Text className='w-100 m-0 p-0 text-nowrap ' style={{ overflow: "hidden", textOverflow: 'ellipsis' }}>
                        {
                            song.artists.primary.map((value) => {
                                return (
                                    <React.Fragment key={value.id}><Link key={value.id}
                                        className='text-black  text-decoration-none'
                                        to={`/artist/${value.id}`}>
                                        {value.name}
                                    </Link>,{" "}
                                    </React.Fragment>)
                            }
                            )
                        }
                    </Card.Text>

                </Card.Body>




            </Card>
        // </Container>
    );
};

export default SongCard;
