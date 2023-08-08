import ECS from "./core/ECS/index.js";
import SpriteRendererSystem from "./core/ECS/systems/sprite-renderer-system.js";
import GameWindow from "./game-window.js";
import InputManager from "./core/input-manager.js";
import RigidbodySystem from "./core/ECS/systems/rigidbody-system.js";
import ControllerSystem from "./core/ECS/systems/controller-system.js";
import Bird from "./game-objects/bird.js";
import Background from "./game-objects/background.js";
import Base from "./game-objects/base.js";
import PipePair from "./game-objects/pipe-pair.js";
import Scrollable from "./game-objects/scrollable.js";
import {
    GAME_STATES,
    _BASE_HEIGHT,
    _LOCAL_STORAGE_KEY,
    _PIPES_GAP,
    _PIPES_SPACE_BETWEEN,
    _PIPE_WIDTH,
    _SCROLLABLE_CLONES_COUNT,
    _SCROLL_SPEED
} from "./utils/constants.js";

let _currentGameState = GAME_STATES.getReady;
let _lastRenderTime = null;
let _pipePassed = false;

class Game {
    constructor(name, container) {
        this.name = name
        this.player = null;
        this.score = 0;
        this.bestScore = Number(localStorage.getItem(_LOCAL_STORAGE_KEY) ?? 0);
        this.window = new GameWindow('flappy-bird', container);
        this.debug = false;
        this.stats = new Stats();
        
        document.body.appendChild(this.stats.dom);
        document.querySelector("#best").innerText = "BEST: " + this.bestScore

        InputManager.init();
        ECS.setContext(this.window.context);

        this._build();
    }

    _registerSystems() {
        const spriteRendererSystem = new SpriteRendererSystem();
        const rigidbodySystem = new RigidbodySystem();
        const controllerSystem = new ControllerSystem();

        ECS.register([
            spriteRendererSystem,
            rigidbodySystem,
            controllerSystem,
        ])
    }

    _build() {
        this.background = new Scrollable(Background, {
            sprite: './assets/background.png',
            x: 0,
            y: 0,
            height: this.window.canvas.height,
            width: 600,
            clonesCount: _SCROLLABLE_CLONES_COUNT,
            scrollSpeed: _SCROLL_SPEED,
            spaceBetween: -20,
        });

        this.player = new Bird();

        this.pipes = new Scrollable(PipePair, {
            sprite: './assets/pipe-green.png',
            x: this.window.canvas.width - 200,
            height: this.window.canvas.height,
            width: _PIPE_WIDTH,
            gap: _PIPES_GAP,
            clonesCount: _SCROLLABLE_CLONES_COUNT,
            scrollSpeed: _SCROLL_SPEED,
            spaceBetween: _PIPES_SPACE_BETWEEN
        });

        this.base = new Scrollable(Base, {
            sprite: './assets/base.png',
            x: 0,
            y: this.window.canvas.height - _BASE_HEIGHT,
            height: _BASE_HEIGHT,
            width: 600,
            clonesCount: _SCROLLABLE_CLONES_COUNT,
            scrollSpeed: _SCROLL_SPEED,
            spaceBetween: 0
        });

        this.nextPipe = this.pipes.clones[0];
        this._registerSystems();
        this._render();
    }

    start() {
        switch (_currentGameState) {
            case GAME_STATES.getReady:
                document.querySelector('#get-ready-screen').style.display = 'none';
                this._setGameState(GAME_STATES.playing);
                break;
            case GAME_STATES.gameOver:
                document.querySelector('#game-over-screen').style.display = 'none';
                document.querySelector('#get-ready-screen').style.display = 'block';
                this.player.getComponent('audioSource').play('swoosh');
                this._restart();
                this._setGameState(GAME_STATES.getReady);
                break;
            default:
                return null
        }
    }

    setDebug(value) {
        this.debug = value;
    }

