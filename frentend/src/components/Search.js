import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Col, Container, Row, Spinner, Alert } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import ArtistCard from '../reuseable/components/ArtistCard';
import AlbumCard from '../reuseable/components/AlbumCard';
import SongTable from '../reuseable/components/SongTable';
import Loader from '../reuseable/components/Loader';

function Search() {
    const { type, query } = useParams();
    const scrollRef = useRef(null);
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    async function getMoreResult() {
        setError(false);
        try {
            const response = await axios.get(`https://saavn.dev/api/search/${type}?query=${query}&page=${page}&limit=10`);
            const newResults = response.data.data.results;
            setResult(prevResults => [...prevResults, ...newResults]);
            if (newResults.length === 0 || newResults.length < 10) {
                setHasMore(false);
            }
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            setError(true);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setResult([]);
        setPage(1);
        setHasMore(true);

        const getResult = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://saavn.dev/api/search/${type}?query=${query}`);
                const initialResults = response.data.data.results;
                setResult(initialResults);
                if (initialResults.length === 0 || initialResults.length < 10) {
                    setHasMore(false);
                }
                setPage(2);
            } catch (error) {
                setError(true);
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getResult();
    }, [type, query]);

    if (loading && page === 1) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Alert variant="danger">Error fetching data. Please try again.</Alert>
            </Container>
        );
    }

    if (result.length === 0 && !loading) {
        return <div>No results found for "{query}".</div>;
    }

    const renderResults = () => {
        if (type === "artists") {
            return <>
                <Row className='m-0 w-100 justify-content-between'>
                    {

                        result.map((artist, index) => (
                            <ArtistCard artist={artist} />
                        ))
                    }
                </Row>
            </>
        } else if (type === "albums") {
            return <>
                <Row className='m-0 w-100 justify-content-between'>
                    {

                        result.map((album, index) => (
                            <AlbumCard key={index} album={album} />
                        ))
                    }
                </Row>
            </>
        } else if (type === "songs") {
            return (
                <Row className='m-0 w-100'>
                    <SongTable songs={result} />
                </Row>
            );
        }
    };

    return (
        <Container className='h-100 p-0 d-flex scroll flex-grow-1 overflow-auto' ref={scrollRef}>
            <InfiniteScroll
                loadMore={getMoreResult}
                hasMore={hasMore}
                loader={<Loader />}
                useWindow={false}
                getScrollParent={() => scrollRef.current}
                className='w-100'
            >
                {renderResults()}
            </InfiniteScroll>
        </Container>
    );
}

export default Search;
