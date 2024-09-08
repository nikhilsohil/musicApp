import React, { useEffect, useRef, useState } from 'react';
import { FaRegPlayCircle, FaRegPauseCircle } from 'react-icons/fa';
import { MdSkipPrevious, MdSkipNext } from 'react-icons/md';
import { LuListMusic } from "react-icons/lu";
import { Col, Image, Container, Row, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { playerAction } from '../store/player';
import formatTime from '../reuseable/function/formatTime';
import { Link, useNavigate } from 'react-router-dom';
import Queue from './Queue';


function Controler() {
    const dispatch = useDispatch();
    const { isLogin, isPlayed, progress, currentTrack, queue } = useSelector((state) => state.player);
    const [displayQueue, setDisplayQueue] = useState(false);
    const song = queue[currentTrack]
    const audioRef = useRef(new Audio());
    const { current: audio } = audioRef;
    const navigate = useNavigate();

    useEffect(() => {
        if (song) {
            audio.src = song.downloadUrl[4].url;
            audio.load();
            dispatch(playerAction.play());
            audio.play().catch((error) => console.log('Playback failed: ', error));
        }
    }, [audio, song]);

    useEffect(() => {
        const handlePlay = () => {
            audio.play().catch((error) => console.log('Playback failed: ', error));
        };

        const handlePause = () => {
            audio.pause();
            dispatch(playerAction.pause());
        };

        const updateProgress = () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            dispatch(playerAction.updateProgress(progress.toFixed(0)));
        };

        const handleEnded = () => {
            dispatch(playerAction.updateProgress(0));
            if (currentTrack < queue.length - 1) {
                dispatch(playerAction.updateCurrentTrack(currentTrack + 1));
                dispatch(playerAction.play());
            } else {
                dispatch(playerAction.pause());
            }
        };

        if (isPlayed) {
            handlePlay();
        } else {
            handlePause();
        }

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [isPlayed, audio]);

    const handleProgressBarChange = (e) => {
        const newValue = e.target.value;
        audio.currentTime = (newValue / 100) * audio.duration;
        dispatch(playerAction.updateProgress(newValue));
    };

    const handlePlayPause = () => {
        if (!isLogin) {
            navigate('/login');
            return;
        } else {
            if (isPlayed) {
                dispatch(playerAction.pause());
            } else {
                dispatch(playerAction.play());
            }
        }
    };

    const handleTrackChange = (direction) => {
        const currentIndex = queue.findIndex(track => track.id === song.id);
        let newIndex;
        if (direction === 'previous') {
            newIndex = currentIndex === 0 ? 0 : currentIndex - 1;
        } else if (direction === 'next') {
            newIndex = currentIndex === queue.length - 1 ? queue.length - 1 : currentIndex + 1;
        }
        dispatch(playerAction.updateCurrentTrack(newIndex));
    };

    return (
        <Container fluid className="p-2 bg-body-secondary d-flex flex-column justify-content-center align-items-center ">
            <Row className='w-100 align-items-center'>
                <Col xs={2} md={1} className="d-flex align-items-center">
                    {song.image.map(
                        (img) =>
                            img.quality === '50x50' && (
                                <Image key={song.id} className="img-fluid rounded" src={img.url} alt="Album Art" />
                            )
                    )}
                </Col>
                <Col xs={2} className="d-flex flex-column justify-content-center">
                    <Link to={`/song/${song.id}`} className='text-dark text-decoration-none text-truncate'>
                        <strong>{song.name}</strong>
                    </Link>
                    <small className="text-muted text-truncate">
                        {song.artists.primary.map((artist) => (
                            <span key={artist.id}>
                                <Link to={`/artist/${artist.id}`} className='text-dark text-decoration-none'>{artist.name}</Link>,{' '}
                            </span>
                        ))}
                    </small>
                </Col>

                <Col xs={6} md={7} className="d-flex flex-column justify-content-center">
                    <div className="d-flex justify-content-center align-items-center">
                        <Button
                            disabled={currentTrack === 0}
                            onClick={() => handleTrackChange("previous")}
                            className="bg-transparent border-0 text-dark">
                            <MdSkipPrevious size="2rem" />
                        </Button>
                        <Button onClick={handlePlayPause} className="bg-transparent text-dark border-0">
                            {isPlayed ? <FaRegPauseCircle size="2rem" /> : <FaRegPlayCircle size="2rem" />}
                        </Button>
                        <Button onClick={() => handleTrackChange("next")} className="bg-transparent text-dark border-0">
                            <MdSkipNext size="2rem" />
                        </Button>
                    </div>
                    <div className="d-flex align-items-center mt-2">
                        <small className="text-muted">{formatTime(audio.currentTime)}</small>
                        <input
                            className="mx-2 flex-grow-1"
                            style={{ height: '6px', background: `linear-gradient(to right, #0d6efd ${progress}%, #ddd ${progress}%)`, borderRadius: '4px' }}
                            value={progress}
                            onChange={handleProgressBarChange}
                            type="range"
                            min="0"
                            max="100"
                        />
                        <small className="text-muted">{formatTime(audio.duration)}</small>
                    </div>
                </Col>

                <Col xs={2} className="d-flex justify-content-end">
                    <Button onClick={() => setDisplayQueue(!displayQueue)} className="bg-transparent text-dark border-0 p-0">
                        <LuListMusic size="1.5rem" />
                    </Button>
                </Col>
            </Row>

            <Queue show={displayQueue} handleClose={setDisplayQueue} />
        </Container>
    );
}

export default Controler;
