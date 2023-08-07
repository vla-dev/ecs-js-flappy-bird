class GameWindow {
    constructor(id, parent, onResize) {
        this._id = id;
        this._parent = parent;
        this._canvas = this._createCanvas();
        this.onResize = onResize;
        window.addEventListener('resize', this._resizeCanvas.bind(this));
    }

    _createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', this._id);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this._parent.appendChild(canvas);

        return canvas;
    }

    _resizeCanvas() {
        this.context.save();

        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;

        this.context.restore();
    }

    get canvas() {
        return this._canvas;
    }

    get context() {
        return this._canvas.getContext("2d");
    }
}

export default GameWindow;