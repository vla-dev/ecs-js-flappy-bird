import { uuid } from "../../../utils/utils.js";

class Component {
    constructor(props) {
        this.id = uuid();
        this.enabled = true;
        Object.assign(this, props);
    }

    setActive(value) {
        this.enabled = value;
    }
}

export default Component;