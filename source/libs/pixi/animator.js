/*	Animation format
 *	{
 *		"default" : <animation_name>,
 *		"animations" : {
 *			<animation_name> : {
 *				"frames" : [
 *					{
 *						"tile" : <tile_number>
 *						"points" : [
 *							{"x" : <x>, "y" : <y>},
 *							...
 *						]
 *					}
 *					...
 *				],
 *				"speed" : <speed>,
 *				"loop" : <loop>
 *			}
 *			...
 *		},
 *		"tilesets" : [
 *			{
 *				"file" : <filename>,
 *				"tilewidth" : <tilewidth>,
 *				"tileheight" : <tileheight>,
 *				"imagewidth" : <imagewidth>,
 *				"imageheight" : <imageheight>,
 *				"firstgid" : <firstgid>
 *			},
 *			...
 *		],
 *		"stateful" : <stateful>,
 *		"states" : <states>
 *	}
 *
 *	<loop> : boolean
 *	<stateful> : boolean
 *		Has multiple states, one state per column
 */

function Animator(x, y, container) {
	// TODO : consider (x,y) as center
	this.x = x;
	this.y = y;
	this.width = 1;
	this.height = 1;

	this.tiles = [];
	this.tilesets = [];
	this.animations = [];
	this.currentAnimation = null;
	this.currentAnimationName = '';
	this.mirrored = false;
	this.isDisplayed = true;
	this.currentState = 0;

	this.container = container;

	this.isLoaded = false;

	this.listeners = {};
}

Animator.prototype.Init = function (data) {
	var self = this;

	data.tilesets.forEach(function (tileset, set) {
		var stateTiles = [];
		var index;
		var texture = new Image();
		if (tileset.file instanceof Array) {
			texture.src = 'textures/' + tileset.file[Math.floor(Math.random() * tileset.file.length)];
		} else {
			texture.src = 'textures/' + tileset.file
		}

		this.width = tileset.tilewidth;
		this.height = tileset.tileheight;

		this.tilesets[set] = {
			baseTexture : new PIXI.BaseTexture(texture),
			width : tileset.tilewidth,
			height : tileset.tileheight
		};

		this.tiles[0] = [];
		stateTiles = this.tiles[0];

		for (var i = 0; i < tileset.imagewidth; i += tileset.tilewidth) {
			if (data.stateful) {
				this.tiles[i / tileset.tilewidth] = [];
				stateTiles = this.tiles[this.tiles.length - 1];
			}
			for (var j = 0; j < tileset.imageheight; j += tileset.tileheight) {
				if (data.stateful) {
					index = tileset.firstgid + j / tileset.tileheight;
				} else {
					index = tileset.firstgid + j / tileset.tileheight + i / tileset.tilewidth * (tileset.imageheight / tileset.tileheight);
				}
				
				stateTiles[index] = {
					texture : new PIXI.Texture(this.tilesets[set].baseTexture, new PIXI.Rectangle(i, j, tileset.tilewidth, tileset.tileheight)),
					set : set
				};
			}
		}

	}, this);

	var textureSet = [];
	var stateCount = 1;

	if (data.stateful) {
		stateCount = data.states;
	}

	for (var state = 0; state < stateCount; state += 1) {
		this.animations[state] = {};

		for (var animation in data.animations) {
			textureSet = [];

			data.animations[animation].frames.forEach(function (frame) {
				var currentTexture = this.tiles[state][frame.tile].texture;
				currentTexture.points = frame.points;
				textureSet.push(currentTexture);
			}, this);

			var collider = data.collider ? data.collider : data.animations[animation].collider;

			this.animations[state][animation] = new PIXI.extras.MovieClip(textureSet);
			this.animations[state][animation].animationSpeed = data.animations[animation].speed / 100;
			this.animations[state][animation].loop = data.animations[animation].loop;
			this.animations[state][animation].pivot = new PIXI.Point(this.animations[state][animation].width / 2, this.animations[state][animation].height / 2);
			this.animations[state][animation].collider = collider ? new PIXI.Rectangle(collider.x, collider.y, collider.width, collider.height) : null;

			switch (data.animations[animation].blend) {
				case 'add':
					this.animations[state][animation].blendMode = PIXI.BLEND_MODES.ADD;
					break;
				default:
					this.animations[state][animation].blendMode = PIXI.BLEND_MODES.NORMAL;
					break;
			}
		}
	}

	this.currentAnimation = this.animations[this.currentState][data.default];
	this.currentAnimationName = data.default;
	this.currentAnimation.position = new PIXI.Point(this.x + this.currentAnimation.width / 2, this.y + this.currentAnimation.height / 2);
	this.currentAnimation.play();

	if (this.isDisplayed) {
		this.container.addChild(this.currentAnimation);

		// DUNGEON CLEANER
		if (this.level && this.level.ReorderRoom) {
			this.level.ReorderRoom();
		}
	}

	this.loaded();
}

