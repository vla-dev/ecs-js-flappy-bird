import Game from "./game.js";

addEventListener("DOMContentLoaded", () => {
    const game = new Game("Flappy bird - Clone", document.querySelector('#game'));

    const handleStartGame = e => {
        if (e instanceof KeyboardEvent && e.key !== ' ') return;
        game.start();
    }

    document.querySelector('#debug').onchange = (e) => game.setDebug(e.target.checked);
    document.addEventListener('keydown', handleStartGame)
    document.addEventListener('mousedown', handleStartGame)

    console.log(game)
});
