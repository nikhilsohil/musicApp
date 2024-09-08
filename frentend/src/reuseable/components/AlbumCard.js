import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { FaRegPlayCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, } from 'react-router-dom';
import axios from 'axios';
import { playerAction } from '../../store/player';


const AlbumCard = ({ album }) => {
    const { isLogin } = useSelector(state => state.player);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { image, name } = album;
    const albumImage = image.find(img => img.quality === '500x500')?.url || '';


    const handlePlay = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(album);

        const getAlbumSongs = async () => {
            try {
                const response = await axios.get(`https://saavn.dev/api/albums?id=${album.id}`);

                if (response.status === 200 && response.data && response.data.data && response.data.data.songs) {
                    const album = response.data.data;
                    dispatch(playerAction.updateQueue({ songs: album.songs, playlistId: album.id }));

                    dispatch(playerAction.updateCurrentTrack(0));
                    dispatch(playerAction.updateProgress(0));
                    dispatch(playerAction.play());
                } else {
                    console.error('Failed to retrieve songs. The response structure was not as expected.');
                }
            } catch (error) {
                console.error('Error fetching album songs:', error);
            }
        };

        if (!isLogin) {
            navigate('/login');
        }
        else {
            getAlbumSongs();
        }

    }

    return (
        <Container fluid className='m-0 p-0 h-auto w-auto text-decoration-none ' as={Link} to={`/album/${album.id}`}>
            <Card style={{ width: '14vw', minWidth: "10rem", position: 'relative' }}
            // <Card
                className='m-3 shadow bg-transparent border-white text-decoration-none album-card'>

                <div className=' image-container'>

                    {albumImage && (
                        <Card.Img variant="top" src={albumImage} alt={`${name} album cover`} />


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
                    <Card.Text className='w-100 text-nowrap fw-semibold' style={{ overflow: "hidden", textOverflow: 'ellipsis' }}>
                        {name}
                    </Card.Text>

                </Card.Body>




            </Card>
        </Container>
    );
};

export default AlbumCard;
