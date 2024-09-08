import React, { useEffect } from 'react';
import { Container, Card, Placeholder } from 'react-bootstrap';
import Holder from 'holderjs'

function PlaylistCardLoader() {
    useEffect(() => {
        Holder.run();
    }, []);

    return (

    <Container as={Placeholder}  fluid className='m-0 placeholder-glow bg-transparent text-decoration-none'>
      <Card style={{ width: '14vw', minWidth: "10rem", position: 'relative' }} className='m-3 text-decoration-none playlist-card dark loaderCard'>
        <div className=''>
          <Card.Img variant="top" src="holder.js/150x150?text=Loading..." alt="Loading playlist cover" className="h-100 w-100 placeholder-glow" />
        </div>

        <Card.Body>
          <Placeholder as="p" animation="glow" className='m-0'>
            <Placeholder xs={10} bg="secondary" />
          </Placeholder>
        </Card.Body>
      </Card>
    </Container>
  );
}


export default PlaylistCardLoader;
