import Component from "../base/component.js";

class SpriteRenderer extends Component {
    constructor(props) {
        super(props);
        this.sprite = this._loadSprite();
    }

    _loadSprite() {
        const sprite = new Image();
        sprite.src = this.src;

        return sprite
    }
}

export default SpriteRenderer;