import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PlaylistCard from '../reuseable/components/PlayListCard';
import ArtistCard from '../reuseable/components/ArtistCard';
import SongCard from '../reuseable/components/SongCard';
import PlaylistCardLoader from '../reuseable/components/playlistCardLoader';
import { playlists, topArtist, topSongs } from '../data/data';
import axios from 'axios';
import { song_api } from '../constants';


function Home() {
    const [songsData, setSongsData] = useState([]);
    const [playlistData, setPlaylistData] = useState([]);
    const [topArtistData, setTopArtistData] = useState([]);
    const [songError, setSongError] = useState(null);
    const [playlistError, setPlaylistError] = useState(null);
    const [artistError, setArtistError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                setLoading(true);
                const responses = await Promise.all(
                    playlists.map(id => axios.get(`${song_api}/playlists?id=${id}`))
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

        const fetchTopArtist = async () => {
            try {
                setLoading(true);
                const responses = await Promise.all(
                    topArtist.map(id => axios.get(`${song_api}/artists?id=${id}`))
                );
                const data = responses.map(response => response.data.data);
                setTopArtistData(data);
            } catch (err) {
                setArtistError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchSongs = async () => {
            try {
                setLoading(true);
                const responses = await Promise.all(
                    topSongs.map(id => axios.get(`${song_api}/songs/${id}`))
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
        fetchPlaylists();
        fetchTopArtist();
    }, []);

    if (loading) {
        return (
            <Container fluid className='m-0 w-100 h-100 px-2 bg-body-secondary'>
                <Row className='m-0 h-100 w-100'>
                    <Col className="h-100 flex-grow-1 scroll overflow-auto">
                        <Row>
                        <h1 className='mb-4'>Top Songs</h1>
                            <Col className='d-flex scroll overflow-auto'>
                                <PlaylistCardLoader />
                                <PlaylistCardLoader />
                                <PlaylistCardLoader />
                                <PlaylistCardLoader />
                                <PlaylistCardLoader />
                                <PlaylistCardLoader />
                            </Col>
                        </Row>
                        <Row>
                        <h1 className='mb-4'>Top Playlists</h1>
                            <Col className='d-flex scroll overflow-auto'>
                                <PlaylistCardLoader />
                                <PlaylistCardLoader />
                                <PlaylistCardLoader />
                                <PlaylistCardLoader />
                                <PlaylistCardLoader />
                                <PlaylistCardLoader />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid className='h-100  bg-body-secondary  flex-grow-1 scroll overflow-auto'>
            <Row className='p-0 m-0 h-100 w-100'>
                <Col className="p-0 h-100 flex-grow-1 scroll overflow-auto">


                    <Row className='m-0 '>
                            <h1 className='mb-4'>Top Songs</h1>
                        <Col xs={12} className='d-flex h-auto  scroll overflow-auto'>
                            {/* <Row className=''> */}
                                {songError && <p className="text-danger">Error loading songs.</p>}
                                {songsData && songsData.map(song => (
                                    // <Col xs={12} md={4} lg={3} key={song.id} className='mb-4 '>
                                        <SongCard key={song.id} song={song} />
                                    // </Col>
                                ))}
                            {/* </Row> */}
                        </Col>
                    </Row>


                    <Row className='m-0 mt-4'>
                            <h1 className='mb-4'>Top Playlists</h1>
                        <Col xs={12} className='d-flex  scroll overflow-auto'>
                            {/* <Row className='d-flex flex-wrap'> */}
                                {playlistError && <p className="text-danger">Error loading playlists.</p>}
                                {playlistData && playlistData.map(playlist => (
                                   
                                        <PlaylistCard key={playlist.id} playlist={playlist} />
                               
                                ))}
                            {/* </Row> */}
                        </Col>
                    </Row>


                    <Row className='m-0 mt-4'>
                            <h1 className='mb-4'>Top Artists</h1>
                        <Col xs={12} className='d-flex  scroll overflow-auto'>
                            
                                {artistError && <p className="text-danger">Error loading artists.</p>}
                                {topArtistData && topArtistData.map(artist => (
                                  
                                        <ArtistCard key={artist.id} artist={artist} />
                            
                                ))}
                      
                        </Col>
                    </Row>


                </Col>
            </Row>
        </Container>
    );
}

export default Home;

