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
		['blueprint/background', 'blueprint/background.png'],
		['blueprint/skull', 'blueprint/skull.png'],
		['blueprint/ribs', 'blueprint/ribs.png'],
		['blueprint/leg', 'blueprint/leg.png'],
		['blueprint/arm', 'blueprint/arm.png'],
		['gui/background', 'gui/background.png'],
		['gui/fetcher', 'gui/fetcher.png'],
		['gui/cleaner', 'gui/cleaner.png'],
		['gui/healer', 'gui/healer.png'],
		['gui/shortcut', 'gui/shortcut.png'],
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
		['stuff/pot', 'stuff/pot.png'],
		['stuff/rib', 'stuff/rib.png'],
		['stuff/skeleton', 'stuff/skeleton.png'],
		['stuff/skull', 'stuff/skull.png'],
		['background', 'background.jpg'],
		['boneicon', 'boneicon.png'],
		['bones', 'bones.png'],
		['builder', 'builder.png'],
		['cleaner', 'cleaner.png'],
		['coin', 'coin.png'],
		['coinicon', 'coinicon.png'],
		['fetcher', 'fetcher.png'],
		['healer', 'healer.png'],
		['heart', 'heart.png'],
		['hearticon', 'hearticon.png'],
		['hoven', 'hoven.png'],
		['monster', 'monster.png'],
		['monstericon', 'monstericon.png'],
		['poticon', 'poticon.png'],
		['pots', 'pots.png'],
		['ribicon', 'ribicon.png'],
		['ribs', 'ribs.png'],
		['skeletonicon', 'skeletonicon.png'],
		['skullicon', 'skullicon.png'],
		['skulls', 'skulls.png']
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