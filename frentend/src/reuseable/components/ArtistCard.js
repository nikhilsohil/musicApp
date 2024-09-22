import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { FaRegPlayCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { playerAction } from '../../store/player';
import axios from 'axios';
import { song_api } from '../../constants';

const ArtistCard = ({ artist }) => {
    const { isLogin } = useSelector(state => state.player)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { image, name } = artist;
    const artistImage = image.find(img => img.quality === '500x500')?.url || '';

    const handlePlay = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const getArtistSongs = async () => {
            try {
                const response = await axios.get(`${song_api}/artists/${artist.id}`);
                console.log(response);


                if (response.status === 200 && response.data && response.data.data && response.data.data.topSongs) {
                    const artist = response.data.data;


                    dispatch(playerAction.updateQueue({ songs: artist.topSongs, playlistId: artist.id }));
                    dispatch(playerAction.updateCurrentTrack(0));
                    dispatch(playerAction.updateProgress(0));
                    dispatch(playerAction.play());

                } else {
                    console.error('Failed to retrieve songs. The response structure was not as expected.');
                }
            } catch (error) {
                console.error('Error fetching artist songs:', error);
            }
        };

        if (!isLogin) {
            navigate('/login');
        } else {

            getArtistSongs();
        }

    };

    return (
        // <Container fluid className='m-0 p-0 w-auto text-decoration-none bg-transparent' as={Link} to={`/artist/${artist.id}`}>
            <Card style={{ width: '14vw', minWidth: "10rem" }}
             className='m-3 s bg-transparent text-decoration-none  border-0 '
             as={Link} to={`/artist/${artist.id}`}
             >

                <div className='image-container'>

                    {artistImage && (
                        <Card.Img variant="top" className='rounded-circle shadow-sm' src={artistImage} alt={`${name} artist cover`} />
                    )}
                    <Button
                        variant="link"
                        className="play-button p-0 m-0 position-absolute top-50 start-50 translate-middle"
                        onClick={handlePlay}
                    >
                        <FaRegPlayCircle size="3rem" className="text-white" />

                    </Button>
                </div>
                <Card.Body >
                    <Card.Text className='w-100 text-center text-nowrap fw-semibold' style={{ overflow: "hidden", textOverflow: 'ellipsis' }}>
                        {name}
                    </Card.Text>
                </Card.Body>

            </Card>
        // </Container>
    );
};

export default ArtistCard;
