import React,{useState} from 'react';
import { Row, Col, Form, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { backend_Base_url } from '../../constants';

function AddPlaylist({show,setShow,song=null}) {
    const [playlistName, setPlaylistName] = useState('');
    const [playlistNameErr, setPlaylistNameErr] = useState('');

    const addToNewPlaylist = async () => {
        if (!playlistName) {
            setPlaylistNameErr('Please enter a playlist name');
            return;
        }
        try {
            const response = await axios.post(`${backend_Base_url}/playlist/create`, {
                name: playlistName,
                userId: JSON.parse(localStorage.getItem('user'))._id,
                song
            });
            console.log('Playlist created successfully:', response.data);
            setShow(false);
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a New Playlist</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-0'>
                    <Form className='p-5 py-1 rounded-2'>
                        <Row>
                            <Form.Group as={Col} className='py-2 p-0'>
                                <Form.Label>Playlist Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter playlist Name"
                                    value={playlistName}
                                    onChange={(e) => setPlaylistName(e.target.value)}
                                    isInvalid={!!playlistNameErr}
                                />
                                <Form.Control.Feedback type='invalid'>{playlistNameErr}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col className='p-0 py-2 d-flex justify-content-end'>
                                <Button variant="secondary" className='mx-2' onClick={() => setShow(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={addToNewPlaylist}>Create</Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
  )
}

export default AddPlaylist