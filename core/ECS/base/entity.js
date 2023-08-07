import { uuid } from "../../../utils/utils.js";

class Entity {
    constructor(id = uuid()) {
        this.id = id;
        this.active = true;
        this.components = {};
    }

    addComponent(name, data) {
        this.components[name] = data;
    }

    removeComponent(name) {
        delete this.components[name];
    }

    hasComponent(name) {
        return name in this.components;
    }

    getComponent(name) {
        return this.components[name];
    }

    update(dt) {
        if (this.active) {
            Object
                .values(this.components)
                .forEach(component => component.update(dt))
        }
    }

    dispose() {
        ECS.removeEntity(this);
    }
}

export default Entity;