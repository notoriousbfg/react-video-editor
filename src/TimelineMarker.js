import React from 'react'
import { events } from './events'

import './styles/TimelineMarker.css'

class TimelineMarker extends React.Component {
    constructor(props) {
        events
        super(props)
        this.markerRef = React.createRef();
        this.state = {
            isDragging: false
        }
    }

    render () {
        return (
            <div 
                className={`ve-timeline-marker ve-timeline-marker-${this.props.start ? 'start' : 'end'}`}
                style={{left: this.props.position + '%'}}>
            </div>
        )
    }
}

export default TimelineMarker