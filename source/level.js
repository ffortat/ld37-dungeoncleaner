function Level(number, player, renderer) {
	var self = this;

	this.player = player;
	this.number = number;

	this.json = {};
	this.window = new PIXI.Rectangle(0, 0, renderer.width, renderer.height);
	this.grid = new PIXI.Rectangle(0, 0, 1, 1);

	this.music = new Audio();
	this.width = 0;
	this.height = 0;
	this.tile = new PIXI.Rectangle(0, 0, 1, 1);
	this.margin = new PIXI.Point(128, 96);

	this.origin = new PIXI.Point(0, 0);
	
	this.character = null;
	this.element = null;
	this.workers = {
		fetcher : 2,
		cleaner : 1,
		healer : 0,
		queue : []
	};
	this.stuff = {
		pot : 0,
		skeleton : 0,
		monster : 0,
		coin : 0,
		heart : 0
	};
	this.resources = {
		pots : 0,
		skulls : 0,
		ribs : 0,
		bones : 0
	};
	this.objects = [];
	this.room = [[], []];
	this.builder = new Timer(5);
	this.hoven = new Timer(2);

	this.interface = {};
	this.dialogs = {};
	this.score = 0;
	this.multiplier = 1;
	this.powerupCount = 0;

	this.objectives = [];
	this.timer = 0;
	this.end = -1;
	this.finallevel = false;

	this.loaded = false;
	this.paused = false;
	this.listeners = {
		ready : [],
		update : [],
		lose : [],
		win : []
	};
	this.next = {
		ready : [],
		kill : []
	};

	this.victorySpeech = {};
	this.defeatDialog = {};
	this.ending = false;
	this.over = false;

	this.renderer = renderer;
	this.container = new PIXI.Container();
	this.game = new PIXI.Container();
	this.map = new PIXI.Container();
	this.dynamic = new PIXI.Container();
	this.gui = new PIXI.Container();

	this.mapSprite = null;

	this.gui.position = new PIXI.Point(0,0);
	this.gui.width = this.renderer.width;
	this.gui.height = this.renderer.height;

	load.json('levels/level' + number + '.json', function (data) {self.Init(data);});
};

Level.prototype.Init = function(level) {
	var self = this;

	this.dialogs.intro = new Dialog(this.container, 'level' + this.number, 'intro');
	this.dialogs.intro.on('end', function () { this.Play(); }, this);
	this.dialogs.intro.on('followup', function (followup) {
		this.Pause();
		this.dialogs.followup = followup;
		followup.on('end', function () { this.Play(); }, this);
	}, this);
	this.dialogs.outro = new Dialog(this.container, 'level' + this.number, 'outro');

	this.json = level;

	this.layers = level.layers;
	this.width = level.width;
	this.height = level.height;
	this.tile.width = level.tilewidth;
	this.tile.height = level.tileheight;

	var background = PIXI.Sprite.fromImage('textures/background-clear.png');
	this.map.addChild(background);

	this.player.Setup(this);
	this.workers.fetcher += level.properties.fetcher;
	this.workers.cleaner += level.properties.cleaner;
	this.workers.healer += level.properties.healer;
	this.stuff.pot += level.properties.pot;
	this.stuff.skeleton += level.properties.skeleton;
	this.stuff.monster += level.properties.monster;
	this.stuff.coin += level.properties.coin;
	this.stuff.heart += level.properties.heart;
	this.resources.pots += level.properties.pots;
	this.resources.skulls += level.properties.skulls;
	this.resources.ribs += level.properties.ribs;
	this.resources.bones += level.properties.bones;
	for (var i = 1; i < 4; i += 1) {
		if (level.properties['objective' + i]) {
			this.objectives.push({
				type : level.properties['objective' + i],
				limit : level.properties['objective' + i + '_quantity'],
				count : 0
			});
		}
	}
	this.timer = level.properties.timer;
	this.finallevel = level.properties.finallevel;

	this.room.forEach(function (layer) {
		layer.forEach(function (tileid, index) {
			var x = index % this.width;
			var y = Math.floor(index / this.width);
			var element;

			switch (tileid) {
				case 'pots' :
				case 'skulls' :
				case 'ribs' :
				case 'bones' :
					element = new Resource(x * level.tilewidth, y * level.tileheight, tileid, this)
					this.AddObject(element);
					break;
				case 'blood0' :
				case 'blood1' :
				case 'blood2' :
				case 'blood4' :
				case 'mud' :
					this.AddObject(new Mess(x * level.tilewidth, y * level.tileheight, tileid, this));
					break;
				case 'monster' :
					element = new Monster(x * level.tilewidth, y * level.tileheight, tileid, this)
					this.AddObject(element);
					element.Kill();
					break;
			}

			if (element) {
				element.on('load', function () {
					var x = element.x - (element.width - this.tile.width) / 2;
					var y = element.y - (element.height - this.tile.height);
					element.MoveTo(x, y);
				}, this);
			}
		}, this);
	}, this);

	this.builder.on('end', function () {
		this.stuff.skeleton += 1;
		this.update();
	}, this);

	this.hoven.on('end', function () {
		this.stuff.pot += 1;
		this.update();
	}, this);

	this.grid.width = this.width * this.tile.width;
	this.grid.height = this.height * this.tile.height;
	var mapRenderTexture = PIXI.RenderTexture.create(background.width, background.height);
	this.renderer.render(this.map, mapRenderTexture);
	this.mapSprite = new PIXI.Sprite(mapRenderTexture);

	this.game.addChild(this.mapSprite);
	this.game.addChild(this.dynamic);
	this.container.addChild(this.game);
	this.container.addChild(this.gui);
	this.dynamic.position = this.margin;
	this.CenterCamera();

	this.interface = new GUI(this);
	mouse.on('click', this.Use, this);
	mouse.on('mousemove', this.Move, this);

	this.update();

	this.loaded = true;
	this.listeners.ready.forEach(function (listener) {
		listener.func.call(listener.object);
	});
	while (this.next.ready.length > 0) {
		(this.next.ready.shift())();
	}

	this.Pause();

	this.dialogs.intro.Display();
	renderer.view.style.cursor = 'pointer';
};

