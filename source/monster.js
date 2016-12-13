function Monster(x, y, name, level) {
	Animator.call(this, x, y, level.dynamic);

	this.states = {
		dead : 'dead',
		healing : 'healing',
		healed : 'healed',
		alive : 'alive'
	}

	this.state = this.states.alive;
	this.name = name;
	this.level = level;
	console.log('set as', this.state);

	this.duration = {
		skeleton : 3,
		monster : 5
	}

	this.heal = new Timer(this.duration[name]);
	this.place = new Timer(this.duration[name]);

	load.json('animations/monsters/' + name + '.json', this.Init, this);
	this.InitMonster();
}

Monster.prototype = Object.create(Animator.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.InitMonster = function () {
	this.heal.on('end', this.healed, this);
	this.place.on('end', this.placed, this);
}

Monster.prototype.healed = function () {
	this.state = this.states.healed;

	if (this.listeners['healed']) {
		this.listeners['healed'].forEach(function (callback) {
			callback.func.call(callback.object);
		}, this);
	}

	this.listeners['healed'] = [];

	console.log('set as', this.state);
	this.SwitchToAnim(this.state);

	this.Hide();
	this.level.RemoveObject(this);
}

Monster.prototype.placed = function () {
	this.state = this.states.alive;

	if (this.listeners['placed']) {
		this.listeners['placed'].forEach(function (callback) {
			callback.func.call(callback.object);
		}, this);
	}

	this.listeners['placed'] = [];
	console.log('set as', this.state);

	this.SwitchToAnim(this.state);
}

Monster.prototype.Kill = function () {
	if (this.state === this.states.dead) {
		console.log('Monster is already dead');
		return false;
	}

	this.state = this.states.dead;
	this.SwitchToAnim(this.state);

	console.log('set as', this.state);

	return true;
}

Monster.prototype.Fetch = function () {
	return false;
}

Monster.prototype.Place = function () {
	if (this.state !== this.states.alive) {
		console.log('Monster is not ready');
		return false;
	}

	this.place.Start();
	this.SwitchToAnim(this.state);

	return true;
}

Monster.prototype.Heal = function () {
	console.log('set as', this.state);
	if (this.state !== this.states.dead) {
		console.log('Monster is already in state', this.state);
		return false;
	}

	this.state = this.states.clearing;
	this.heal.Start();
	this.SwitchToAnim(this.state);
	console.log('set as', this.state);

	return true;
}

Monster.prototype.Respawn = function () {
	if (this.state !== this.states.healed) {
		console.log('Monster is not healed yet');
		return false;
	}

	this.state = this.states.alive;
	this.SwitchToAnim(this.state);
	console.log('set as', this.state);

	return true;
}

Monster.prototype.Tick = function (length) {
	this.heal.Tick(length);
	this.place.Tick(length);
}