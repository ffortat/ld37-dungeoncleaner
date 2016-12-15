function Powerup(x, y, name, level) {
	Animator.call(this, x, y, level.dynamic);

	this.type = 'powerup';
	this.name = name;
	this.level = level;

	this.duration = {
		coin : 2,
		heart : 3
	}

	this.timer = new Timer(this.duration[name]);

	load.json('animations/powerups/' + name + '.json', this.Init, this);
	this.InitPowerup();
}

Powerup.prototype = Object.create(Animator.prototype);
Powerup.prototype.constructor = Powerup;

Powerup.prototype.InitPowerup = function (data) {
	this.timer.on('end', this.placed, this);
}

Powerup.prototype.placed = function () {
	if (this.listeners['placed']) {
		this.listeners['placed'].forEach(function (callback) {
			callback.func.call(callback.object);
		}, this);
	}

	this.listeners['placed'] = [];
}

Powerup.prototype.Fetch = function () {
	return false;
}

Powerup.prototype.Place = function () {
	this.timer.Start();

	return true;
}

Powerup.prototype.Clone = function () {
	return new Powerup(this.x, this.y, this.name, this.level);
}

Powerup.prototype.Tick = function (length) {
	this.timer.Tick(length);
}