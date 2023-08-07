import InputManager from "../../input-manager.js";
import System from "../base/system.js";

class ControllerSystem extends System {
    constructor(props) {
        super(props)
        this.prevJumpKeyState = false;
    }

    update(ecs, dt) {
        ecs.entities.forEach(entity => {
            const { rigidbody, transform, controller, audioSource } = entity.components;

            if (rigidbody && !rigidbody.static) {
                const currentJumpKeyState = InputManager.keyPressed(' ') || InputManager.keyPressed('click') || InputManager.touchActive();

                if (currentJumpKeyState && !this.prevJumpKeyState) {
                    rigidbody.velocity.y = -controller.jumpForce * dt;
                    transform.position.y += rigidbody.velocity.y * dt;

                    transform.rotation = -30;
                    audioSource.play('wing');
                }

                this.prevJumpKeyState = currentJumpKeyState;
            }
        })
    }
}

export default ControllerSystem;