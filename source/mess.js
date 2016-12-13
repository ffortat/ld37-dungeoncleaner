function Mess(x, y, name, level) {
	Animator.call(this, x, y, level.dynamic);

	this.states = {
		present : 'present',
		clearing : 'clearing',
		cleared : 'cleared'
	}

	this.state = this.states.present;
	this.name = name;
	this.level = level;

	this.duration = {
		blood0 : 1,
		blood1 : 2,
		blood2 : 4,
		blood4 : 8
	}

	this.clear = new Timer(this.duration[name]);

	load.json('animations/messes/' + name + '.json', this.Init, this);
	this.InitMess();
}

Mess.prototype = Object.create(Animator.prototype);
Mess.prototype.constructor = Mess;

Mess.prototype.InitMess = function () {
	this.clear.on('end', this.cleared, this);
}

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
	this.clear.Start();
	// this.SwitchToAnim(this.state);
	// hack
	this.Hide();

	return true;
}

Mess.prototype.Tick = function (length) {
	this.clear.Tick(length);
}