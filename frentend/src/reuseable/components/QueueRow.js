import { Link, useNavigate } from "react-router-dom";

import React, { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import formatTime from "../function/formatTime";
import PlayAnimation from "./PlayAnimation";
import { FaRegPlayCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux"
import { playerAction } from "../../store/player";
// import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { likeSong, unlikeSong } from '../../store/asyncAction';
import { TiDeleteOutline } from "react-icons/ti";



function QueueRow({ track,index }) {

    const {isLogin,user, isPlayed, currentTrack, likedSongs } = useSelector(state => state.player);
    const [isLiked, setIsLiked] = useState(false);
    const navigate=useNavigate();

    const dispatch = useDispatch();
    const image50x50 = track.image.find(img => img.quality === '50x50');
    const isCurrentTrack = currentTrack === index;


    const handleSongPlay = (index) => {

        if (isPlayed && currentTrack === index) {
            dispatch(playerAction.pause());
        } else {
            dispatch(playerAction.updateCurrentTrack(index));
            dispatch(playerAction.updateProgress(0));
            dispatch(playerAction.play());
        }
    };

    const handelRemove=()=>{
        dispatch(playerAction.removeFromQueue(index));
    }

    const handleToggleLike = (track) => {
        console.log(track.id, user._id);

        if (!isLogin) {
            navigate('/login')
            return;

        }

        if (isLiked) {
          
            dispatch(unlikeSong({ songId: track.id, userId: user._id }));
        } else {
            dispatch(likeSong({ songId: track.id, userId: user._id }));
        }
        // setIsLiked((prev) => !prev);

    };

   

    useEffect(() => {
        setIsLiked(likedSongs.includes(track.id));
    }, [likedSongs])






    return (
        <tr key={track.id}>
            <td className='position-relative tableImage' style={{ width: "40px", height: "40px" }}>
                {image50x50 && (
                    <div className="image-container" style={{ position: "relative" }}>
                        <Image
                            style={{ height: "40px", borderRadius: "4px" }}
                            src={image50x50.url}
                            alt={track.name}
                            onClick={() => handleSongPlay(index)}
                        />
                        {isPlayed && isCurrentTrack ? (
                            <PlayAnimation onClick={() => handleSongPlay(index)} />
                        ) : (
                            <Button
                                variant="link"
                                className="play-button p-0 m-0 position-absolute top-50 start-50 translate-middle"
                                onClick={() => handleSongPlay(index)}
                            >
                                <FaRegPlayCircle size="1.5rem" className="text-white" />
                            </Button>
                        )}
                    </div>
                )}
            </td>
            <td>
                <Link to={`/song/${track.id}`}
                    className={`text-decoration-none ${isCurrentTrack ? 'track-primary ' : 'text-black'}`}
                >
                    {track.name}
                </Link>
            </td>
            <td>
                <TiDeleteOutline role='button' size={"1.7rem"} onClick={handelRemove}/>
            </td>

            <td>
                {!isLiked ? (
                    <FaRegHeart role='button' size={"1.3rem"} onClick={() => handleToggleLike(track)} />
                ) : (
                    <FaHeart role='button' size={"1.3rem"} style={{ color: "#ff140a" }} onClick={() => handleToggleLike(track)} />
                )}
            </td>


            <td>
                {formatTime(track.duration)}
            </td>
        </tr>
    )
}

export default QueueRow