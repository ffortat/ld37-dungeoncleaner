// TODO : generalize to add as a lib (and upgrade listeners for function attached to object)
function Preloader(renderer) {
	this.loaded = false;
	this.listeners = {
		ready : []
	};
	this.next = {
		ready : []
	};

	this.loader = PIXI.loader;
	this.assets = [
		['ground_terrain', 'ground_terrain.png'],
		['sea', 'sea.png'],
		['coin', 'coin.png'],
		['cleaner', 'cleaner.png'],
		['healer', 'healer.png'],
		['item', 'item.png'],
		['mess', 'mess.png'],
		['monster', 'monster.png'],
		['coinicon', 'coinicon.png'],
		['hearticon', 'hearticon.png'],
		['monstericon', 'monstericon.png'],
		['skeletonicon', 'skeletonicon.png'],
		['poticon', 'poticon.png'],
		['broomstick', 'broomstick.png'],
		['redcross', 'redcross.png'],
		['crate', 'crate.png'],
		['background', 'background.jpg']
	];

	this.renderer = renderer;
	this.container = new PIXI.Container();
	
	var text = new PIXI.Text('Loading...', {fontFamily : 'Arial', fontSize: 36, fill : 0xDDDDDD});
	this.container.addChild(text);
	text.position = new PIXI.Point((this.renderer.width - text.width) / 2, this.renderer.height - text.height - 20);
	// console.log(text)

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