import React from 'react'
import { render } from 'react-dom'
import { VideoEditor } from 'video-editor'

class App extends React.Component {
    update(evt) {
        console.log(evt)
    }

    render() {
        return (
            <div>
                <VideoEditor
                    src="http://localhost:8080/video/1.mp4"
                    preload={true}
                    muted={true}
                    onUpdate={this.update}
                />
            </div>
        )
    }
}

render(
    <App />,
    document.getElementById('root')
)