import { useState } from 'react';
import { Modal, Form, Col, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { backend_Base_url } from '../../constants';

function Otp({ show, setShow, email, messageId, setIsVarify }) {

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    console.log(messageId);

    const handleVerify = async () => {

        if (otp.length !== 6) {
            setError('OTP must be exactly 6 digits.');
            return;
        }
        try {
            const response = await axios.post(`${backend_Base_url}/auth/verifyotp`, { messageId, otp })
            console.log('OTP sent successfully:', response);
            setIsVarify(true);
            setShow(false);
            return <Alert  variant={'success'}>
                This is a {'success'} alert—check it out!
            </Alert>
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError(error.response.data.message);
        };




        console.log("OTP submitted:", otp);

    };



    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Verify OTP</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group as={Col} className='py-2'>
                    <p>Enter the OTP sent to
                        <span className='fw-semibold'>
                            {" " + email + " "}
                        </span>
                        to verify your account.
                    </p>
                    <Form.Label>OTP</Form.Label>
                    <Form.Control
                        className='no-focus-outline'
                        type="text"
                        placeholder="Enter OTP"
                        name='otp'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        isInvalid={!!error}
                        maxLength={6}  // Restrict to 6 characters
                    />
                    <Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback>
                    {/* <p className=''> Resend</p> */}
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="secondary" onClick={handleClose}>
                    Change Email
                </Button> */}
                <Button variant="primary" onClick={handleVerify}>
                    Verify
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Otp;
