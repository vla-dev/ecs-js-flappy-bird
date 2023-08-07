import ECS from "../core/ECS/index.js";
import Controller from "../core/ECS/components/controller.js";
import Transform from "../core/ECS/components/transform.js";
import Rigidbody from "../core/ECS/components/rigidbody.js";
import SpriteRenderer from "../core/ECS/components/sprite-renderer.js";
import Collider from "../core/ECS/components/collider.js";
import { checkAABBCollision } from "../utils/utils.js";
import AudioSource from "../core/ECS/components/audio-source.js";

class Bird {
    constructor() {
        this._entity = this.create();
        ECS.register(this._entity);
    }

    create() {
        const entity = new ECS.Entity();
        entity.addComponent('transform', new Transform({
            position: {
                x: ECS.context.canvas.width / 4,
                y: 250
            },
            rotation: 0
        }))
        entity.addComponent('rigidbody', new Rigidbody())
        entity.addComponent('controller', new Controller({ jumpForce: 250 }))
        entity.addComponent('spriteRenderer', new SpriteRenderer({
            context: ECS.context,
            src: '/assets/bird.png',
            width: 80,
            height: 50,
            frames: 3,
            animate: true,
            animationSpeed: 1
        }))
        entity.addComponent('collider', new Collider({ layer: 'player', innerOffset: 10 }))
        entity.addComponent('audioSource', new AudioSource({
            audioClips: {
                point: '/assets/audio/point.wav',
                hit: '/assets/audio/hit.wav',
                wing: '/assets/audio/wing.wav',
                die: '/assets/audio/die.wav',
                swoosh: '/assets/audio/swoosh.wav'
            }
        }))

        return entity;
    }

    getComponent(component) {
        return this._entity.getComponent(component);
    }

    onCollision(cb) {
        const entities = ECS.entities.filter(entity => entity !== this._entity && entity.components.collider)

        entities.forEach(entity => {
            const { transform, spriteRenderer, collider } = entity.components;
            const bAAB = {
                x: transform.position.x,
                y: transform.position.y,
                width: spriteRenderer.width,
                height: spriteRenderer.height
            }

            if (this._entity && entities && this.collider.layer !== collider.layer) {
                if (checkAABBCollision(this.bounds, bAAB)) {
                    cb(entity);
                }
            }
        })
    }

    get transform() {
        return this.getComponent('transform');
    }

    get rigidbody() {
        return this.getComponent('rigidbody');
    }

    get collider() {
        return this.getComponent('collider');
    }

    get bounds() {
        const transform = this._entity.getComponent('transform');
        const sprite = this._entity.getComponent('spriteRenderer');

        return {
            x: transform.position.x + this.collider.innerOffset,
            y: transform.position.y + this.collider.innerOffset,
            width: sprite.width - this.collider.innerOffset,
            height: sprite.height - this.collider.innerOffset
        }
    }
}

export default Bird;