function Player() {
	this.Reset();
}

Player.prototype.Reset = function () {
	this.score = 0;
	this.multiplier = 1;
	this.scoreDetail = {
		clean : false,
		timeLeft : 0,
		powerups : 0
	};

	this.fetcher = 0;
	this.cleaner = 0;
	this.healer = 0;

	this.pot = 0;
	this.skeleton = 0;
	this.monster = 0;
	this.coin = 0;
	this.heart = 0;

	this.pots = 0;
	this.skulls = 0;
	this.ribs = 0;
	this.bones = 0;

	this.room = [[], []];
}

Player.prototype.Update = function (level) {
	this.score = level.score;
	this.multiplier = level.multiplier;
	this.scoreDetail.clean = level.IsClean();
	this.scoreDetail.timeLeft = level.timer;
	this.scoreDetail.powerups = level.powerupCount;

	this.fetcher = level.workers.fetcher;
	this.cleaner = level.workers.cleaner;
	this.healer = level.workers.healer;

	this.pot = level.stuff.pot;
	this.skeleton = level.stuff.skeleton;
	this.monster = level.stuff.monster;
	this.coin = level.stuff.coin;
	this.heart = level.stuff.heart;

	this.pots = level.resources.pots;
	this.skulls = level.resources.skulls;
	this.ribs = level.resources.ribs;
	this.bones = level.resources.bones;

	level.room.forEach(function (item, index) {
		this.room[index] = item;
	}, this);
}

Player.prototype.Setup = function (level) {
	level.score = this.score;
	level.multiplier = this.multiplier;

	level.workers.fetcher = this.fetcher;
	level.workers.cleaner = this.cleaner;
	level.workers.healer = this.healer;

	level.stuff.pot = this.pot;
	level.stuff.skeleton = this.skeleton;
	level.stuff.monster = this.monster;
	level.stuff.coin = this.coin;
	level.stuff.heart = this.heart;

	level.resources.pots = this.pots;
	level.resources.skulls = this.skulls;
	level.resources.ribs = this.ribs;
	level.resources.bones = this.bones;

	this.room.forEach(function (item, index) {
		level.room[index] = item;
	}, this);
}