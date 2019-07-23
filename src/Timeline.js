import React from 'react'
import TimelineMarker from './TimelineMarker'
import { events } from './events'

import './styles/Timeline.css'

class Timeline extends React.Component {
    constructor(props) {events
        super(props)
        this.trackRef = React.createRef();
        this.timelineRef = React.createRef();
        this.state = {
            isDragging: false,
            draggingEl: {}
        }
    }

    handleTimelineClick(evt) {
        let rect = this.trackRef.current.getBoundingClientRect()
        let x = evt.clientX - rect.left
        let percentage = (x / rect.width) * 100
        events.emit('timelineClick', percentage)
    }

    handleTimelineMouseDown(evt) {
        this.setState({ 
            isDragging: true,
            draggingEl: evt.target
        })
    }

    handleTimelineDrag(evt) {
        if(this.state.isDragging) {
            if(
                this.state.draggingEl.classList.contains('ve-video-timeline-track') ||
                this.state.draggingEl.classList.contains('ve-video-timeline-progress')
            ) {
                let rect = this.trackRef.current.getBoundingClientRect()
                let x = evt.clientX - rect.left
                let percentage = (x / rect.width) * 100
                events.emit('timelineClick', percentage)
            } else if(
                this.state.draggingEl.classList.contains('ve-timeline-marker')
            ) {
                let rect = this.timelineRef.current.getBoundingClientRect()
                let x = evt.clientX - (rect.left + 7)
                let percentage = (x / rect.width) * 100
                if(percentage > 0 && percentage < 100) {
                    events.emit('dragTimelineMarker', {
                        percentage: percentage,
                        start: this.state.draggingEl.classList.contains('ve-timeline-marker-start')
                    })
                }
            }
        }
    }

    handleTimelineMouseUp(evt) {
        this.setState({ isDragging: false, draggingEl: {} })
    }

    render() {
        return (
            <div className="ve-timeline-container">
                <div
                    ref={this.timelineRef}
                    className="ve-video-timeline"
                    onMouseDown={evt => this.handleTimelineMouseDown(evt)}
                    onMouseMove={evt => this.handleTimelineDrag(evt)}
                    onMouseUp={evt => this.handleTimelineMouseUp(evt)}>
                    <div 
                        ref={this.trackRef}
                        className="ve-video-timeline-track"
                        onClick={evt => this.handleTimelineClick(evt)}>
                        <div className="ve-video-timeline-progress" style={{width: this.props.progress.percentage + '%'}}></div>
                    </div>
                    <TimelineMarker start={true} position={this.props.startPosition} />
                    <TimelineMarker start={false} position={this.props.endPosition} />
                </div>
            </div>
        )
    }
}

export default Timeline