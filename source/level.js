function Level(name, renderer) {
	var self = this;

	this.json = {};
	this.window = {
		x : 0,
		y : 0,
		w : 1280,
		h : 720
	};
	this.grid = new PIXI.Rectangle(0, 0, 1, 1);

	this.music = new Audio();
	this.tiles = {};
	this.tilesets = [];
	this.layers = [];
	this.terrain = [];
	this.colliders = {
		top : [],
		left : [],
		bottom : [],
		right : []
	};
	this.width = 0;
	this.height = 0;
	this.tile = {
		width : 0,
		height : 0
	};
	this.margin = {
		x : 128,
		y : 100
	}

	this.origin = {x:0,y:0};
	this.character = null;
	this.element = null;
	this.interface = {};
	this.end = -1;

	this.riddles = 0;
	this.locations = [];
	this.objects = [];
	for (var tag in Tags) {
		this.objects[Tags[tag]] = [];
	}

	this.loaded = false;
	this.listeners = {
		ready : [],
		kill : [],
		loose : [],
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

	load.json('levels/' + name + '.json', function (data) {self.Init(data);});
}

Level.prototype.Init = function(level) {
	var self = this;

	var itemid = -1;
	var messid = -1;
	var monsterid = -1;
	var islandid = -1;

	this.json = level;

	level.tilesets.forEach(function (tileset, index) {
		if (tileset.name === 'placeholders') {
			itemid = tileset.firstgid;
			messid = tileset.firstgid + 1;
			monsterid = tileset.firstgid + 2;
		} else {
			var uri = tileset.image;
			var texture = new Image();
			texture.src = uri

			this.tilesets[index] = {
				baseTexture : new PIXI.BaseTexture(texture),
				width : tileset.tilewidth,
				height : tileset.tileheight
			};

			for (var i = 0; i < tileset.imageheight; i += tileset.tileheight) {
				for (var j = 0; j < tileset.imagewidth; j += tileset.tilewidth) {
					this.tiles[tileset.firstgid + i / tileset.tileheight * (tileset.imagewidth / tileset.tilewidth) + j / tileset.tilewidth] = {
						x : j,
						y : i,
						set : index,
						texture : new PIXI.Texture(this.tilesets[index].baseTexture, new PIXI.Rectangle(j, i, tileset.tilewidth, tileset.tileheight))
					};
				}
			}
		}
	}, this);

	this.layers = level.layers;
	this.width = level.width;
	this.height = level.height;
	this.tile.width = level.tilewidth;
	this.tile.height = level.tileheight;

	var background = PIXI.Sprite.fromImage('textures/background.jpg');
	this.map.addChild(background);

	this.layers.forEach(function (layer) {
		if (layer.visible) {
			layer.data.forEach(function (tileid, index) {
				if (tileid > 0) {
					var tile = new PIXI.Sprite(this.tiles[tileid].texture);
					var x = (index % this.width) * this.tile.width + this.margin.x;
					var y = Math.floor(index / this.width) * this.tile.height + this.margin.y;

					tile.position = new PIXI.Point(x, y);
					this.map.addChild(tile);

					var rectangle = new PIXI.Rectangle(x, y, this.tile.width, this.tile.height);

					if (tileid >= islandid && tileid <= islandid + 12) {
						this.terrain.push(rectangle);
					}
				}
			}, this);
		} else {
			if (layer.name === 'Placeholders') {
				layer.data.forEach(function (tileid, index) {
					var x = index % layer.width;
					var y = Math.floor(index / layer.width);

					switch (tileid) {
						case itemid :
							this.AddObject(new Item(x * level.tilewidth, y * level.tileheight, 'pot', this));
							break;
						case messid :
							this.AddObject(new Mess(x * level.tilewidth, y * level.tileheight, 'crap', this));
							break;
						case monsterid :
							this.AddObject(new Monster(x * level.tilewidth, y * level.tileheight, 'mage', this));
							break;
					}
				}, this);
			}
		}
	}, this);

	this.colliders.top.push(new PIXI.Rectangle(-this.tile.width, this.map.height, this.map.width + this.tile.width * 2, this.tile.height));
	this.colliders.left.push(new PIXI.Rectangle(this.map.width, 0, this.tile.width, this.map.height));
	this.colliders.right.push(new PIXI.Rectangle(-this.tile.width, 0, this.tile.width, this.map.height));
	this.colliders.bottom.push(new PIXI.Rectangle(-this.tile.width, -this.tile.height, this.map.width + this.tile.width * 2, this.tile.height));

	this.loaded = true;
	this.listeners.ready.forEach(function (listener) {
		listener();
	});
	while (this.next.ready.length > 0) {
		(this.next.ready.shift())();
	}

	this.grid.width = this.width * this.tile.width;
	this.grid.height = this.height * this.tile.height;
	var mapRenderTexture = PIXI.RenderTexture.create(background.width, background.height);
	this.renderer.render(this.map, mapRenderTexture);
	this.mapSprite = new PIXI.Sprite(mapRenderTexture);

	// this.game.addChild(this.map);
	this.game.addChild(this.mapSprite);
	this.game.addChild(this.dynamic);
	this.container.addChild(this.game);
	this.container.addChild(this.gui);
	
	this.dynamic.position = this.margin;

	this.interface = new GUI(this);

	mouse.on('click', this.Use, this);

	// this.victorySpeech = new Dialog(this, 'victory');
	// this.victorySpeech.on('end', function () {
	// 	currentScene = menu;
	// 	menu.SwitchTo('credits');
	// });
	// this.defeatDialog = new Dialog(this, 'defeat');
	// this.defeatDialog.on('end', function (retry) {
	// 	if (retry) {
	// 		setTimeout(function () { menu.Play(); }, 200);
	// 	} else {
	// 		currentScene = menu;
	// 		menu.SwitchTo('credits');
	// 	}
	// });
	// var intro = new Dialog(this, 'introduction');
	// intro.on('end', function () {
	// 	self.submarine.Unlock();
	// });
	// this.submarine.Lock();
	this.CenterCamera();
};

Level.prototype.on = function(event, callback) {
	if (this.listeners[event]) {
		this.listeners[event].push(callback);
	}
};

Level.prototype.ready = function(callback) {
	if (!this.loaded) {
		this.next.ready.push(callback);
	} else {
		callback();
	}
};

Level.prototype.loose = function() {
	this.listeners.loose.forEach(function (listener) {
		listener();
	});
};

Level.prototype.win = function() {
	this.listeners.win.forEach(function (listener) {
		listener();
	});
};

Level.prototype.CenterCamera = function (point) {
	this.game.x = (renderer.width - this.game.width) / 2;
	this.game.y = (renderer.height - this.game.height) / 2;
	this.grid.x = this.game.x + this.margin.x;
	this.grid.y = this.game.y + this.margin.y;
}

Level.prototype.Victory = function () {
	var self = this;
	this.submarine.Lock();
	setTimeout(function () {self.victorySpeech.Display();}, 1000);
}

Level.prototype.Defeat = function () {
	this.defeatDialog.Display();
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
}

Level.prototype.RemoveObject = function (object) {
	for (var i = 0; i < this.objects.length; i += 1) {
		if (this.objects[i] === object) {
			this.objects.splice(i, 1);
			break;
		}
	}
}

Level.prototype.GetObjects = function (tag) {
	if (!this.objects[tag]) {
		return [];
	}

	return this.objects[tag];
}

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
		case 'cleaner':
			this.character = new Cleaner(-1 * this.tile.width, 0, this);
			this.character.Hide();
			break;
		case 'healer':
			this.character = new Healer(-1 * this.tile.width, 0, this);
			this.character.Hide();
			break;
		case 'fetcher':
			this.character = new Fetcher(-1 * this.tile.width, 0, this);
			this.character.Hide();
			break;
		case 'item':
			this.element = new Item(-1 * this.tile.width, 0, name, this);
			this.element.Hide();
			break;
		case 'monster':
			this.element = new Monster(-1 * this.tile.width, 0, name, this);
			this.element.Hide();
			break;
		case 'powerup':
			this.element = new Powerup(-1 * this.tile.width, 0, name, this);
			this.element.Hide();
			break;
		default:
			console.log('Type unknown to prepare');
			break;
	}
}

