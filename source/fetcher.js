function Fetcher(x, y, level) {
	Animator.call(this, x, y, level.dynamic);

	this.level = level;
	this.target = null;

	load.json('animations/fetcher.json', this.Init, this);
}

Fetcher.prototype = Object.create(Animator.prototype);
Fetcher.prototype.constructor = Fetcher;

Fetcher.prototype.CanAct = function (target) {
	return !(!target.Fetch);
}

Fetcher.prototype.Act = function (target) {
	if (!target.Fetch) {
		console.log('Target has no fetch function');
		return;
	}

	if (target.Fetch()) {
		this.target = target;

		this.MoveTo(target.x, target.y);

		this.SwitchToAnim('fetch');

		target.on('cleared', this.Leave, this);
	}
}

Fetcher.prototype.Place = function (target) {
	this.target = target;
	
	this.MoveTo(target.x, target.y);

	this.SwitchToAnim('place');

	target.on('placed', this.Leave, this);
}

Fetcher.prototype.Leave = function () {
	this.Hide();
	level.RemoveObject(this);
}