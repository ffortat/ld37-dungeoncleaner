function Healer(x, y, level) {
	Animator.call(this, x, y, level.dynamic);

	this.level = level;
	this.target = null;

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

		this.MoveTo(target.x, target.y);

		this.SwitchToAnim('heal');

		target.on('healed', this.Leave, this);
	}
}

Healer.prototype.Leave = function () {
	this.Hide();
	level.RemoveObject(this);
}

