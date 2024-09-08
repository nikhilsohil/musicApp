import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import formatTime from "../function/formatTime";
import PlayAnimation from "./PlayAnimation";
import { FaRegPlayCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux"
import { playerAction } from "../../store/player";
import Menu from './Menu';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { likeSong, unlikeSong } from '../../store/asyncAction';

function TrackRow({ playList = { id: 0 }, songs, track, index }) {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const dispatch = useDispatch();
    const { isLogin, user, currentPlaylistId, currentTrack, isPlayed, likedSongs } = useSelector(state => state.player);
    const [showMenuIndex, setShowMenuIndex] = useState(null);

    useEffect(() => {
        setIsLiked(likedSongs.includes(track.id));
    }, [likedSongs]);

    const handleSongPlay = (index) => () => {

        if (!isLogin) {
            navigate("/signup");
        }
        else {

            if (currentPlaylistId === playList.id && isPlayed && currentTrack === index) {
                dispatch(playerAction.pause());
            } else {
                dispatch(playerAction.updateQueue({ songs: songs, playlistId: playList.id }));
                dispatch(playerAction.updateCurrentTrack(index));
                dispatch(playerAction.updateProgress(0));
                dispatch(playerAction.play());
            }
        }
    };

    const handleShowMenu = (e, index) => {
        setShowMenuIndex(showMenuIndex === index ? null : index);
    }

    const handleToggleLike = () => {
        if (!isLogin) {
            navigate('/login')
            return;
        }

        if (isLiked) {
            dispatch(unlikeSong({ songId: track.id, userId: user._id }));
        } else {
            dispatch(likeSong({ songId: track.id, userId: user._id }));
        }
    };

    return (
        <tr>
            <td className='position-relative tableImage ' style={{ width: "40px", height: "40px" }}>
                {track.image.find(img => img.quality === '50x50') && (
                    <div
                        className={`image-container d-flex justify-content-center align-content-center
                    ${currentTrack === index && isPlayed ? "bg-primary" : "bg-transparent"}`
                        }
                        style={{ position: "relative", height: "40px", width: "40px", borderRadius: "4px" }}
                    >
                        <Image
                            style={{ height: "40px", borderRadius: "4px" }}
                            src={track.image.find(img => img.quality === '50x50').url}
                            alt={track.name}
                        />
                        {currentPlaylistId === playList.id && currentTrack === index && isPlayed ? (
                            <PlayAnimation onClick={handleSongPlay(index)} />
                        ) : (
                            <Button
                                variant="link"
                                className="play-button p-0 m-0 position-absolute top-50 start-50 translate-middle"
                                onClick={handleSongPlay(index)}
                            >
                                <FaRegPlayCircle size="1.5rem" className="text-white " />
                            </Button>
                        )}
                    </div>
                )}
            </td>

            <td className="text-truncate" style={{ maxWidth: "150px" }}>
                <Link to={`/song/${track.id}`}
                    className={`text-decoration-none ${currentPlaylistId === playList.id && currentTrack === index ? 'track-primary ' : 'text-black'}`}
                >
                    {track.name}
                </Link>
            </td>

            <td>
                {!isLiked ? (
                    <FaRegHeart role='button' size={"1.3rem"} onClick={handleToggleLike} />
                ) : (
                    <FaHeart role='button' size={"1.3rem"} style={{ color: "#ff140a" }} onClick={handleToggleLike} />
                )}
            </td>

            <td className="d-none d-md-table-cell text-truncate" style={{ maxWidth: "150px" }}>
                {track.artists.primary.map((artist, index) => (
                    <React.Fragment key={artist.id}>
                        <Link to={`/artist/${artist.id}`} className="text-decoration-none text-black">
                            {artist.name}
                        </Link>
                        {index < track.artists.primary.length - 1 && ", "}
                    </React.Fragment>
                ))}
            </td>

            <td className="d-none d-md-table-cell text-truncate" style={{ maxWidth: "150px" }}>
                <Link to={`/album/${track.album.id}`} className='text-decoration-none text-black'>
                    {track.album.name}
                </Link>
            </td>

            <td className="d-none d-md-table-cell">
                {formatTime(track.duration)}
            </td>
            <td className='position-relative'>
                <BsThreeDotsVertical size={"1.3rem"} role='button' onClick={(e) => handleShowMenu(e, index)} />

                <Menu song={track} show={showMenuIndex === index} setShow={setShowMenuIndex} />
            </td>
        </tr>
    );
}

export default TrackRow;
