import React from 'react';
import { Offcanvas, Table,} from 'react-bootstrap';
import {  useSelector } from 'react-redux';
import QueueRow from '../reuseable/components/QueueRow';




function Queue({ show, handleClose }) {

    const { currentTrack, queue } = useSelector(state => state.player);

    return (
        <Offcanvas show={show} placement='end' className='scroll offcanvas-custom'
            onHide={() => handleClose(false)}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Queue</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className='scroll'>
                <Table className='w-100 overflow-auto' hover>
                    <tbody>
                        {queue.map((track, i) => {
                            if (i >= currentTrack) {
                              return <QueueRow key={i} track={track} index={i}/>
                            }
                            return null;
                        })}

                    </tbody>
                </Table>
            </Offcanvas.Body>
        </Offcanvas >
    );
}

export default Queue;
