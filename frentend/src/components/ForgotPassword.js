import React, { useState } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';

import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { backend_Base_url } from '../constants';



function ForgotPassword() {
    const [currentStep, setCurrentStep] = useState('varifyEmail')
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')
    const [emailErr, setEmailErr] = useState('')
    const [messageId, setMessageId] = useState('')
    const [otp, setOtp] = useState('')
    const [otpErr, setOtpErr] = useState('')
    const [password, setPassword] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [isPassword, setIsPassword] = useState(true);
    const navigate=useNavigate();
    // const [confirmPassword, setConfirmPassword] = useState('')
    // const [confirmPasswordErr, setConfirmPasswordErr] = useState('')


    const findUser = async (e) => {
        setLoading(true);
        e.preventDefault()
        var error="";

        if (!email) {
            error="Email is required";
        }
        else if (!/^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z.-]{3,}\.[a-zA-Z]{2,}$/.test(email)) {
            error="Invalid email format";
        }

        if (error) {
            setEmailErr(error);
            setLoading(false);
            return;
        }
            try {

                const response = await axios.get(`${backend_Base_url}/auth/finduser/${email}`,)
                console.log(response);
                if (response.data.user) {
                    try {

                        const message = await axios.post(`${backend_Base_url}/auth/sendotp`, { email })
                        console.log(message);
                        setMessageId(message.data.messageId);
                        setCurrentStep('verifyOtp');
                    } catch (error) {

                        console.log(error);
                        setEmailErr("please try again");
                    }
                }

            } catch (error) {
                console.log(error);
                const response = error.response;
                if (response.status === 400) {
                    setEmailErr(response.data.message);
                }
            }
            finally {
                setLoading(false);
            }
        }
    




    const varifyOtp = async (e) => {
        e.preventDefault()
        setLoading(true);
        if (otp.length !== 6) {
            setOtpErr('OTP must be exactly 6 digits.');
            return;
        }
        try {
            const response = await axios.post(`${backend_Base_url}/auth/verifyotp`, { messageId, otp })
            console.log('OTP varifed sucessfully', response);
            console.log('OTP varifed sucessfully',);
            setCurrentStep('resetPassword');

        } catch (error) {
            console.error('Error verifying OTP:', error);
            setOtpErr(error.response.data.message);
        }
        finally {
            setLoading(false);
        }

    }



    const resetPassword = async (e) => {
        e.preventDefault()
        setLoading(true);
        if (!password) {
            setPasswordErr("Password is required");

        }
        else if (password.length < 8) {
            setPasswordErr("Password should have at least 8 characters");
        }
        else {
            setPasswordErr('')

            try {
                const response= await axios.post(`${backend_Base_url}/auth/resetpassword`,{email,password})
                console.log(response);
                navigate('/login')
            } catch (error) {
                console.log(error);
                
            }
            finally{
                setLoading(false);
            }
        }
    }


    if (currentStep === 'varifyEmail') {
        return (
            <Container fluid className='vh-100 vw-100 overflow-hidden'>
                <Row className='h-100 justify-content-center align-content-center'>
                    <Col className='h-100 flex-wrap d-flex justify-content-center align-content-center'>
                        <Form onSubmit={(e) => findUser(e)} style={{ maxWidth: "30rem" }} className='p-5 py-3 bg-white rounded-2  shadow '>
                            <Row>
                                <Col>
                                    <h4 className='text-center'>Find Your Account</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Form.Group as={Col} className='py-2'>
                                    <p>Please enter your email address to search for your account.</p>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        className='no-focus-outline'
                                        type="text"
                                        placeholder="enter your email"
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        isInvalid={!!emailErr}
                                    />
                                    <Form.Control.Feedback type='invalid'>{emailErr}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className='pt-3 m-0 w-100 '>
                                <Col className='p-0 d-flex justify-content-end'>
                                    <Button as={Link} to="/login" variant="outline-secondary " className='me-3' >
                                        Cancle
                                    </Button>
                                    {/* </Col>
                            <Col className='p-0'> */}
                                    <Button variant="outline-primary " type="submit" disabled={loading} >
                                        {
                                            loading ? 'Loading...' : 'Next'
                                        }
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }

    if (currentStep === 'verifyOtp') {
        return (
            <Container fluid className='vh-100 vw-100 overflow-hidden'>
                <Row className='h-100 justify-content-center align-content-center'>
                    <Col className='h-100 flex-wrap d-flex justify-content-center align-content-center'>
                        <Form onSubmit={(e) => varifyOtp(e)} style={{ maxWidth: "30rem" }} className='p-5 py-3 bg-white rounded-2  shadow '>
                            <Row>
                                <Col>
                                    <h4 className='text-center'>Enter Otp</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Form.Group as={Col} className='py-2'>
                                    <p>To complete the account verification process, please enter the OTP sent to
                                        <span className='fw-semibold'>
                                            {" " + email + ". "}
                                        </span>
                                        {/* Your action will help ensure the security of your account. */}
                                    </p>
                                    <Form.Label>OTP</Form.Label>
                                    <Form.Control
                                        className='no-focus-outline'
                                        type="text"
                                        placeholder="Enter OTP"
                                        name='otp'
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        isInvalid={!!otpErr}
                                        maxLength={6}
                                    />
                                    <Form.Control.Feedback type='invalid'>{otpErr}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className='pt-3 m-0 w-100 '>
                                <Col className='p-0 d-flex justify-content-end'>
                                    <Button onClick={() => setCurrentStep('varifyEmail')} variant="outline-secondary " className='me-3' >
                                        Back
                                    </Button>
                                    {/* </Col>
                            <Col className='p-0'> */}
                                    <Button variant="outline-primary " type="submit" disabled={loading} >
                                        {
                                            loading? 'Loading...' : 'Submit'
                                        }
                                        
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }

    if (currentStep === 'resetPassword') {
        return (
            <Container fluid className='vh-100 vw-100 overflow-hidden'>
                <Row className='h-100 justify-content-center align-content-center'>
                    <Col className='h-100 flex-wrap d-flex justify-content-center align-content-center'>
                        <Form onSubmit={(e) => resetPassword(e)} style={{ maxWidth: "30rem" }} className='p-5 bg-white py-3 rounded-2  shadow '>
                            <Row>
                                <Col>
                                    <h4 className='text-center'>Choose a new password</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Form.Group as={Col} className='py-2'>
                                    <p>Create a new password that is at least 8 characters long. A strong password has a combination of letters, digits and punctuation marks.</p>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        className='no-focus-outline'
                                        type={isPassword ? "password" : "text"}
                                        placeholder="Enter new password"
                                        name='email'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        isInvalid={!!passwordErr}
                                    />
                                    <Form.Control.Feedback type='invalid'>{passwordErr}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Col >
                                    <Form.Check type="checkbox" label="Show Password" checked={!isPassword} onChange={() => setIsPassword(!isPassword)} />

                                </Col>
                            </Row>
                            <Row className='pt-3 m-0 w-100 '>
                                <Col className='p-0 d-flex justify-content-end'>
                                    <Button onClick={() => setPassword('')} variant="outline-secondary " className='me-3' >
                                        Reset
                                    </Button>
                                    {/* </Col>
                            <Col className='p-0'> */}
                                    <Button variant="outline-primary " type="submit" disabled={loading} >
                                        {
                                             loading? 'Loading...' : 'Save'
                                        }
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ForgotPassword