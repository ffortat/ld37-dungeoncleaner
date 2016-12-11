function Cleaner(x, y, level) {
	Animator.call(this, x, y, level.dynamic);

	this.level = level;
	this.target = null;
	this.type = 'cleaner';

	load.json('animations/cleaner.json', this.Init, this);
}

Cleaner.prototype = Object.create(Animator.prototype);
Cleaner.prototype.constructor = Cleaner;

Cleaner.prototype.CanAct = function (target) {
	return !(!target.Clean);
}

Cleaner.prototype.Act = function (target) {
	if (!target.Clean) {
		console.log('Target has no clean function');
		return;
	}

	if (target.Clean()) {
		this.target = target;

		this.MoveTo(target.x, target.y);

		this.SwitchToAnim('clean');

		target.on('cleared', this.Leave, this);
	}
}

Cleaner.prototype.Leave = function () {
	this.Hide();
	this.level.RemoveWorker(this);
}