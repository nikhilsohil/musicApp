import React from 'react'

function PlayAnimation({ onClick }) {
    return (
        <div
            onClick={onClick}
            className="animation p-0 m-0 position-absolute top-50 start-50 translate-middle">
            <span />
            <span />
            <span />
            <span />
        </div>
    )
}
export default PlayAnimation;