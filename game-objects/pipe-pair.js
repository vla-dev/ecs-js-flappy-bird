import Collider from "../core/ECS/components/collider.js";
import SpriteRenderer from "../core/ECS/components/sprite-renderer.js";
import Transform from "../core/ECS/components/transform.js";
import ECS from "../core/ECS/index.js";
import { _BASE_HEIGHT } from "../utils/constants.js";
import { randomBetween } from "../utils/utils.js";

class PipePair {
    constructor(props) {
        this.sprite = props.sprite;
        this.x = props.x || 0;
        this.y = props.y || this.randomY;
        this.width = props.width;
        this.height = props.height;
        this.gap = props.gap || 100;
        this.entities = this.create(this.x, this.y);

        ECS.register(this.entities);
    }

    create(x, y) {
        const top = new ECS.Entity();
        top.addComponent('transform', new Transform({
            position: { x, y: y - this.height - this.gap },
            rotation: 180
        }))
        top.addComponent('spriteRenderer', new SpriteRenderer({
            context: ECS.context,
            src: this.sprite,
            width: this.width,
            height: this.height
        }));
        top.addComponent('collider', new Collider({ layer: 'environment' }))

        const bottom = new ECS.Entity();
        bottom.addComponent('transform', new Transform({
            position: { x, y: y + this.gap },
            rotation: 0
        }))
        bottom.addComponent('spriteRenderer', new SpriteRenderer({
            context: ECS.context,
            src: this.sprite,
            width: this.width,
            height: this.height
        }));
        bottom.addComponent('collider', new Collider({ layer: 'environment' }))


        return [top, bottom];
    }

    update() {
        this.entities.forEach(entity => {
            const { position } = entity.getComponent('transform');
            position.x = this.x;
        })
    }

    get randomY() {
        return randomBetween(150, ECS.context.canvas.height - _BASE_HEIGHT - 150)
    }
}

export default PipePair;