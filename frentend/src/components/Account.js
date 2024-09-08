import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { playerAction } from '../store/player';
import UpdateImage from '../reuseable/components/UpdateImage';

function Setting() {
    const [activeTab, setActiveTab] = useState('editProfile');
    const { isLogin, user } = useSelector(state => state.player);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [profileImage, setProfileImage] = useState('');


    useEffect(() => {
        if (!isLogin) {
            navigate('/login');
        }

    }, []);



    useEffect(() => {
        if (user) {
            setProfileImage(user.profileURL);
        }

    }, [user])

    console.log(useLocation());

    const handleLogout = () => {
        dispatch(playerAction.logout());
        navigate('/');
    };

    if (!user) {
        return null;
    }



    return (
        <>
            <UpdateImage showModal={showModal} setShowModal={setShowModal} />
            <Container fluid className='h-100 bg-body-secondary flex-grow-1 scroll overflow-auto'>
                <Row className='m-0 py-3'>
                    <Col md={3} className='d-flex  justify-content-center align-content-center' style={{ maxHeight: "400px" }}>
                        <Image
                            style={{ width: '14vw', maxWidth: "10rem", cursor: 'pointer', transition: 'transform 0.3s ease-in-out' }}
                            className='w-100  shadow h-100'
                            roundedCircle
                            src={profileImage}
                            alt={user.name}
                            onClick={() => setShowModal(true)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />

                    </Col>
                    <Col md={8} className='text-capitalize d-flex justify-content-between align-items-center'>
                        <div>
                            <h3>{user.name}</h3>
                        </div>
                        <div>
                            <Button
                                variant='outline-secondary'
                                className='rounded-pill'
                                onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row className='p-0 m-0 w-100'>
                    <Col xs={12} md={3} className="p-0 py-4 mb-4 h-100 flex-grow-1 scroll overflow-auto">
                        <div className='d-flex d-md-block justify-content-around w-100'>
                            <p role='button'
                                onClick={() => setActiveTab('editProfile')}
                                className={`w-100 w-md-50 rounded p-2 mb-0 border flex-grow-1 text-center ${activeTab === 'editProfile' ? "bg-primary text-white" : "bg-white"}`}>
                                Edit Profile
                            </p>
                            <p role='button'
                                onClick={() => setActiveTab('changePassword')}
                                className={`w-100 rounded w-md-50 p-2 mb-0 border flex-grow-1 text-center ${activeTab === 'changePassword' ? "bg-primary text-white" : "bg-white"}`}>
                                Change Password
                            </p>
                        </div>
                    </Col>
                    <Col xs={12} md={9}>
                        {activeTab === 'changePassword' ? <ChangePassword /> : <EditProfile />}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Setting;
