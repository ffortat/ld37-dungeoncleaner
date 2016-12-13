// TODO : add parameters in json for skip/next

function TextBox(container, data) {
	this.parent = container;

	this.font = parameters.textbox.font;
	this.fontsize = parameters.textbox.fontsize;
	this.fontcolor = parameters.textbox.fontcolor;
	this.backgroundcolor = parameters.textbox.backgroundcolor;
	this.bordercolor = parameters.textbox.bordercolor;
	this.bordersize = parameters.textbox.bordersize;
	this.roundness = parameters.textbox.roundness;
	this.dimensions = {
		x : parameters.textbox.dimensions.x,
		y : parameters.textbox.dimensions.y,
		width : parameters.textbox.dimensions.width,
		height : parameters.textbox.dimensions.height
	}
	this.characterdimensions = {
		width : parameters.textbox.characterdimensions.width,
		height : parameters.textbox.characterdimensions.height,
		over : parameters.textbox.characterdimensions.over
	}

	this.rectangle = new PIXI.Graphics();
	this.identities = {};
	this.container = new PIXI.Container();
	this.skip = null;

	this.pages = [];
	this.index = 0;

	this.listener = function () {};

	this.listeners = {
		end : []
	}

	this.Init(data);
}

TextBox.prototype.Init = function (data) {
	var self = this;

	this.rectangle.beginFill(this.backgroundcolor, 1);
	this.rectangle.lineStyle(this.bordersize, this.bordercolor, 1);
	this.rectangle.drawRoundedRect(this.dimensions.x, this.dimensions.y, this.dimensions.width, this.dimensions.height, this.roundness);

	this.container.addChild(this.rectangle);

	data.text.forEach(function (page) {
		var text = new PIXI.Text(page[1], {fontFamily : this.font, fontSize: this.fontsize, fill : this.fontcolor, wordWrap : true, wordWrapWidth : this.dimensions.width - 20});
		// text.position = new PIXI.Point(this.dimensions.x + 10, this.dimensions.y + 10);
		// center manually
		text.position = new PIXI.Point(this.dimensions.x + (this.dimensions.width - text.width) / 2, this.dimensions.y + (this.dimensions.height - text.height) / 2);
		this.pages.push([page[0], text]);
	}, this);

	if (data.characters) {
		data.characters.forEach(function (character) {
			var identity = new PIXI.Container();
			var nametag = new PIXI.Graphics();
			var text = new PIXI.Text(character.name, {fontFamily : this.font, fontSize: this.fontsize, fill : this.fontcolor});
			var side = character.side ? character.side : 'left';
			var portrait;

			var height = 30
			var x = side === 'left' ? this.dimensions.x + 5 : this.dimensions.x + this.dimensions.width - 5 - (text.width + 10);
			var y = this.characterdimensions.over ? this.dimensions.y + 5 - height : this.dimensions.y + this.dimensions.height - 5;

			nametag.beginFill(this.backgroundcolor, 1);
			nametag.lineStyle(this.bordersize, this.bordercolor, 1);
			nametag.drawRoundedRect(x, y, text.width + 10, height, this.roundness);

			text.position = new PIXI.Point(x + 5, y + 5);

			if (character.image) {
				portrait = PIXI.Sprite.fromImage('textures/Characters/' + character.image);
				
				// to generalize
				if (side === 'left') {
					portrait.scale = new PIXI.Point(0.75,0.75);
				} else {
					portrait.scale = new PIXI.Point(-0.75,0.75);
				}

				if (this.characterdimensions.over) {
					y -= this.characterdimensions.height;
				}

				portrait.position = new PIXI.Point(x, y);

				identity.addChild(portrait);
			}

			identity.addChild(nametag);
			identity.addChild(text);

			this.identities[character.id] = identity;
		}, this);
	}

	if (this.pages.length > 200) {
		var skip = new PIXI.Graphics();
		var text = new PIXI.Text('Skip', {fontFamily : this.font, fontSize: this.fontsize, fill : this.fontcolor});

		var height = 30
		var x = this.dimensions.x + this.dimensions.width + 5 - text.width - 10;
		var y = this.characterdimensions.over ? this.dimensions.y + this.dimensions.height - 15 : this.dimensions.y + 15 - height;

		skip.beginFill(this.backgroundcolor, 1);
		skip.lineStyle(this.bordersize, this.bordercolor, 1);
		skip.drawRoundedRect(x, y, text.width + 10, height, this.roundness);

		this.skip = new PIXI.Rectangle(x, y, text.width + 10, height);

		text.position = new PIXI.Point(x + 5, y + 5);

		this.container.addChild(skip);
		this.container.addChild(text);
	}

	this.listener = function (event) {
		if (event.button === 0) {
			if (self.skip && self.skip.contains(mouse.x, mouse.y)) {
				self.end();
			} else {
				if (self.index < self.pages.length - 1) {
					self.NextPage();
				} else if (self.index < self.pages.length) {
					self.end();
				}
			}

		} else if (event.button === 2) {
			if (self.index > 0) {
				self.PreviousPage();
			}
		}
	};
}

TextBox.prototype.on = function (eventType, callback, self) {
	if (this.listeners[eventType]) {
		this.listeners[eventType].push({func : callback, object : self});
	}
}

TextBox.prototype.off = function (eventType, callback) {
	if (this.listeners[eventType]) {
		var indexes = [];
	
		this.listeners[eventType].forEach(function (listener, index) {
			if (listener.func === callback) {
				indexes.unshift(index);
			}
		}, this);

		indexes.forEach(function (index) {
			this.listeners[eventType].splice(index, 1);
		}, this);
	}
}

TextBox.prototype.end = function () {
	if (this.listeners.end.length) {
		this.listeners.end.forEach(function (callback) {
			callback.func.call(callback.object);
		});
	} else {
		this.Hide();
	}
}

TextBox.prototype.Reset = function () {
	this.index = 0;

	if (this.pages.length) {
		this.container.addChild(this.pages[this.index][1]);
		if (this.pages[this.index][0]) {
			this.container.addChild(this.identities[this.pages[this.index][0]]);
		}
	}
}

TextBox.prototype.NextPage = function () {
	if (this.pages[this.index][0]) {
		this.container.removeChild(this.identities[this.pages[this.index][0]]);
	}
	this.container.removeChild(this.pages[this.index][1]);
	this.index += 1;
	this.container.addChild(this.pages[this.index][1])
	if (this.pages[this.index][0]) {
		this.container.addChild(this.identities[this.pages[this.index][0]]);
	}
}

TextBox.prototype.PreviousPage = function () {
	if (this.pages[this.index][0]) {
		this.container.removeChild(this.identities[this.pages[this.index][0]]);
	}
	this.container.removeChild(this.pages[this.index][1]);
	this.index -= 1;
	this.container.addChild(this.pages[this.index][1]);
	if (this.pages[this.index][0]) {
		this.container.addChild(this.identities[this.pages[this.index][0]]);
	}
}

TextBox.prototype.Unlock = function () {
	mouse.on('click', this.listener, this);
}

TextBox.prototype.Lock = function () {
	mouse.off('click', this.listener);
}

TextBox.prototype.Hide = function () {
	this.Lock();
	this.parent.removeChild(this.container);
	this.container.removeChild(this.pages[this.index][1]);
	if (this.pages[this.index][0]) {
		this.container.removeChild(this.identities[this.pages[this.index][0]]);
	}
}

TextBox.prototype.Display = function () {
	this.Reset();
	this.parent.addChild(this.container);
	this.Unlock();
}