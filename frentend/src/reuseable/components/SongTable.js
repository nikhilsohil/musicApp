import React from 'react';
import { Table } from'react-bootstrap';
import TrackRow from './TrackRow.js';

function SongTable({songs}) {

    return (
        <Table className='w-100 mx-2' hover responsive="sm" >
            <tbody className='w-100'>
                {songs.map((song, i) => (
                    <TrackRow key={i} songs={songs} track={song} index={i} />
                ))}
            </tbody>
        </Table>
    )
}

export default SongTable