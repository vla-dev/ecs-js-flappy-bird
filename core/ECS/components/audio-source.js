import Component from "../base/component.js";

class AudioSource extends Component {
    constructor(props) {
        super(props);
        this.audioClips = Object
            .keys(props.audioClips)
            .reduce((acc, key) => {
                acc[key] = new Audio(props.audioClips[key])
                return acc;
            }, {})
    }

    play(clip) {
        const audioClip = this.audioClips[clip];

        if (!audioClip.paused) {
            audioClip.pause();
        }

        audioClip.play();
    }
}

export default AudioSource;
