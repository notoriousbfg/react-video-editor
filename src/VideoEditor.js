import React from 'react'
import { events } from './events'
import Timeline from './Timeline'

class VideoEditor extends React.Component {
    constructor(props) {
        super(props)
        this.videoRef = React.createRef()
        this.state = {
            duration: 0,
            isPlaying: false,
            isFullScreen: false,
            deviceOrientation: '',
            volume: 100,
            chromecastActive: false,
            bufferedSeconds: 0,
            progress: {
                time: 0,
                percentage: 0
            },
            startPosition: 0,
            endPosition: 100
        }
    }

    componentDidMount() {
        this.videoRef.current.addEventListener('loadeddata', evt => this.videoHasLoaded(evt))
        this.videoRef.current.addEventListener('loadedmetadata', evt => this.setBufferedSeconds(evt))
        this.videoRef.current.addEventListener('timeupdate', evt => this.setProgress(evt))
        this.videoRef.current.addEventListener('play', evt => this.setPlay(evt))
        this.videoRef.current.addEventListener('pause', evt => this.setPause(evt))

        events.on('timelineClick', evt => this.handleTimelineClick(evt))
        events.on('dragTimelineMarker', evt => this.handleTimelineMarkerDrag(evt))
    }

    setBufferedSeconds(evt) {
        let video = this.videoRef.current
        if (video.buffered.length === 0) return
        this.setState({ bufferedSeconds: video.buffered.end(0) - video.buffered.start(0) })
    }

    setProgress(evt) {
        let video = this.videoRef.current
        this.setState({
            progress: {
                time: video.currentTime,
                percentage: (video.currentTime / video.duration) * 100
            }
        })
        if (video.currentTime > ((this.state.endPosition / 100) * this.state.duration)) {
            video.pause()
        }
    }

    setPlay(evt) {
        this.setState({ isPlaying: true })
    }

    setPause(evt) {
        this.setState({ isPlaying: false })
    }

    handleTimelineClick(percentage) {
        let duration = this.state.duration

        if(percentage < this.state.startPosition) {
            this.videoRef.current.currentTime = duration * (this.state.startPosition / 100)
        } else if (percentage > this.state.endPosition) {
            this.videoRef.current.currentTime = duration * (this.state.endPosition / 100)
        } else {
            this.videoRef.current.currentTime = duration * (percentage / 100)            
        }
    }

    handleTimelineMarkerDrag(evt) {
        if(evt.start) {
            this.handleTimelineClick(evt.percentage)
            this.setState({ startPosition: evt.percentage })
        } else {
            this.setState({ endPosition: evt.percentage })

            if(this.state.progress.percentage > this.state.endPosition) {
                this.handleTimelineClick(this.state.endPosition)
            }
        }
    }

    videoHasLoaded(evt) {
        this.setState({
            duration: this.videoRef.current.duration
        })
    }

    render() {
        return (
            this.props.src ?
                <div>
                    <div className="ve-video-container">
                        <video
                            ref={this.videoRef}
                            src={this.props.src}
                            preload={this.props.preload}
                            className="ve-video"
                            controls>
                        </video>
                    </div>
                    <Timeline
                        progress={this.state.progress}
                        startPosition={this.state.startPosition}
                        endPosition={this.state.endPosition}>
                    </Timeline>
                </div>
            : null
        )
    }
}

export default VideoEditor