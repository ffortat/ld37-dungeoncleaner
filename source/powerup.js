function Powerup(x, y, name, level) {
	Animator.call(this, x, y, level.dynamic);

	this.name = name;
	this.level = level;

	load.json('animations/powerups/' + name + '.json', this.Init, this);
}

Powerup.prototype = Object.create(Animator.prototype);
Powerup.prototype.constructor = Powerup;

Powerup.prototype.Tick = function (length) {
}