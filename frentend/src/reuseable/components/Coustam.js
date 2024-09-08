import React from 'react';
import {  Card, Button } from 'react-bootstrap';
import { FaRegPlayCircle ,FaPlus} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link,useNavigate } from 'react-router-dom';
import { playerAction } from '../../store/player';


const Coustam = ({ playlist }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const image=playlist.image.find(img => img.quality === "500x500").url;

    const handlePlay = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(playlist.songs.length > 0){

            dispatch(playerAction.updateQueue({ songs: playlist.songs, playlistId: playlist.id }));
            dispatch(playerAction.updateCurrentTrack(0));
            dispatch(playerAction.updateProgress(0));
            dispatch(playerAction.play());
        }else{
            navigate("/")
        }

    }



    // if( !name && !playlistImage){
    //     return null; 
    // }


    return (
        // <Container fluid className='m-0  text-decoration-none  ' as={Link} to={`/playlist/`}>
            <Card style={{ width: '14vw', minWidth: "10rem", position: 'relative' }}
                className='m-3 shadow text-decoration-none playlist-card dark p-0 m-1'
                as={Link} to={`/playlist/custom/${playlist._id}`}
                >


                <div className=' image-container'>

                    <Card.Img variant="top" src={image} alt={` playlist cover`} />

                    <Button
                        variant="link"
                        className="play-button p-0 m-0 position-absolute top-50 start-50 translate-middle"
                        onClick={handlePlay}
                    >
                        {
                            playlist.songs.length > 0 ?
                            <FaRegPlayCircle size="3rem" className="text-white" />:

                        <FaPlus size="3rem" className="text-white" />
                        }
                        
                    </Button>

                </div>

                <Card.Body>
                    <Card.Text className='w-100 fs-6 text-nowrap fw-semibold' style={{ overflow: "hidden", textOverflow: 'ellipsis' }}>
                        {playlist.name}
                    </Card.Text>


                </Card.Body>
            </Card>
        // </Container>
    );
};

export default Coustam;
