class Scrollable {
    constructor(Instance, props) {
        this.clones = [];
        this.clonesCount = props.clonesCount || 3;
        this.scrollSpeed = props.scrollSpeed || 15;
        this.spaceBetween = props.spaceBetween || 0;

        for (let i = 0; i < this.clonesCount; i++) {
            const x = props.x + (props.width + props.spaceBetween) * i;
            this.clones.push(new Instance({ ...props, x }));
        }
    }

    animate(dt) {
        if (this.clones.length) {
            this.clones.forEach(clone => {
                clone.x -= this.scrollSpeed * dt;
                clone.update();
            })

            if (this.clones[0].x + this.clones[0].width <= 0) {
                const firstClone = this.clones.shift();
                firstClone.x = this.clones[this.clones.length - 1].x + firstClone.width + this.spaceBetween;
                firstClone.y = firstClone.randomY || firstClone.y;
                this.clones.push(firstClone);
            }
        }
    }
}

export default Scrollable;