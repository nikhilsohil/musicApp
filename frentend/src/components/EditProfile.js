import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { playerAction } from "../store/player";
import { backend_Base_url } from '../constants';

function EditProfile() {
    const { user } = useSelector(state => state.player);
    const [data, setData] = useState({
        name: '',
        email: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [generalError, setGeneralError] = useState('');
    const dispatch = useDispatch();

    // Populate form with existing user data
    useEffect(() => {
        if (user) {
            setData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email } = data;
        const validationErrors = {};

        // Validation
        if (!name.trim()) {
            validationErrors.name = "Please enter your name";
        }

        if (!email.trim()) {
            validationErrors.email = "Please enter your email address";
        } else if (!/^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z.-]{3,}\.[a-zA-Z]{2,}$/.test(email)) {
            validationErrors.email = "Invalid email format";
        }

        setErrors(validationErrors);
        setSuccess('');
        setGeneralError('');

        // If no validation errors, proceed with API call
        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);
                const response = await axios.put(`${backend_Base_url}/users/updateprofile`, {
                    userId: user._id,
                    name,
                    email
                });
                console.log(response);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                dispatch(playerAction.login(response.data.user));
                setSuccess('Profile updated successfully.');
            } catch (error) {
                console.error(error);
                if (error.response && error.response.data && error.response.data.message) {
                    setGeneralError(error.response.data.message);
                } else {
                    setGeneralError('An error occurred. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container fluid className='py-4'>
            <Row className='justify-content-center'>
                <Col xs={12} md={8} lg={6} className="p-4 bg-white border rounded">
                    <div className="p bg-white  rounded" >
                        <h3 className="mb-4">Edit Profile</h3>
                        {/* Success Message */}
                        {success && <Alert variant="success">{success}</Alert>}
                        {/* General Error Message */}
                        {generalError && <Alert variant="danger">{generalError}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    name='name'
                                    className='no-focus-outline'
                                    value={data.name}
                                    onChange={e => setData({ ...data, name: e.target.value })}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Email Field */}
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    name='email'
                                    className='no-focus-outline'
                                    value={data.email}
                                    onChange={e => setData({ ...data, email: e.target.value })}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Submit Button */}
                            <Button variant="outline-primary" type="submit" disabled={loading} className="w-100">
                                {loading ? <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" /> : "Update Profile"}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default EditProfile;
