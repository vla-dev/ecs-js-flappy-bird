import Entity from "./base/entity.js"
import System from "./base/system.js";

class ECS {
    static context = null
    static entities = [];
    static systems = [];

    constructor() { }

    static register(what) {
        if (Array.isArray(what)) {
            what.forEach(item => this.register(item));
            return;
        }

        if (what instanceof Entity) {
            this.entities = [...this.entities, ...(what.length ? what : [what])];
        } else if (what instanceof System) {
            what.build(this);
            this.systems = [...this.systems, ...(what.length ? what : [what])];
        } else {
            throw new Error('The ECS doesn not support this type: ', what);
        }
    }

    static unregister(entity) {
        switch (true) {
            case entity instanceof Entity:
                this.entities = this.entities.filter(e => e !== entity);
                break;
            case entity instanceof System:
                this.systems = this.systems.filter(s => s !== system);
                break;
            default:
                throw new Error('Unable to remove an unsupported type: ', entity);
        }
    }

    static getEntityById(id) {
        return this.entities.find(e => e.id == id)
    }

    static update(dt) {
        this.systems.forEach(system => system.update(this, dt))
    }

    static setContext(ctx) {
        this.context = ctx;
    }

    static reset() {
        this.entities = [];
        this.systems = [];
    }

    static get context() {
        return this.context
    }

    static get entities() {
        return this.entities;
    }
}

ECS.Entity = Entity;

export default ECS;