    _setGameState(state) {
        _currentGameState = state;
    }

    _restart() {
        cancelAnimationFrame(this._animationFrame);
        ECS.reset();
        this._updateScore(0);
        this._build();
    }

    _gameOver() {
        const audioSource = this.player.getComponent('audioSource');
        audioSource.play('hit');
        audioSource.play('die');

        this._setGameState(GAME_STATES.gameOver);
        document.querySelector('#game-over-screen').style.display = 'block';
    }

    _updateScore(value) {
        if (value !== undefined) {
            this.score = value;
            document.querySelector("#score").innerText = this.score;
        } else {
            if (this.nextPipe.x + _PIPE_WIDTH / 2 < this.player.bounds.x + this.player.bounds.width / 2) {
                if (!_pipePassed) {
                    this.score++;
                    this.player.getComponent('audioSource').play('point');

                    if (this.score > this.bestScore) {
                        this.bestScore = this.score;
                        localStorage.setItem(_LOCAL_STORAGE_KEY, this.bestScore);
                        document.querySelector("#best").innerText = "BEST: " + this.bestScore
                    }

                    document.querySelector("#score").innerText = this.score;

                    _pipePassed = true;
                    this.nextPipe = this.pipes.clones.find(pipe => pipe.x > this.player.bounds.x + this.player.bounds.width / 2);
                }
            } else {
                _pipePassed = false;
            }
        }
    }

    _onDebug(dt) {
        // player mid-line
        this.window.context.save();
        this.window.context.beginPath();
        this.window.context.moveTo(this.player.bounds.x + this.player.bounds.width / 2, this.player.bounds.y - 50);
        this.window.context.lineTo(this.player.bounds.x + this.player.bounds.width / 2, this.player.bounds.y + this.player.bounds.height + 50);
        this.window.context.strokeStyle = "red";
        this.window.context.stroke();

        // player bbox
        this.window.context.strokeStyle = "blue";
        this.window.context.strokeRect(this.player.bounds.x, this.player.bounds.y, this.player.bounds.width, this.player.bounds.height);

        // render next pipe mid line
        this.window.context.beginPath();
        this.window.context.moveTo(this.nextPipe.x + _PIPE_WIDTH / 2, this.nextPipe.y - _PIPES_GAP);
        this.window.context.lineTo(this.nextPipe.x + _PIPE_WIDTH / 2, this.nextPipe.y + _PIPES_GAP);
        this.window.context.strokeStyle = "green";
        this.window.context.stroke();

        // render pipes bbox
        this.pipes.clones.forEach(pipe => {
            pipe.entities.forEach(entity => {
                const { position } = entity.getComponent('transform');

                this.window.context.strokeStyle = "blue";
                this.window.context.strokeRect(position.x, position.y, pipe.width, pipe.height);
            })
        })

        //render base bbox
        this.base.clones.forEach(base => {
            this.window.context.strokeStyle = "blue";
            this.window.context.strokeRect(base.x, base.y, base.width, base.height);
        })

        this.window.context.restore();
    }

    _update(dt) {
        if (_currentGameState !== GAME_STATES.playing) return;

        this.window.context.clearRect(0, 0, this.window.canvas.width, this.window.canvas.height);
        ECS.update(dt);

        this.background.animate(dt);
        this.pipes.animate(dt);
        this.base.animate(dt);

        if (this.player.transform.position.y <= 0) {
            this.player.transform.position.y = 0;
        }

        this._updateScore();
        this.player.onCollision(() => this._gameOver())

        if (this.debug) {
            this._onDebug(dt);
        }
    }

    _render() {
        this._animationFrame = requestAnimationFrame(t => {
            this.stats.begin();

            if (_lastRenderTime == null) {
                _lastRenderTime = t;
            }

            this._update((t - _lastRenderTime) * 0.01);
            _lastRenderTime = t;

            this.stats.end();
            this._render();
        });
    }
}

export default Game;