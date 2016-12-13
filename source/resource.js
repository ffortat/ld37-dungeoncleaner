function Resource(x, y, name, level) {
	Animator.call(this, x, y, level.dynamic);

	this.states = {
		broken : 'broken',
		clearing : 'clearing',
		cleared : 'cleared',
		fixed : 'fixed'
	}

	this.state = this.states.broken;
	this.name = name;
	this.level = level;

	this.amounts = {
		pots : 3,
		bones : 4,
		ribs : 2,
		skulls : 1
	}
	this.duration = {
		pots : 2,
		bones : 3,
		ribs : 3,
		skulls : 2
	}

	this.clear = new Timer(this.duration[name]);
	this.amount = this.amounts[name];

	load.json('animations/resources/' + name + '.json', this.Init, this);
	this.InitResource();
}

Resource.prototype = Object.create(Animator.prototype);
Resource.prototype.constructor = Resource;

Resource.prototype.InitResource = function () {
	this.clear.on('end', this.cleared, this);
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
	this.clear.Start();
	// this.SwitchToAnim(this.state);
	// hack
	this.Hide();

	return true;
}

Resource.prototype.Place = function () {
	return false;
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
	this.clear.Tick(length);
}