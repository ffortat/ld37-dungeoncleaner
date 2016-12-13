function Monster(x, y, name, level) {
	Animator.call(this, x, y, level.dynamic);

	this.duration = 5;
	this.states = {
		dead : 'dead',
		healing : 'healing',
		healed : 'healed',
		alive : 'alive'
	}

	this.state = this.states.alive;
	this.name = name;
	this.level = level;

	this.timer = 0;

	load.json('animations/monsters/' + name + '.json', this.Init, this);
	// load.json('items/' + name + '.json', this.InitItem, this);
}

Monster.prototype = Object.create(Animator.prototype);
Monster.prototype.constructor = Monster;

// Init.prototype.InitMonster = function (data) {

// }

Monster.prototype.healed = function () {
	this.state = this.states.healed;

	if (this.listeners['healed']) {
		this.listeners['healed'].forEach(function (callback) {
			callback.func.call(callback.object);
		}, this);
	}

	this.listeners['healed'] = [];

	this.SwitchToAnim(this.state);

	this.Hide();
	this.level.RemoveObject(this);
}

Monster.prototype.Kill = function () {
	if (this.state === this.states.dead) {
		console.log('Monster is already dead');
		return false;
	}

	this.state = this.states.dead;
	this.SwitchToAnim(this.state);

	return true;
}

Monster.prototype.Heal = function () {
	if (this.state !== this.states.dead) {
		console.log('Monster is already in state', this.state);
		return false;
	}

	this.state = this.states.clearing;
	this.timer = this.duration;
	this.SwitchToAnim(this.state);

	return true;
}

Monster.prototype.Respawn = function () {
	if (this.state !== this.states.healed) {
		console.log('Monster is not healed yet');
		return false;
	}

	this.state = this.states.alive;
	this.SwitchToAnim(this.state);

	return true;
}

Monster.prototype.Tick = function (length) {
	if (this.timer) {
		this.timer -= length;

		if (this.timer <= 0) {
			this.timer = 0;
			this.healed();
		}
	}
}