import Game from "./game.js";

addEventListener("DOMContentLoaded", () => {
    const game = new Game("Flappy bird - Clone", document.querySelector('#game'));

    const handleStartGame = e => {
        if (e instanceof KeyboardEvent && e.key !== ' ') return;
        game.start();
    }

    document.addEventListener('keydown', handleStartGame)
    document.addEventListener('mousedown', handleStartGame)
});