Level.prototype.on = function (eventType, callback, self) {
	if (this.listeners[eventType]) {
		this.listeners[eventType].push({func : callback, object : self});
	} else {
		console.log('Eventype:', eventType, 'not recognized');
	}
};

Level.prototype.off = function(eventType, callback) {
	var indexes = [];

	if (!this.listeners[eventType]) {
		console.log('Eventype:', eventType, 'not recognized');
		return;
	}

	this.listeners[eventType].forEach(function (listener, index) {
		if (listener.func === callback) {
			indexes.unshift(index);
		}
	}, this);

	indexes.forEach(function (index) {
		this.listeners[eventType].splice(index, 1);
	}, this);
};

Level.prototype.ready = function(callback) {
	if (!this.loaded) {
		this.next.ready.push(callback);
	} else {
		callback();
	}
};

Level.prototype.update = function () {
	this.listeners.update.forEach(function (listener) {
		listener.func.call(listener.object);
	});
}

Level.prototype.lose = function() {
	this.listeners.lose.forEach(function (listener) {
		listener.func.call(listener.object);
	});
};

Level.prototype.win = function() {
	this.listeners.win.forEach(function (listener) {
		listener.func.call(listener.object);
	});
};

Level.prototype.CenterCamera = function (point) {
	this.game.x = (renderer.width - this.game.width) / 2;
	this.game.y = (renderer.height - this.game.height) / 2;
	this.grid.x = this.game.x + this.margin.x;
	this.grid.y = this.game.y + this.margin.y;
};

Level.prototype.EndLevel = function () {
	if (!this.ending) {
		this.ending = true;

		console.log('Ending level', this.number)

		if (this.CheckObjectives()) {
			this.dialogs.outro.Display();
			renderer.view.style.cursor = 'pointer';
			this.dialogs.outro.on('end', function () {
				if (this.finallevel) {
					this.EndGame();
				} else {
					this.Victory();
				}
			}, this);
		} else {
			this.Defeat();
		}
	}
};

Level.prototype.Victory = function () {
	this.DestroyRoom();
	this.player.Update(this);
	this.update();
	// currentScene = new Level(this.number + 1, this.player, this.renderer);
	currentScene = new ScoreTable(this.player, this.number, this.renderer);
};

Level.prototype.Defeat = function () {
	console.log('defeat')
	this.player.multiplier = 1;
	currentScene = new Level(this.number, this.player, this.renderer);
};

