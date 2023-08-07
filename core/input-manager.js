class InputManager {
    static keyState = {};
    static touchState = false;

    static onKeyDown(event) {
        const key = event instanceof MouseEvent ? 'click' : event.key;
        this.keyState[key] = true;
    }

    static onKeyUp(event) {
        const key = event instanceof MouseEvent ? 'click' : event.key;
        this.keyState[key] = false;
    }

    static onTouchStart(event) {
        this.touchState = true;
    }

    static onTouchEnd(event) {
        this.touchState = false;
    }

    static keyPressed(key) {
        return this.keyState[key] === true;
    }

    static touchActive() {
        return this.touchState === true;
    }

    static init() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('mousedown', this.onKeyDown.bind(this));
        window.addEventListener('mouseup', this.onKeyUp.bind(this));

        window.addEventListener('touchstart', this.onTouchStart.bind(this));
        window.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    static dispose() {
        window.removeEventListener('keydown', this.onKeyDown.bind(this));
        window.removeEventListener('keyup', this.onKeyUp.bind(this));
        window.removeEventListener('mousedown', this.onKeyDown.bind(this));
        window.removeEventListener('mouseup', this.onKeyUp.bind(this));

        window.removeEventListener('touchstart', this.onTouchStart.bind(this));
        window.removeEventListener('touchend', this.onTouchEnd.bind(this));
    }
}

export default InputManager;
