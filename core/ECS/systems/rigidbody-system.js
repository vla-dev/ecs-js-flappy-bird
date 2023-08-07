import System from "../base/system.js";

class RigidbodySystem extends System {
    constructor(props) {
        super(props)
        this.gravity = 9.81;
    }

    update(ecs, dt) {
        ecs.entities.forEach(entity => {
            const { rigidbody, transform } = entity.components;

            if (rigidbody && !rigidbody.static) {
                rigidbody.velocity.y += this.gravity * dt;

                transform.position.x += rigidbody.velocity.x * dt;
                transform.position.y += rigidbody.velocity.y * dt;

                if (transform.rotation < 45) {
                    transform.rotation += 5 * dt;
                }
            }
        })
    }
}

export default RigidbodySystem;