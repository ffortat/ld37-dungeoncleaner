// TODO : generalize to add as a lib (and upgrade listeners for function attached to object)
function Preloader(renderer) {
	this.loaded = false;
	this.listeners = {
		ready : []
	};
	this.next = {
		ready : []
	};

	load.json('dialogs/level0.json');
	load.json('dialogs/level1.json');
	load.json('dialogs/level2.json');
	load.json('dialogs/level3.json');
	load.json('dialogs/level4.json');
	load.json('dialogs/level5.json');
	load.json('dialogs/level6.json');
	load.json('dialogs/level7.json');
	load.json('dialogs/level8.json');
	load.json('dialogs/level9.json');
	load.json('dialogs/level10.json');
	load.json('dialogs/level11.json');
	load.json('dialogs/level12.json');
	load.json('dialogs/level13.json');
	load.json('dialogs/level14.json');
	load.json('animations/items/pots.json');
	load.json('animations/messes/blood0.json');
	load.json('animations/messes/blood1.json');
	load.json('animations/messes/blood2.json');
	load.json('animations/messes/blood4.json');
	load.json('animations/monsters/monster.json');
	load.json('animations/monsters/skeleton.json');
	load.json('animations/powerups/coin.json');
	load.json('animations/powerups/heart.json');
	load.json('animations/resources/bones.json');
	load.json('animations/resources/pots.json');
	load.json('animations/resources/ribs.json');
	load.json('animations/resources/skulls.json');
	load.json('animations/cleaner.json');
	load.json('animations/fetcher.json');
	load.json('animations/healer.json');

	this.loader = PIXI.loader;
	this.assets = [
		['blueprint/background', 'blueprint/background.png'],
		['blueprint/skull', 'blueprint/skull.png'],
		['blueprint/ribs', 'blueprint/ribs.png'],
		['blueprint/leg', 'blueprint/leg.png'],
		['blueprint/arm', 'blueprint/arm.png'],
		['gui/background', 'gui/background.png'],
		['gui/bone', 'gui/bone.png'],
		['gui/cleaner', 'gui/cleaner.png'],
		['gui/coin', 'gui/coin.png'],
		['gui/fetcher', 'gui/fetcher.png'],
		['gui/healer', 'gui/healer.png'],
		['gui/heart', 'gui/heart.png'],
		['gui/hoven', 'gui/hoven.png'],
		['gui/monster', 'gui/monster.png'],
		['gui/pot', 'gui/pot.png'],
		['gui/rib', 'gui/rib.png'],
		['gui/selected', 'gui/selected.png'],
		['gui/shortcut', 'gui/shortcut.png'],
		['gui/skeleton', 'gui/skeleton.png'],
		['gui/skull', 'gui/skull.png'],
		['stuff/blood0-1', 'stuff/blood0-1.png'],
		['stuff/blood0-2', 'stuff/blood0-2.png'],
		['stuff/blood0-3', 'stuff/blood0-3.png'],
		['stuff/blood0-4', 'stuff/blood0-4.png'],
		['stuff/blood0-5', 'stuff/blood0-5.png'],
		['stuff/blood0-6', 'stuff/blood0-6.png'],
		['stuff/blood1-1', 'stuff/blood1-1.png'],
		['stuff/blood1-2', 'stuff/blood1-2.png'],
		['stuff/blood1-3', 'stuff/blood1-3.png'],
		['stuff/blood1-4', 'stuff/blood1-4.png'],
		['stuff/blood1-5', 'stuff/blood1-5.png'],
		['stuff/blood1-6', 'stuff/blood1-6.png'],
		['stuff/blood2-1', 'stuff/blood2-1.png'],
		['stuff/blood2-2', 'stuff/blood2-2.png'],
		['stuff/blood2-3', 'stuff/blood2-3.png'],
		['stuff/blood2-4', 'stuff/blood2-4.png'],
		['stuff/blood4-1', 'stuff/blood4-1.png'],
		['stuff/blood4-2', 'stuff/blood4-2.png'],
		['stuff/bone', 'stuff/bone.png'],
		['stuff/monster', 'stuff/monster.png'],
		['stuff/pot', 'stuff/pot.png'],
		['stuff/rib', 'stuff/rib.png'],
		['stuff/skeleton', 'stuff/skeleton.png'],
		['stuff/skull', 'stuff/skull.png'],
		['background', 'background.png'],
		['cleaner', 'cleaner.png'],
		['fetcher', 'fetcher.png'],
		['healer', 'healer.png'],
	];

	this.renderer = renderer;
	this.container = new PIXI.Container();
	
	var text = new PIXI.Text('Loading...', {fontFamily : 'Arial', fontSize: 36, fill : 0xDDDDDD});
	this.container.addChild(text);
	text.position = new PIXI.Point((this.renderer.width - text.width) / 2, this.renderer.height - text.height - 20);
	// console.log(text)

	// load.ready(this.Init, this);
	this.Init();
}

Preloader.prototype.Init = function (data) {
	var self = this;

	this.assets.forEach(function (asset) {
		this.loader.add(asset[0], 'textures/' + asset[1]);
	}, this);

	this.loader.load();
	this.loader.once('complete', function () {
		self.loaded = true;
		self.listeners.ready.forEach(function (listener) {
			listener();
		});
		while (self.next.ready.length > 0) {
			(self.next.ready.shift())();
		}
	});
}

Preloader.prototype.on = function(event, callback) {
	if (this.listeners[event]) {
		this.listeners[event].push(callback);
	}

	if (this.loaded) {
		callback();		
	}
};

Preloader.prototype.ready = function(callback) {
	if (!this.loaded) {
		this.next.ready.push(callback);
	} else {
		callback();
	}
};

Preloader.prototype.Tick = function (length) {
 	this.Draw();
}

Preloader.prototype.Draw = function () {
	this.renderer.render(this.container);
}