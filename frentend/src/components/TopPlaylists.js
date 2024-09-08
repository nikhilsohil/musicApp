import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { playlists } from '../data/data';
import PlaylistCardLoader from '../reuseable/components/playlistCardLoader';
import PlayListCard from '../reuseable/components/PlayListCard';
import axios from 'axios';


function TopPlaylists() {
    const [loading, setLoading] = useState(true);
    const [playlistData, setPlaylistData] = useState([]);
    const [playlistError, setPlaylistError] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                setLoading(true);
                const responses = await Promise.all(
                    playlists.map(id => axios.get(`https://saavn.dev/api/playlists?id=${id}`))
                );
                const data = responses.map(response => response.data.data);
                setPlaylistData(data);
            } catch (err) {
                setPlaylistError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylists();
    }, [])


    if (loading) {
        <Container fluid className='h-100  bg-body-secondary  flex-grow-1 scroll overflow-auto'>
            <h1>Top Playlist</h1>
            <Row className='p-0 m-0 h-100 w-100'>
                {/* <Col className="p-0 h-100 flex-grow-1 scroll overflow-auto"> */}
                    <PlaylistCardLoader />
                    <PlaylistCardLoader />
                    <PlaylistCardLoader />
                    <PlaylistCardLoader />
                    <PlaylistCardLoader />
                    <PlaylistCardLoader />

                {/* </Col> */}
            </Row>
        </Container>
    }

    return (
        <Container fluid className='h-100 p-0 bg-body-secondary  flex-grow-1 scroll overflow-auto'>
            <Row className='p-0 m-0 h-100 w-100'><h1 className='mb-4'>Top Playlist</h1>
                {
                    !loading && <>
                        {
                            playlistError ? <h1>Error fetching playlists: {playlistError.message}</h1>
                                : playlistData.length === 0 ? <h1>No playlists found.</h1> : playlistData.map(playlist => (
                                    <PlayListCard key={playlist.id} playlist={playlist} />
                                ))
                        }
                    </>
                }
            </Row>
        </Container>
    )
}

export default TopPlaylists