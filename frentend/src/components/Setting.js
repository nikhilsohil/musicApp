import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';

function Setting() {
    const [showChangePassword, setShowChangePassword] = useState(false);
    return (

        <Row>
            <Col md={3} className=' py-5'>
                <p role='button' onClick={() => setShowChangePassword(false)} className={!showChangePassword ? "text-primary" : ""}>
                    Edit Profile
                </p>
                <p role='button' onClick={() => setShowChangePassword(true)} className={showChangePassword ? "text-primary" : ""}>
                    Change Password
                </p>



            </Col>
            <Col md={9}>
                {
                    showChangePassword ? <ChangePassword /> : <EditProfile />
                }
            </Col>
        </Row>

    )
}

export default Setting