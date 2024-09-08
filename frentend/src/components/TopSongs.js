import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { topSongs } from '../data/data';
import PlaylistCardLoader from '../reuseable/components/playlistCardLoader';
import SongCard from '../reuseable/components/SongCard';
import axios from 'axios';



function TopSongs() {
    const [loading, setLoading] = useState(true);
    const [songsData, setSongsData] = useState([]);
    const [songError, setSongError] = useState(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true);
                const responses = await Promise.all(
                    topSongs.map(id => axios.get(`https://saavn.dev/api/songs/${id}`))
                );
                const data = responses.map(response => response.data.data[0]);
                setSongsData(data);
            } catch (err) {
                setSongError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [])


    if (loading) {
        <Container fluid className='h-100  bg-body-secondary  flex-grow-1 scroll overflow-auto'>
            <h1>Top Song</h1>
            <Row className='p-0 m-0 h-100 w-100'>
                <Col className="p-0 h-100 flex-grow-1 scroll overflow-auto">
                    <PlaylistCardLoader />
                    <PlaylistCardLoader />
                    <PlaylistCardLoader />
                    <PlaylistCardLoader />
                    <PlaylistCardLoader />
                    <PlaylistCardLoader />

                </Col>
            </Row>
        </Container>
    }



    return (
        <Container fluid className='h-100 p-0 bg-body-secondary  flex-grow-1 scroll overflow-auto'>
            <Row className='p-0 m-0 h-100 w-100'><h1 className='mb-4'>Top Songs</h1>
                {
                  !loading&&  <>
                        {
                            songError ? <h1>Error fetching playlists: {songError.message}</h1>
                                : songsData.length === 0 ? <h1>No playlists found.</h1> : songsData.map(song => (
                                    <SongCard key={song.id} song={song} />
                                ))
                        }
                    </>
                }
            </Row>
        </Container>
    )
}

export default TopSongs