Level.prototype.DestroyRoom = function () {
	var length = this.width * this.height;
	var skeletonCount = 0;
	var monsterCount = 0;

	this.room = [[], []];

	this.objects.forEach(function (object) {
		var index = (Math.floor((object.y + object.height - 64) / 64)) * this.width + Math.floor((object.x + object.width / 2) / 64);

		switch (object.name) {
			case 'pot':
				this.room[1][index] = 'pots';
				break;
			case 'skeleton':
				skeletonCount += 1;
				break;
			case 'monster':
				this.room[1][index] = object.name;
				monsterCount += 1;
				break;
			case 'coin':
			case 'heart':
				this.powerupCount += 1;
				break;
			default:
				console.log('Name unknown, can\'t destroy', object.name);
				break;
		}
	}, this);

	var amounts = [1, 2, 4];
	for (var i = 0; i < monsterCount; i += 1) {
		var x;
		var y;
		var check;
		var tries = 0;
		var amount = amounts[Math.floor(Math.random() * amounts.length)];
		// amount = 4;

		do {
			x = Math.floor(Math.random() * (this.width - (amount >= 2 ? 1 : 0)));
			y = Math.floor(Math.random() * (this.height - (amount === 4 ? 1 : 0)));
			check = false;

			check |= this.room[0][y * this.width + x];

			if (amount >= 2) {
				check |= this.room[0][y * this.width + x + 1];

				if (amount === 4) {
					check |= this.room[0][(y + 1) * this.width + x];
					check |= this.room[0][(y + 1) * this.width + x + 1];
				}
			}

			tries += 1;
		} while (check && tries < length);

		this.room[0][y * this.width + x] = 'blood' + amount;
		if (amount >= 2) {
				this.room[0][y * this.width + x + 1] = 'blood';

				if (amount === 4) {
					this.room[0][(y + 1) * this.width + x] = 'blood';
					this.room[0][(y + 1) * this.width + x + 1] = 'blood';
				}
			}
	}

	for (var i = 0; i < skeletonCount; i += 1) {
		var resources = ['skulls', 'ribs', 'bones', 'bones'];
		var index;

		resources.forEach(function (resource) {
			var tries = 0;
			do {
				index = Math.floor(Math.random() * length);
				tries += 1;
			} while (this.room[1][index] && tries < length);

			this.room[1][index] = resource;
		}, this);
	}
};

Level.prototype.EndGame = function () {
	this.player.Reset();
	// currentScene = new Level(0, this.player, this.renderer);
	currentScene = new Menu(this.renderer);
};

Level.prototype.UpdateObjectives = function (object) {
	this.objectives.forEach(function (objective) {
		if (objective.type === object.name) {
			objective.count += 1;
		}
	}, this);

	this.update();
}

Level.prototype.CheckObjectives = function () {
	return this.objectives.every(function (objective) {
		return objective.count >= objective.limit;
	}, this);
}

Level.prototype.Collides = function(shape1, shape2) {
	function intersectRectangles(rectangle1, rectangle2) {
		var r1 = {
			left : rectangle1.x,
			right : rectangle1.x + rectangle1.width,
			top : rectangle1.y,
			bottom : rectangle1.y + rectangle1.height
		};
		var r2 = {
			left : rectangle2.x,
			right : rectangle2.x + rectangle2.width,
			top : rectangle2.y,
			bottom : rectangle2.y + rectangle2.height
		};

		return !(r2.left > r1.right || 
				r2.right < r1.left || 
				r2.top > r1.bottom ||
				r2.bottom < r1.top);
	}

	function intersectSegmentCircle(a, b, c) {
		var ac = Math.sqrt(Math.pow(a.x - c.x, 2) + Math.pow(a.y - c.y, 2));
		var ab = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

		return c.radius >= Math.sqrt(Math.pow(ac, 2) - Math.pow(ab / 2, 2));
	}

	function intersectRectangleCircle(rectangle, circle) {
		var r = {
			left : rectangle.x,
			right : rectangle.x + rectangle.width,
			top : rectangle.y,
			bottom : rectangle.y + rectangle.height
		};
		

		return (rectangle.contains(circle.x, circle.y) ||
				intersectSegmentCircle(new PIXI.Point(r.left, r.top), new PIXI.Point(r.left, r.bottom), circle) ||
				intersectSegmentCircle(new PIXI.Point(r.left, r.bottom), new PIXI.Point(r.right, r.bottom), circle) ||
				intersectSegmentCircle(new PIXI.Point(r.right, r.bottom), new PIXI.Point(r.right, r.top), circle) ||
				intersectSegmentCircle(new PIXI.Point(r.right, r.top), new PIXI.Point(r.left, r.top), circle));
	}

	if (shape1.type === PIXI.SHAPES.RECT) {
		if (shape2.type === PIXI.SHAPES.RECT) {
			return intersectRectangles(shape1, shape2);
		}
	}
};

