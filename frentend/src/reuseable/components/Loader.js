
import { Container, Spinner } from 'react-bootstrap';

function Loader() {
    return (
        <Container className='d-flex justify-content-center align-content-center'>

            <Spinner animation="border" role="status" className=''>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Container>
    )
}

export default Loader