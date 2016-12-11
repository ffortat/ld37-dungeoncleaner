function Mess(x, y, name, level) {
	Animator.call(this, x, y, level.dynamic);

	this.duration = 5;
	this.states = {
		present : 'present',
		clearing : 'clearing',
		cleared : 'cleared'
	}

	this.state = this.states.present;
	this.name = name;
	this.level = level;

	this.timer = 0;

	load.json('animations/messes/' + name + '.json', this.Init, this);
}

Mess.prototype = Object.create(Animator.prototype);
Mess.prototype.constructor = Mess;

Mess.prototype.cleared = function () {
	this.state = this.states.cleared;

	if (this.listeners['cleared']) {
		this.listeners['cleared'].forEach(function (callback) {
			callback.func.call(callback.object);
		}, this);
	}

	this.listeners['cleared'] = [];

	this.SwitchToAnim(this.state);

	this.Hide();
	this.level.RemoveObject(this);
}

Mess.prototype.Clean = function () {
	if (this.state !== this.states.present) {
		console.log('Mess is already in state', this.state);
		return false;
	}

	this.state = this.states.clearing;
	this.timer = this.duration;
	this.SwitchToAnim(this.state);

	return true;
}

Mess.prototype.Tick = function (length) {
	if (this.timer) {
		this.timer -= length;

		if (this.timer <= 0) {
			this.timer = 0;
			this.cleared();
		}
	}
}