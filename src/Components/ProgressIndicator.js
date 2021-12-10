import React from 'react'

export default function ProgressIndicator(p) {
    return (
        <div style={{
            width:p.progress + '%',
            height:'3px',
            background:p.color,
            transitionProperty:'all',
            transitionDuration:'0.5s'
        }}>
            
        </div>
    )
}