Animator.prototype.on = function (eventType, callback, self) {
	if (!this.listeners[eventType]) {
		this.listeners[eventType] = [];
	}

	this.listeners[eventType].push({func : callback, object : self});

	if (eventType === 'load' && this.isLoaded) {
		callback.call(self);
	}
}

Animator.prototype.off = function(eventType, callback) {
	var indexes = [];

	if (!this.listeners[eventType]) {
		this.listeners[eventType] = [];
	}

	this.listeners[eventType].forEach(function (listener, index) {
		if (listener.func === callback) {
			indexes.unshift(index);
		}
	}, this);

	indexes.forEach(function (index) {
		this.listeners[eventType].splice(index, 1);
	}, this);
}

Animator.prototype.loaded = function () {
	this.isLoaded = true;

	if (this.listeners['load']) {
		this.listeners['load'].forEach(function (callback) {
			callback.func.call(callback.object);
		}, this);
	}
}

Animator.prototype.GetCenter = function () {
	var center = new PIXI.Point(this.x, this.y);

	if (this.mirrored) {
		center.x -= this.currentAnimation.width / 2;
	} else {
		center.x += this.currentAnimation.width / 2;
	}

	center.y -= this.currentAnimation.height / 2;

	return center;
}

Animator.prototype.GetRectangle = function () {
	if (this.currentAnimation) {
		if (this.currentAnimation.collider) {
			return new PIXI.Rectangle(this.x + this.currentAnimation.collider.x, this.y + this.currentAnimation.collider.y, this.currentAnimation.collider.width, this.currentAnimation.collider.height);
		} else {
			return new PIXI.Rectangle(this.x, this.y, this.currentAnimation.width, this.currentAnimation.height);
		}
	} else {
		return new PIXI.Rectangle(this.x, this.y, 0, 0);
	}
}

Animator.prototype.MoveTo = function (x, y) {
	this.x = x;
	this.y = y;

	this.currentAnimation.x = x + this.currentAnimation.width / 2;
	this.currentAnimation.y = y + this.currentAnimation.height / 2;

	// DUNGEON CLEANER
	if (this.level && this.level.ReorderRoom) {
		this.level.ReorderRoom();
	}
}

Animator.prototype.Hide = function () {
	if (this.isDisplayed) {
		this.container.removeChild(this.currentAnimation);
		this.isDisplayed = false;

		// DUNGEON CLEANER
		if (this.level && this.level.ReorderRoom) {
			this.level.ReorderRoom();
		}
	}
}

Animator.prototype.Display = function () {
	if (!this.isDisplayed) {
		this.container.addChild(this.currentAnimation);
		this.isDisplayed = true;

		// DUNGEON CLEANER
		if (this.level && this.level.ReorderRoom) {
			this.level.ReorderRoom();
		}
	}
}

Animator.prototype.UpdateAnim = function (animation, mirror) {
	if (this.animations[this.currentState] && this.animations[this.currentState][animation]) {
		if (this.animations[this.currentState][animation] !== this.currentAnimation || mirror !== this.mirrored) {
			if (this.isDisplayed) {
				this.container.removeChild(this.currentAnimation);
			}

			this.currentAnimation = this.animations[this.currentState][animation];
			this.currentAnimationName = animation;
			this.currentAnimation.position = new PIXI.Point(this.x + this.currentAnimation.width / 2, this.y + this.currentAnimation.height / 2);

			this.MirrorAnim(mirror);

			this.currentAnimation.play();

			if (this.isDisplayed) {
				this.container.addChild(this.currentAnimation);
			}
		}
	}
}

Animator.prototype.SwitchToAnim = function (animation, mirror) {
	mirror = !(!mirror);

	this.UpdateAnim(animation, mirror);
}

Animator.prototype.MirrorAnim = function (mirror) {
	mirror = !(!mirror);

	if (mirror) {
		if (!this.mirrored) {
			this.x += this.currentAnimation.width;
		}

		this.currentAnimation.scale.x = -1
	} else {
		if (this.mirrored) {
			this.x -= this.currentAnimation.width;
		}

		this.currentAnimation.scale.x = 1;
	}

	this.mirrored = mirror;
}

Animator.prototype.Erase = function () {
	if (this.currentAnimation) {
		this.container.removeChild(this.currentAnimation);		
	}
}

Animator.prototype.Tick = function () {
	if (this.listeners.endAnimation && this.listeners.endAnimation.length) {
		if (!this.currentAnimation.playing) {
			this.listeners.endAnimation.forEach(function (callback) {
				callback.func.call(callback.object);
			});

			delete this.listeners.endAnimation;
		}
	}
}