Level.prototype.AddObject = function (object) {
	this.objects.push(object);
};

Level.prototype.RemoveObject = function (object) {
	for (var i = 0; i < this.objects.length; i += 1) {
		if (this.objects[i] === object) {
			this.objects.splice(i, 1);
			break;
		}
	}
};

Level.prototype.ReorderRoom = function () {
	function orderRule(a, b) {
		var ax = a.x + (a.collider ? a.collider.x : 0);
		var ay = a.y + (a.collider ? a.collider.y : 0);
		var bx = b.x + (b.collider ? b.collider.x : 0);
		var by = b.y + (b.collider ? b.collider.y : 0);

		if (ay > by || (ay === by && ax < bx)) {
			return -1;
		}

		if (ay < by || (ay === by && ax > bx)) {
			return 1;
		}

		return 0;
	}

	var children = this.dynamic.children;
	children.sort(orderRule);
	children.forEach(function (child) {
		this.dynamic.setChildIndex(child, 0);
	}, this);
}

Level.prototype.GetObjects = function () {
	return this.objects;
};

Level.prototype.AddResources = function (resource) {
	if (!resource) {
		return;
	}

	if (this.resources[resource.name] === undefined && this.stuff[resource.name] === undefined) {
		console.log('Resource', resource.name, 'is unknown');
		return;
	}

	if (this.resources[resource.name] !== undefined) {
		this.resources[resource.name] += resource.amount;
	} else if (this.stuff[resource.name] !== undefined) {
		this.stuff[resource.name] += 1;
	}

	this.update();
};

Level.prototype.IsClean = function () {
	return !this.objects.some(function (object) {
		switch (object.name) {
			case 'pots' :
			case 'skulls' :
			case 'ribs' :
			case 'bones' :
			case 'blood' :
			case 'mud' :
				return true;
			case 'monster' :
				return object.state !== object.states.alive;
			default :
				return false;
		}
	}, this);
};

Level.prototype.Prepare = function (type, name) {
	if (this.character) {
		this.character.Hide();
		this.character = null;
	}

	if (this.element) {
		this.element.Hide();
		this.element = null;
	}

	switch (type) {
		case 'fetcher':
			if (this.workers.fetcher) {
				this.character = new Fetcher(-1 * this.tile.width, 0, this);
				this.character.Hide();
			}
			break;
		case 'cleaner':
			if (this.workers.cleaner) {
				this.character = new Cleaner(-1 * this.tile.width, 0, this);
				this.character.Hide();
			}
			break;
		case 'healer':
			if (this.workers.healer) {
				this.character = new Healer(-1 * this.tile.width, 0, this);
				this.character.Hide();
			}
			break;
		case 'item':
			if (this.stuff[name]) {
				this.element = new Item(-1 * this.tile.width, 0, name, this);
				this.element.Hide();
				break;
			}
		case 'monster':
			if (this.stuff[name]) {
				this.element = new Monster(-1 * this.tile.width, 0, name, this);
				this.element.Hide();
			break;
			}
		case 'powerup':
			if (this.stuff[name]) {
				this.element = new Powerup(-1 * this.tile.width, 0, name, this);
				this.element.Hide();
			}
			break;
		default:
			console.log('Type unknown to prepare');
			break;
	}

	this.Move();
};

Level.prototype.Use = function () {
	if (!this.paused) {
		if (this.character) {
			if (this.character.isDisplayed) {
				this.objects.some(function (element) {
					console.log()
					if (element.GetRectangle().contains(mouse.x - this.grid.x, mouse.y - this.grid.y)) {
						return this.UseWorker(element);
					}
				}, this);
			}
		}

		if (this.element) {
			if (this.element.isDisplayed) {
				if (!this.objects.some(function (element) { return element.GetRectangle().contains(mouse.x - this.grid.x, mouse.y - this.grid.y); }, this)) {
					this.UseStuff();
				} else {
					console.log('collide!')
				}
			}
		}
	}
};

