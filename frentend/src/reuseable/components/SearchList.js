import React from 'react';
import { Container, Image, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import { FaRegPlayCircle } from 'react-icons/fa';
// import { useSelector,useDispatch } from 'react-redux';
// import { playerAction } from '../../store/player';

function SearchList({ data, link }) {
    // const { currentPlaylistId, isPlayed, currentTrack, songs } = useSelector(state => state.player);
    // const dispatch = useDispatch();



    // const handleSongPlay = () => {



    //     console.log([data]);
        
    //     if (currentPlaylistId === data.id && isPlayed && currentTrack === 0) {
    //         dispatch(playerAction.pause());
    //     } else {
    //         dispatch(playerAction.updateQueue({ songs:[data], playlistId: data.id }));
    //         dispatch(playerAction.updateCurrentTrack(0));
    //         dispatch(playerAction.updateProgress(0));
    //         dispatch(playerAction.play());
    //     }
    // };




    return (
        <Container fluid className='m-2 p-0' style={{ width: '100%', height: "3rem" }}>
            <ListGroup horizontal className='p-0 h-100 w-100'>
                <ListGroup.Item className='p-0 h-100 w-auto'>
                    <div
                        className={`image-container h-100 d-flex justify-content-center align-content-center`
                        }
                        style={{ position: "relative", height: "40px", width: "40px", borderRadius: "4px" }}

                    >
                        <Image className='h-100 w-auto' src={data.image.find((img) => img.quality === "500x500").url} />

                        {/* <Button
                            variant="link"
                            className="play-button p-0 m-0 position-absolute top-50 start-50 translate-middle"
                            onClick={handleSongPlay}
                        >

                            <FaRegPlayCircle size="1.5rem" className="text-white " />

                        </Button> */}


                    </div>
                </ListGroup.Item>
                <ListGroup.Item as={Link} to={link} className='p-0 w-75 fs-6 px-1 text-nowrap fw-semibold'
                    style={{ overflow: "hidden", textOverflow: 'ellipsis' }}
                > {data.title}</ListGroup.Item>
            </ListGroup>
        </Container>
    )
}

export default SearchList