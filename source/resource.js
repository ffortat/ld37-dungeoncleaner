function Resource(x, y, name, level) {
	Animator.call(this, x, y, level.dynamic);

	this.duration = 5;
	this.amount = 0;
	this.states = {
		broken : 'broken',
		clearing : 'clearing',
		cleared : 'cleared',
		fixed : 'fixed'
	}

	this.state = this.states.broken;
	this.name = name;
	this.level = level;

	this.timer = 0;

	load.json('animations/resources/' + name + '.json', this.Init, this);
	this.InitResource();
}

Resource.prototype = Object.create(Animator.prototype);
Resource.prototype.constructor = Resource;

Resource.prototype.InitResource = function () {
	switch (this.name) {
		case 'pots':
			this.amount = 3;
			break;
		case 'bones':
			this.amount = 4;
			break;
		case 'skulls':
		case 'ribs':
		default:
			this.amount = 1;
			break;
	}
}

Resource.prototype.cleared = function () {
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

Resource.prototype.Break = function () {
	if (this.state === this.states.broken) {
		console.log('Resource is already broken');
		return false;
	}

	this.state = this.states.broken;
	this.SwitchToAnim(this.state);

	return true;
}

Resource.prototype.Fetch = function () {
	if (this.state !== this.states.broken) {
		console.log('Resource is already in state', this.state);
		return false;
	}

	this.state = this.states.clearing;
	this.timer = this.duration;
	this.SwitchToAnim(this.state);

	return true;
}

Resource.prototype.Fix = function () {
	if (this.state !== this.states.cleared) {
		console.log('Resource is not cleared yet');
		return false;
	}

	this.state = this.states.fixed;
	this.SwitchToAnim(this.state);

	return true;
}

Resource.prototype.Tick = function (length) {
	if (this.timer) {
		this.timer -= length;

		if (this.timer <= 0) {
			this.timer = 0;
			this.cleared();
		}
	}
}