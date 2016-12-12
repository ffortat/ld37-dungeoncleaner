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

		var x = Math.floor((target.x + target.width / 2))
		var y = Math.floor((target.y + target.height / 2))
		x = x - this.width / 2;
		y = y - (this.height - this.level.tile.height) - this.level.tile.height / 2;
		
		this.MoveTo(x, y);

		this.SwitchToAnim('clean');

		target.on('cleared', this.Leave, this);
	}
}

Cleaner.prototype.Leave = function () {
	this.Hide();
	this.level.RemoveWorker(this);
}