Level.prototype.Use = function () {
	if (this.character) {
		if (this.character.isDisplayed) {
			this.objects.some(function (element) {
				if (element.GetRectangle().contains(mouse.x - this.grid.x, mouse.y - this.grid.y)) {
					if (this.character.CanAct(element)) {
						this.AddObject(this.character);
						this.character.Act(element);

						this.character = null;
						return true;
					}
				}
			}, this);
		}
	}

	if (this.element) {
		if (this.element.isDisplayed) {
			if (!this.objects.some(function (element) { 
				console.log(element.GetRectangle(), mouse.x - this.grid.x, mouse.y - this.grid.y);
				return element.GetRectangle().contains(mouse.x - this.grid.x, mouse.y - this.grid.y); 
			}, this)) {
				this.AddObject(this.element);
				this.element = null;
			} else {
				console.log('collide!')
			}
		}
	}
}

Level.prototype.GetColliders = function (whitelist) {
	var colliders = [];

	whitelist.forEach(function (tag) {
		colliders = colliders.concat(this.objects[tag]);
	}, this);

	return colliders;
}

Level.prototype.Tick = function(length) {
	if (this.loaded) {
		var deltaTime = PIXI.ticker.shared.elapsedMS / 1000;

		this.objects.forEach(function (object) {
			object.Tick(deltaTime);
		}, this);

		this.interface.Tick(deltaTime);

		if (this.grid.contains(mouse.x, mouse.y)) {
			var x = mouse.x - this.grid.x;
			var y = mouse.y - this.grid.y;

			if (this.character) {
				this.character.Display();
				this.character.MoveTo(Math.floor(x / this.tile.width) * this.tile.width, Math.floor(y / this.tile.height) * this.tile.height);
			}

			if (this.element) {
				this.element.Display();
				this.element.MoveTo(Math.floor(x / this.tile.width) * this.tile.width, Math.floor(y / this.tile.height) * this.tile.height);
			}
		} else {
			if (this.character) {
				this.character.Hide();
			}

			if (this.element) {
				this.element.Hide();
			}
		}

		this.Draw();
	}
};

Level.prototype.Draw = function() {	
	if (this.loaded) {
		this.renderer.render(this.container);
	}
};