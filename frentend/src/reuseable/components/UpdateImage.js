import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Modal, Image, Button, Spinner } from 'react-bootstrap';
import { FaRegPenToSquare } from "react-icons/fa6";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { playerAction } from '../../store/player';
import { backend_Base_url } from '../../constants';

function UpdateImage({ showModal, setShowModal }) {
    const user = useSelector(state => state.player.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(user.profileURL);

    const fileInputRef = useRef(null);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        setProfileImage(user.profileURL);
    }, [user])


    const handleImageUpdate = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);

            };
            reader.readAsDataURL(file);
        }
        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', user._id);
        try {
            setLoading(true);
            const response = await axios.post(`${backend_Base_url}/users/uploadProfilePhoto`, formData)
            console.log(response);
            localStorage.setItem('user', JSON.stringify({ ...user, profileURL: response.data.profileURL }));
            dispatch(playerAction.login(response.data.user))
            setShowModal(false);

        } catch (e) {
            console.error(e);
        
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <style type="text/css">
                {`
                    .image-containe {
                        overflow: hidden;
                    }

                    .edit-button {
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        opacity: 0;
                        transition: opacity 0.3s ease-in-out;
                    }

                    .image-containe:hover .edit-button {
                         opacity: 1;

                    }
                         .image-containe:hover img{
                          filter: brightness(70%);
                         }
                `}
            </style>


            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="text-center position-relative">
                    <div className="image-containe position-relative d-inline-block">
                        <Image
                            style={{ width: '100%', maxWidth: '400px', maxHeight: '400px' }}
                            className='position-relative'
                            src={profileImage}
                            alt={user.name}
                            as={Button}
                            role='button'
                        // onClick={triggerFileInput}
                        />
                        {
                            !loading &&
                            <FaRegPenToSquare
                                size={'3rem'}
                                role='button'
                                onClick={triggerFileInput}
                                className='text-white edit-button position-absolute' />
                        }
                        {
                            loading &&
                            <div className=' position-absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                <Spinner animation="border" role="status" className='text-white' style={{ zIndex: "100" }}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        }
                        {/* <Button
                            variant='outline-primary'
                            className='edit-button position-absolute'
                            onClick={triggerFileInput}
                            >
                            Update Image
                            </Button> */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageUpdate}
                        />
                    </div>
                    <Row>
                        <Col sm={12} className="text-center d-flex justify-content-around">
                            <Button variant="outline-primary" onClick={triggerFileInput} type="submit" disabled={loading} >
                                 Edit
                            </Button>
                        {/* </Col>
                        <Col sm={12} className="text-center"> */}
                        <Button variant="outline-primary" type="submit" disabled={loading} >
                            Remove
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UpdateImage