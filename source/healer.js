function Healer(x, y, level) {
	Animator.call(this, x, y, level.dynamic);

	this.level = level;
	this.target = null;
	this.type = 'healer';

	load.json('animations/healer.json', this.Init, this);
}

Healer.prototype = Object.create(Animator.prototype);
Healer.prototype.constructor = Healer;

Healer.prototype.CanAct = function (target) {
	return !(!target.Heal);
}

Healer.prototype.Act = function (target) {
	if (!target.Heal) {
		console.log('Target has no heal function');
		return;
	}

	if (target.Heal()) {
		this.target = target;

		var x = Math.floor((target.x + target.width / 2) / 64) * 64
		var y = Math.floor((target.y + target.height - 64) / 64) * 64
		x = x - (this.width - this.level.tile.width) / 2;
		y = y - (this.height - this.level.tile.height);
		
		this.MoveTo(x, y);

		this.SwitchToAnim('heal');

		target.on('healed', this.Leave, this);
	}
}

Healer.prototype.Leave = function () {
	this.Hide();
	this.level.RemoveWorker(this);
}

