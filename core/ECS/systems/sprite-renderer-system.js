import System from "../base/system.js";

class SpriteRendererSystem extends System {
    constructor(props) {
        super(props)
        this.currentFrame = 0;
        this.frameUpdateTime = 0;
    }

    build(ecs) {
        ecs.entities.forEach(entity => {
            const { transform, spriteRenderer } = entity.components;
            const { position, rotation } = transform || {};

            if (spriteRenderer) {
                const { x, y } = position;
                const { context, sprite, width, height } = spriteRenderer;

                sprite.onload = () => {
                    context.save();
                    context.translate(x + width / 2, y + height / 2);
                    context.rotate(rotation * Math.PI / 180);
                    context.translate(-x - width / 2, -y - height / 2);

                    if (spriteRenderer.animate) {
                        const { frames } = spriteRenderer;
                        const frameWidth = sprite.width / frames;

                        context.drawImage(
                            sprite,
                            this.currentFrame * frameWidth, 0, frameWidth, sprite.height,
                            x, y, width, height
                        );
                    } else {
                        context.drawImage(sprite, x, y, width, height);
                    }

                    context.restore();
                    spriteRenderer.loaded = true;
                }
            }
        })
    }

    update(ecs, dt) {
        ecs.entities.forEach(entity => {
            const { transform, spriteRenderer } = entity.components;
            const { position, rotation } = transform || {};

            if (spriteRenderer?.loaded) {
                const { x, y } = position;
                const { context, sprite, width, height } = spriteRenderer;

                context.save();
                context.translate(x + width / 2, y + height / 2);
                context.rotate(rotation * Math.PI / 180);
                context.translate(-x - width / 2, -y - height / 2);

                if (spriteRenderer.animate) {
                    const { frames, animationSpeed } = spriteRenderer;
                    const frameWidth = sprite.width / frames;

                    this.frameUpdateTime += dt;
                    if (this.frameUpdateTime >= animationSpeed * dt * 5) {
                        this.currentFrame = (this.currentFrame + 1) % frames;
                        this.frameUpdateTime = 0;
                    }

                    context.drawImage(
                        sprite,
                        this.currentFrame * frameWidth, 0, frameWidth, sprite.height,
                        x, y, width, height
                    );
                } else {
                    context.drawImage(sprite, x, y, width, height);
                }

                context.restore();
            }
        })
    }
}

export default SpriteRendererSystem;