Level.prototype.Move = function () {
	if (!this.paused && !this.ending) {
		if (this.grid.contains(mouse.x, mouse.y)) {
			renderer.view.style.cursor = 'auto';

			var x = mouse.x - this.grid.x;
			var y = mouse.y - this.grid.y;

			x = Math.floor(x / this.tile.width) * this.tile.width;
			y = Math.floor(y / this.tile.height) * this.tile.height;

			if (this.character) {
				x -= (this.character.width - this.tile.width) / 2;
				y -= (this.character.height - this.tile.height);
				this.character.Display();
				this.character.MoveTo(x, y);

				renderer.view.style.cursor = 'pointer';
			}

			if (this.element) {
				x -= (this.element.width - this.tile.width) / 2;
				y -= (this.element.height - this.tile.height);
				this.element.Display();
				this.element.MoveTo(x, y);

				renderer.view.style.cursor = 'pointer';
			}
		} else {
			if (this.character) {
				this.character.Hide();
			}

			if (this.element) {
				this.element.Hide();
			}
		}
	} else {
		if (this.dialogs.intro.IsOpened() || this.dialogs.outro.IsOpened() || (this.dialogs.followup && this.dialogs.followup.IsOpened())) {
			renderer.view.style.cursor = 'pointer';
		}
	}
};

Level.prototype.Keypress = function () {
	if (key.down[keys.escape]) {
		if (this.interface.altButtons) {
			this.interface.CloseBlueprint();
		} else if (this.character) {
			this.character.Hide();
			this.character = null;
		} else if (this.element) {
			this.element.Hide();
			this.element = null;
		} else {
			this.TogglePause();
		}
		
		key.down[keys.escape] = false;
	}

	if (key.down[keys.enter]) {
		this.objectives.forEach(function (objective) {
			objective.count = objective.limit;
		}, this);

		this.EndLevel();
	}
};

Level.prototype.UseWorker = function (element) {
	if (this.character.CanAct(element)) {
		this.objects.indexOf(element);
		this.workers.queue.push(this.character);
		this.workers[this.character.type] -= 1;
		this.character.Act(element);

		if (key.down[keys.shift]) {
			var type = this.character.type;
			this.character = null;
			this.Prepare(type);
		} else {
			this.character = null;		
		}

		this.update();

		return true;
	}

	return false;
};

Level.prototype.UseStuff = function () {
	if (this.workers.fetcher) {
		var stuff = this.element;
		var character = new Fetcher(-1 * this.tile.width, 0, this);
		character.Act(this.element);
		this.workers.fetcher -= 1;

		this.element.on('placed', function () {
			stuff.Display();
			this.UpdateObjectives(stuff);
		}, this);

		this.element.Hide();
		this.AddObject(this.element);
		this.stuff[this.element.name] -= 1;
		
		if (key.down[keys.shift]) {
			var type = this.element.type;
			var name = this.element.name;
			this.element = null;
			this.Prepare(type, name);
		} else {
			this.element = null;
		}

		this.update();
	}
}

Level.prototype.RemoveWorker = function (worker) {
	var index = this.workers.queue.indexOf(worker);

	if (index !== -1) {
		this.workers.queue.splice(index, 1);
	}

	this.AddResources(worker.target);
	this.workers[worker.type] += 1;

	this.update();
};

Level.prototype.BuildSkeleton = function (resource, amount) {
	if (this.resources[resource] >= amount) {
		this.resources[resource] -= amount;
		this.update();
		return true;
	}

	return false;
}

Level.prototype.RefundSkeleton = function (resources) {
	for (var resource in resources) {
		this.resources[resource] += resources[resource];
		resources[resource] = 0;
	}
	
	this.update();
}

Level.prototype.CookPot = function () {
	if (this.resources.pots >= 3 && !this.hoven.timer) {
		this.resources.pots -= 3;
		this.hoven.Start();
		this.update();
	}
}

Level.prototype.OpenBuilder = function () {

}

Level.prototype.TogglePause = function () {
	if (this.paused) {
		this.Play();
	} else {
		this.Pause();
	}
};

Level.prototype.Pause = function () {
	if (!this.paused) {
		this.interface.Pause();
		this.paused = true;
	}
};

Level.prototype.Play = function () {
	if (this.paused) {
		renderer.view.style.cursor = 'auto';
		this.interface.Play();
		this.paused = false;
	}
};

Level.prototype.Tick = function(length) {
	if (this.loaded) {
		this.Keypress();
		
		if (!this.paused && !this.ending) {
			this.objects.forEach(function (object) {
				object.Tick(length);
			}, this);

			this.builder.Tick(length);
			this.hoven.Tick(length);

			this.timer -= length;

			if (this.timer <= 0) {
				this.timer = 0;
				this.EndLevel();
			}

			this.interface.Tick(length);

		}
		
		this.Draw();
	}
};

Level.prototype.Draw = function() {	
	if (this.loaded) {
		this.renderer.render(this.container);
	}
};