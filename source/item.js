function Item(x, y, name, level) {
	Animator.call(this, x, y, level.dynamic);

	this.states = {
		broken : 'broken',
		clearing : 'clearing',
		cleared : 'cleared',
		fixed : 'fixed'
	}

	this.state = this.states.fixed;
	this.name = name;
	this.type = 'item';
	this.level = level;

	this.duration = {
		pot : 1
	}

	this.place = new Timer(this.duration[name]);

	load.json('animations/items/' + name + '.json', this.Init, this);
	this.InitItem();
}

Item.prototype = Object.create(Animator.prototype);
Item.prototype.constructor = Item;

Item.prototype.InitItem = function () {
	this.place.on('end', this.placed, this);
}

Item.prototype.placed = function () {
	this.state = this.states.fixed;

	if (this.listeners['placed']) {
		this.listeners['placed'].forEach(function (callback) {
			callback.func.call(callback.object);
		}, this);
	}

	this.listeners['placed'] = [];

	this.SwitchToAnim(this.state);
}

Item.prototype.Break = function () {
	if (this.state === this.states.broken) {
		console.log('Item is already broken');
		return false;
	}

	this.state = this.states.broken;
	this.SwitchToAnim(this.state);

	return true;
}

Item.prototype.Fetch = function () {
	return false;
}

Item.prototype.Place = function () {
	if (this.state !== this.states.fixed) {
		console.log('Item is not ready');
		return false;
	}

	this.place.Start();
	this.SwitchToAnim(this.state);

	return true;
}

Item.prototype.Fix = function () {
	if (this.state !== this.states.cleared) {
		console.log('Item is not cleared yet');
		return false;
	}

	this.state = this.states.fixed;
	this.SwitchToAnim(this.state);

	return true;
}

Item.prototype.Clone = function () {
	return new Item(this.x, this.y, this.name, this.level);
}

Item.prototype.Tick = function (length) {
	this.place.Tick(length);
}