import React from 'react'
import { Alert as BAlert,Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Alert(props) {

  return (
    <BAlert show={true} style={{height:"10rem"}} className='w-50' variant="danger">
    <BAlert.Heading>Alert</BAlert.Heading>
    <p>
        {props.msg}
    </p>
    <hr />
    <div className="d-flex justify-content-end">
      <Button as={Link} to='/' variant="outline-danger">
        Go Back to Home
      </Button>
    </div>
  </BAlert>
  )
}

export default Alert