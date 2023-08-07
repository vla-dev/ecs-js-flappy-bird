import Component from "../base/component.js";

class Collider extends Component {
    constructor(props) {
        super(props);
        this.layer = props.layer;
        this.innerOffset = props.innerOffset;
    }
}

export default Collider;
