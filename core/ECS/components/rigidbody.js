import Component from "../base/component.js";

class Rigidbody extends Component {
    constructor(props) {
        super(props);
        this.mass = 1;
        this.velocity = { x: 0, y: 0 };
        this.static = false;
    }
}

export default Rigidbody;