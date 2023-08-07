import Collider from "../core/ECS/components/collider.js";
import SpriteRenderer from "../core/ECS/components/sprite-renderer.js";
import Transform from "../core/ECS/components/transform.js";
import ECS from "../core/ECS/index.js";

class Base {
    constructor(props) {
        this.sprite = props.sprite;
        this.x = props.x || 0;
        this.y = props.y || 0;
        this.width = props.width;
        this.height = props.height;
        this._entities = [this.create(this.x, this.y)];

        ECS.register(this._entities);
    }

    create(x, y) {
        const entity = new ECS.Entity();
        entity.addComponent('transform', new Transform({
            position: { x, y },
            rotation: 0
        }))
        entity.addComponent('spriteRenderer', new SpriteRenderer({
            context: ECS.context,
            src: this.sprite,
            width: this.width,
            height: this.height
        }));
        entity.addComponent('collider', new Collider({ layer: 'environment' }))

        return entity;
    }

    update() {
        this._entities.forEach(entity => {
            const { position } = entity.getComponent('transform');
            position.x = this.x;
            position.y = this.y;
        })
    }
}

export default Base;