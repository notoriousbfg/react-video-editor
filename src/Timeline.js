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

    play(evt) {
        events.emit('play')
    }

    pause(evt) {
        events.emit('pause')
    }

    reset(evt) {
        events.emit('resetToStart')
    }

    render() {
        return (
            <div className="ve-timeline-container">
                <div className="ve-video-timeline-controls">
                    <div className="ve-control ve-control-playpause">
                        {!this.props.isPlaying && this.props.canPlay ?
                            <svg width="22px" height="28px" viewBox="0 0 22 28" onClick={this.play}><g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g transform="translate(-854.000000, -2242.000000)"><polygon points="0 0 1400 0 1400 3600 0 3600"></polygon><polygon fill="#000000" points="854 2242 854 2270 876 2256" fill="#FFFFFF"></polygon><polygon points="848 2242 876 2242 876 2270 848 2270"></polygon></g></g></svg>
                        : 
                            <svg height="14px" version="1.1" viewBox="0 0 12 14" onClick={this.pause} width="12px" className="ve-pause"><title /><desc /><defs /><g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1"><g fill="#FFFFFF" transform="translate(-214.000000, -46.000000)"><g transform="translate(214.000000, 46.000000)"><path d="M0,14 L4,14 L4,0 L0,0 L0,14 L0,14 Z M8,0 L8,14 L12,14 L12,0 L8,0 L8,0 Z" /></g></g></g></svg>
                        }
                    </div>
                    <div className="ve-control ve-control-reset" onClick={this.reset}>
                        <svg height="20px" version="1.1" viewBox="0 0 16 20" width="16px"><g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1"><g fill="#000000" transform="translate(-2.000000, -127.000000)"><g transform="translate(2.000000, 127.000000)"><path d="M8,4 L8,0 L3,5 L8,10 L8,6 C11.3,6 14,8.7 14,12 C14,15.3 11.3,18 8,18 C4.7,18 2,15.3 2,12 L0,12 C0,16.4 3.6,20 8,20 C12.4,20 16,16.4 16,12 C16,7.6 12.4,4 8,4 L8,4 Z" fill="#FFFFFF" /></g></g></g></svg>
                    </div>
                </div>
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