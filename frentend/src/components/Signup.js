import React, { useState, useEffect, } from 'react';
import { Container, Col, Form, Button, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Otp from '../reuseable/components/Otp';
import { useSelector, useDispatch } from 'react-redux';
import { playerAction } from '../store/player';
import { backend_Base_url } from '../constants';

function Signup() {

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isPassword, setIsPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEmailVarify, setIsEmailVarify] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [messageId, setMessageId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.player)


  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, []);


  useEffect(() => {
    setIsEmailVarify(false)
  }, [data.email])



  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });

    switch (e.target.name) {
      case "name":
        if (!e.target.value) {
          setError({ ...error, name: "Name is required" });
        } else if (e.target.value.length < 3) {
          setError({ ...error, name: "Name should have at least 3 characters" });
        } else {
          setError({ ...error, name: "" });
        }
        break;
      case "email":
        if (!e.target.value) {
          setError({ ...error, email: "Email is required" });
        }
        else if (!/^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z.-]{3,}\.[a-zA-Z]{2,}$/.test(e.target.value)) {
          setError({ ...error, email: "Invalid email format" });
        }
        else {
          setError({ ...error, email: "" });
        }
        break;
      case "password":
        if (!e.target.value) {
          setError({ ...error, password: "Password is required" });

        }
        else if (e.target.value.length < 8) {
          setError({ ...error, password: "Password should have at least 8 characters" });
        }
        else {
          setError({ ...error, password: "" });
        }
        break;
      default:
        break;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = {};
    if (!data.name.trim()) {
      error.name = "Name is required";
    }
    if (!data.email.trim()) {

      error.email = "Email is required";

    } else if (!/^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z.-]{3,}\.[a-zA-Z]{2,}$/.test(data.email)) {

      error.email = "Invalid email format";
    }
    if (!data.password.trim()) {
      error.password = "Password is required";
    }

    setError(error);

    if (Object.keys(error).length === 0) {

      await findUser();

    }
  };

  const handelVarifyEmail = async (e) => {
    // e.target.innerHTML = "sending...";
    try {
      const response = await axios.post(`${backend_Base_url}/auth/sendotp`, { email: data.email })
      console.log('OTP sent successfully:', response.data.data);

      setMessageId(response.data.messageId);
      setIsOtpSent(true);
      // e.target.innerHTML = "Varify Email";

    } catch (error) {
      console.error('error in sending otp', error);
      setError({ email: 'Please check the E-mail & try again.' });
      // e.target.innerHTML = "Varify Email";
    };
  }

  const findUser = async (e) => {
    try {
      setLoading(true);

      const response = await axios.get(`${backend_Base_url}/auth/finduser/${data.email}`,)
      console.log(response);
      if (response.data.user) {
          setError({...error,email:"Email already exists"});
        }
    } catch (error) {
      console.log(error);
      const response = error.response;
      if (response.status === 400) {
       await handelVarifyEmail();
      }
    }
    finally {
      setLoading(false);
    }
  }


  useEffect(()=>{

    if(isEmailVarify){
      saveUser();
    }

  },[isEmailVarify])



  const saveUser=async()=>{
    
    try {
      setLoading(true);
      const response = await axios.post(`${backend_Base_url}/auth/signup`, data);
      console.log(response);
      dispatch(playerAction.login(response.data.user));
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      if (!error.response) {
        alert("Server is not reachable.");
      }
      else {

        const response = error.response;
        console.log(response);
        if (response.status === 409) {
          setError({ email: response.data.message });
          console.log(error);
        }
      }
    }
    finally {
      setLoading(false);

    }
  }


  return (
    <>
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
              <h1 className='text-center fs-1 fw-bolder text-primary'>Sign Up</h1>
              <p className='text-center fs-5 mb-4 text-primary '>Into Tunestream</p>
              <Form.Group controlId='name' className='mb-3'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  className='no-focus-outline'
                  name='name'
                  value={data.name}
                  onChange={handleChange}
                  isInvalid={!!error.name}
                />
                <Form.Control.Feedback type='invalid'>{error.name}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId='email' className='mb-3'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter email"
                  className='no-focus-outline'
                  name='email'
                  value={data.email}
                  onChange={handleChange}
                  isValid={!!data.email && isEmailVarify && !error.email}
                  isInvalid={!!error.email}
                />
                <Form.Control.Feedback type='invalid'>{error.email}</Form.Control.Feedback>
                {/* <Form.Control.Feedback type="valid"
                >
                  {isEmailVarify ? "Verified " : ""}

                </Form.Control.Feedback>
                {
                  isEmailValid && !isEmailVarify &&
                  <Row>
                    <Col>
                      <span className='text-primary d-inline'
                        role='button'
                        onClick={(e) => handelVarifyEmail(e)}
                      >
                        Varify Email
                      </span>
                    </Col>
                  </Row>
                } */}
              </Form.Group>


              {
                isOtpSent &&
                <Otp

                  show={isOtpSent}
                  setShow={setIsOtpSent}
                  email={data.email}
                  messageId={messageId}
                  setIsVarify={setIsEmailVarify}

                />
              }

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
                <Button variant="outline-primary" type="submit" className='px-4' disabled={loading}>
                  {loading ? <Spinner animation="border" size='sm' /> : "Sign Up"}
                </Button>
              </div>
              <div className='text-center mt-3'>
                Already have an account? <Link to='/login' className='text-decoration-none fs-5'>Log In</Link>
              </div>
              <div className='text-center mt-3'>
              Go Back to<Link to='/' className='text-decoration-none '> Home</Link>
            </div>
            </Form>
          </Col>
        </Row>
      </Container >


      {/* <Container fluid className='vh-100 overflow-hidden'>
        <Row className='h-100 justify-content-center align-content-center'>
          <Col className='h-100 flex-wrap d-flex justify-content-center align-content-center'>
            <div className='text-section p-4 mb-5'>
              <h2 className='text-primary text-center fs-1 fw-bold' style={{ fontFamily: " 'Gupter', serif", }}>Welcome to TuneStream</h2>
              <p className=' px-2 fs-5 text' style={{ textAlign: "justify", }}>Discover and stream your favorite music and artist, create playlists, and share them with friends. Join us to explore a world of music tailored just for you!</p>
            </div>
          </Col>

          <Col className='h-100 m-0 d-flex flex-wrap justify-content-center align-content-center'>
            <Form onSubmit={handleSubmit} className='p-5   w-75 shadow '>
              <Row>
                <Col>
                  <h3 className='text-center'>SignUP</h3>
                </Col>
              </Row>
              <Row>
                <Form.Group as={Col} className='py-2'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    className='no-focus-outline'

                    type="text"
                    placeholder="Name"
                    name='name'
                    value={data.name}
                    onChange={handleChange}
                    isInvalid={!!error.name}
                  />
                  <Form.Control.Feedback type='invalid'>{error.name}</Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    className='no-focus-outline'
                    type="text"
                    placeholder="Email"
                    name='email'
                    value={data.email}
                    onChange={handleChange}
                    isValid={!!data.email && isEmailVarify && !error.email}  // Set as valid if email is present, verified, and no error
                    isInvalid={!!error.email}  // Set as invalid if there is an error
                  />
                  <Form.Control.Feedback type="invalid">
                    {error.email}
                  </Form.Control.Feedback>
                  <Form.Control.Feedback type="valid"
                  >
                    {isEmailVarify ? "Verified " : ""}

                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              {
                isEmailValid && !isEmailVarify &&
                <Row>
                  <Col>
                    <span className='text-primary d-inline'
                      role='button'
                      onClick={(e) => handelVarifyEmail(e)}
                    >
                      Varify Email
                    </span>
                  </Col>
                </Row>
              }

              {
                isOtpSent &&
                <Otp

                  show={isOtpSent}
                  setShow={setIsOtpSent}
                  email={data.email}
                  messageId={messageId}
                  setIsVarify={setIsEmailVarify}

                />
              }
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className='no-focus-outline'
                    type={isPassword ? "password" : "text"}
                    placeholder="Password"
                    name='password'
                    value={data.password}
                    onChange={handleChange}
                    isInvalid={!!error.password}
                  />
                  <Form.Control.Feedback type='invalid'>{error.password}</Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Col >
                  <Form.Check type="checkbox" label="Show Password" checked={!isPassword} onChange={() => setIsPassword(!isPassword)} />

                </Col>
              </Row>
              <Row className='pt-3 w-100'>
                <Col sm={6}>
                  <Button variant="outline-primary w-100" type="submit" disabled={!isEmailVarify || loading}>
                    {
                      loading ? <Spinner animation="border" size='sm' /> : "Sign Up"
                    }
                  </Button>
                </Col>
              </Row>
              <Row className='pt-3'>
                <Col>
                  Already have an account? <Link className='text-decoration-none' to='/login'>Login</Link>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container> */}
    </>
  );
}

export default Signup;
