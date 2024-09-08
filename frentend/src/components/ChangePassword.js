import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert,  } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { backend_Base_url } from '../constants';

function ChangePassword() {
    const [data, setData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const { user } = useSelector(state => state.player);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        // Validation
        if (!data.currentPassword.trim()) {
            validationErrors.currentPassword = 'Current password is required';
        }
        if (!data.newPassword.trim()) {
            validationErrors.newPassword = 'New password is required';
        } else if (data.newPassword.length < 8) {
            validationErrors.newPassword = 'Password should have at least 8 characters';
        }
        if (!data.confirmPassword.trim()) {
            validationErrors.confirmPassword = 'Confirm password is required';
        }
        if (data.newPassword !== data.confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(validationErrors);
        setSuccess('');

        // If no validation errors, proceed with API call
        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);
                const response = await axios.put(`${backend_Base_url}/users/changepassword`, {
                    userId: user._id,
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword
                });
                console.log(response);
                setData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setSuccess('Password changed successfully.');
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 401) {
                    setErrors({ currentPassword: 'Current password is incorrect' });
                } else {
                    setErrors({ general: 'An error occurred. Please try again later.' });
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container fluid className='py-4'>
            <Row className='justify-content-center'>
                <Col xs={12} md={8} lg={6} className="p-4 bg-white border rounded" >
                    {/* <div className="p-4 bg-white border rounded" > */}
                    <h3 className="mb-4">Change Password</h3>
                    {/* Success Message */}
                    {success && <Alert variant="success">{success}</Alert>}
                    {/* General Error Message */}
                    {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        {/* Current Password */}
                        <Form.Group className="mb-3" controlId="currentPassword">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                name='currentPassword'
                                className='no-focus-outline'
                                value={data.currentPassword}
                                onChange={e => setData({ ...data, currentPassword: e.target.value })}
                                isInvalid={!!errors.currentPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.currentPassword}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* New Password */}
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                name='newPassword'
                                className='no-focus-outline'
                                value={data.newPassword}
                                onChange={e => setData({ ...data, newPassword: e.target.value })}
                                isInvalid={!!errors.newPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.newPassword}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Confirm New Password */}
                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                name='confirmPassword'
                                className='no-focus-outline'
                                value={data.confirmPassword}
                                onChange={e => setData({ ...data, confirmPassword: e.target.value })}
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Show Password Checkbox */}
                        <Form.Group className="mb-3" controlId="showPassword">
                            <Form.Check
                                type="checkbox"
                                label="Show Password"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                        </Form.Group>

                        {/* Submit Button */}
                        <Button variant="outline-primary" type="submit" disabled={loading} className="w-100">
                            {loading ? <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" /> : "Change Password"}
                        </Button>
                    </Form>
                    {/* </div> */}
                </Col>
            </Row>
        </Container>
    );
}

export default ChangePassword;
