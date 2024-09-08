import React, { useEffect, useState } from 'react';
import { backend_Base_url } from '../constants';
import { Container, Col, Form, Button, Row,Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { playerAction } from '../store/player';
import logo from "../images/logo2.png";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [isPassword, setIsPassword] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.player);

  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });

    switch (e.target.name) {
      case "email":
        setError({ ...error, email: e.target.value ? "" : "Email is required" });
        break;
      case "password":
        setError({ ...error, password: e.target.value ? "" : "Password is required" });
        break;
      default:
        break;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = {};
    if (!data.email) error.email = "Email is required";
    if (!data.password) error.password = "Password is required";

    setError(error);

    if (Object.keys(error).length === 0) {
      try {
        const response = await axios.post(`${backend_Base_url}/auth/login`, data);
        dispatch(playerAction.login(response.data.user));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate("/");
      } catch (error) {
        if (!error.response) {
          alert("Server is not reachable.");
        } else {
          const response = error.response;
          if (response.status === 401) {
            setError({ ...error, password: response.data.message });
          } else if (response.status === 400) {
            setError({ ...error, email: response.data.message });
          }
        }
      }
    }
  };

  return (
    <Container fluid className='vh-100 overflow-hidden bg-light d-flex justify-content-center align-items-center'>
      <Row className='w-100 h-100 align-items-center justify-content-center'>
        <Col lg={6} md={8} sm={10} xs={12} className='text-center d-none d-md-block mb-4'>
          <div className='text-section p-4 mb-4'>
            <h2 className='text-primary fs-1 fw-bold' style={{ fontFamily: " 'Gupter', serif" }}>Welcome to TuneStream</h2>
            <p className='fs-5'>Discover and stream your favorite music and artist, create playlists, and share them with friends. Join us to explore a world of music tailored just for you!</p>
          </div>
        </Col>
        <Col lg={4} md={6} sm={8} xs={12}>
          <Form onSubmit={handleSubmit} className='p-4 shadow rounded bg-white'>
            {/* <div className='d-flex justify-content-center'>
              <Image className='w-100' src={logo} alert="tuneStream"/>
            </div> */}
          <h1 className='text-center fs-1 fw-bolder text-primary'>Log In</h1>
          <p className='text-center fs-5 mb-4 text-primary '>Into Tunestream</p>
            <Form.Group controlId='email' className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                className='no-focus-outline'
                name='email'
                value={data.email}
                onChange={handleChange}
                isInvalid={!!error.email}
              />
              <Form.Control.Feedback type='invalid'>{error.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={isPassword ? "password" : "text"}
                placeholder="Enter password"
                className='no-focus-outline'
                name='password'
                value={data.password}
                onChange={handleChange}
                isInvalid={!!error.password}
              />
              <Form.Control.Feedback type='invalid'>{error.password}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Check
                type="checkbox"
                className='no-focus-outline'
                label="Show Password"
                checked={!isPassword}
                onChange={() => setIsPassword(!isPassword)}
              />
            </Form.Group>
            <div className='d-flex justify-content-between align-items-center'>
              <Button variant="outline-primary" type="submit" className='px-4'>
                Log In
              </Button>
              <Link to="/resetpassword" className='text-decoration-none'>Forget Password?</Link>
            </div>
            <div className='text-center mt-3'>
              Don't have an account? <Link to='/signup' className='text-decoration-none  fs-5'>Sign Up</Link>
            </div>
            <div className='text-center mt-3'>
              Go Back to<Link to='/' className='text-decoration-none '> Home</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
