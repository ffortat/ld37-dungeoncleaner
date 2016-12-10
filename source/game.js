var ticker = PIXI.ticker.shared;
ticker.autoStart = false;
ticker.stop();

var renderer = new PIXI.autoDetectRenderer(1280, 720);
renderer.backgroundColor = 0x333333;
renderer.roundPixels = true;
document.body.appendChild(renderer.view);

var preloader = new Preloader(renderer);
var level = null;//new Level('level0', renderer);
var menu = null;//new Menu(renderer);
var currentScene = preloader;

function tick(length) {
    currentScene.Tick(length);
}

ticker.add(tick)
ticker.start();

preloader.on('ready', function () {
	level = new Level('level0', renderer);
	currentScene = level;
});

mouse.attachTo(renderer.view);
renderer.view.addEventListener('click', function () {window.focus()});
renderer.view.oncontextmenu = function () { return false; }

window.focus();