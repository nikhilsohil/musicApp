import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { FaRegPlayCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { playerAction } from '../../store/player';


const PlayListCard = ({ playlist }) => {
    const dispatch = useDispatch();
    const { image, name } = playlist;
    const playlistImage = image.find(img => img.quality === '500x500')?.url || '';


    const handlePlay = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(playlist);


        dispatch(playerAction.updateQueue({ songs: playlist.songs, playlistId: playlist.id }));

        dispatch(playerAction.updateCurrentTrack(0));
        dispatch(playerAction.updateProgress(0));
        dispatch(playerAction.play());

    }

    if( !name && !playlistImage){
        return null; 
    }


    return (
        // <Container fluid className='m-0 p-0 text-decoration-none   ' as={Link} to={`/playlist/default/${playlist.id}`}>
            <Card style={{ width: '14vw', minWidth: "10rem", position: 'relative' }}
                className='m-3 shadow-sm text-decoration-none border playlist-card dark p-0 m-1 bg-transparent'
                as={Link} to={`/playlist/default/${playlist.id}`}>


                <div className=' image-container'>

                    {playlistImage && (
                        <Card.Img variant="top" src={playlistImage} alt={`${name} playlist cover`} />


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
                    <Card.Text className='w-100 fs-6 text-nowrap fw-semibold' style={{ overflow: "hidden", textOverflow: 'ellipsis' }}>
                        {name}
                    </Card.Text>
                    

                </Card.Body>
            </Card>
        // </Container>
    );
};

export default PlayListCard;
