function ScoreTable(player, level, renderer) {
	this.renderer = renderer;

	this.player = player
	this.level = level;

	this.score = 0;
	this.bonus = {
		base : 0,
		clean : 0,
		time : 0,
		powerup : 0,
		multiplier : 0
	};

	this.values = {
		score : {
			base : 2500,
			clean : 1500,
			powerup : 500,
			time : 75
		}
	}

	this.animate = null;
	this.container = new PIXI.Container();
	this.texts = [];

	this.loaded = true;

	this.Init();
}

ScoreTable.prototype.Init = function () {
	this.score = this.player.score;

	this.bonus.base = this.values.score.base;
	this.bonus.clean = this.player.scoreDetail.clean ? this.values.score.clean : 0;
	this.bonus.time = Math.floor(this.values.score.time * this.player.scoreDetail.timeLeft);
	this.bonus.powerup = this.player.scoreDetail.powerups * this.values.score.powerup;

	this.bonus.multiplier = this.player.multiplier;

	this.player.score += this.bonus.base * this.bonus.multiplier;
	this.player.score += this.bonus.clean * this.bonus.multiplier;
	this.player.score += this.bonus.time * this.bonus.multiplier;
	this.player.score += this.bonus.powerup * this.bonus.multiplier;
	this.player.multiplier += 1;

	var text;
	this.texts[0] = new PIXI.Container();
	text = new PIXI.Text('Initial Score:', {fontFamily : 'Arial', fontSize: 32, fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 - text.width, 100);
	this.texts[0].addChild(text);
	text = new PIXI.Text('' + this.score, {fontFamily : 'Arial', fontSize: 32, fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 + 8, 100);
	this.texts[0].addChild(text);

	this.texts[1] = new PIXI.Container();
	text = new PIXI.Text('Level Completion:', {fontFamily : 'Arial', fontSize: 32, fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 - text.width, 200);
	this.texts[1].addChild(text);
	text = new PIXI.Text('' + this.bonus.base, {fontFamily : 'Arial', fontSize: 32, fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 + 8, 200);
	this.texts[1].addChild(text);

	this.texts[2] = new PIXI.Container();
	text = new PIXI.Text('Clean Bonus:', {fontFamily : 'Arial', fontSize: 32, fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 - text.width, 260);
	this.texts[2].addChild(text);
	text = new PIXI.Text('' + this.bonus.clean, {fontFamily : 'Arial', fontSize: 32, fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 + 8, 260);
	this.texts[2].addChild(text);

	this.texts[3] = new PIXI.Container();
	text = new PIXI.Text('Powerups Bonus:', {fontFamily : 'Arial', fontSize: 32, fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 - text.width, 320);
	this.texts[3].addChild(text);
	text = new PIXI.Text('' + this.bonus.powerup, {fontFamily : 'Arial', fontSize: 32, fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 + 8, 320);
	this.texts[3].addChild(text);

	this.texts[4] = new PIXI.Container();
	text = new PIXI.Text('Time Bonus:', {fontFamily : 'Arial', fontSize: 32, fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 - text.width, 380);
	this.texts[4].addChild(text);
	text = new PIXI.Text('' + this.bonus.time, {fontFamily : 'Arial', fontSize: 32, fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 + 8, 380);
	this.texts[4].addChild(text);

	this.texts[5] = new PIXI.Container();
	text = new PIXI.Text('x' + this.bonus.multiplier, {fontFamily : 'Arial', fontSize: 192, fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 + 300, 200);
	this.texts[5].addChild(text);

	this.texts[6] = new PIXI.Container();
	text = new PIXI.Text('New Score:', {fontFamily : 'Arial', fontSize: 48, fontWeight : 'bold', fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 - text.width, 520);
	this.texts[6].addChild(text);
	text = new PIXI.Text('' + this.player.score, {fontFamily : 'Arial', fontSize: 48, fontWeight : 'bold', fill : 0xEEEEEE});
	text.position = new PIXI.Point(this.renderer.width / 2 + 8, 520);
	this.texts[6].addChild(text);

	if (this.bonus.multiplier < 2) {
		this.texts.splice(5, 1);
	}

	this.animate = new Timer(this.texts.length, 2);
	this.animate.on('start', this.Animate, this);
	this.animate.on('tick', this.Animate, this);
	this.animate.Start();

	mouse.on('click', this.Skip, this);
}

ScoreTable.prototype.Animate = function (time) {
	if (this.texts.length) {
		this.container.addChild(this.texts.shift());
	}
}

ScoreTable.prototype.Skip = function () {
	if (this.animate.IsRunning()) {
		this.texts.forEach(function (text) {
			this.container.addChild(text);
		}, this);

		this.texts = [];

		this.animate.Stop();
	} else {
		mouse.off('click', this.Skip);
		
		currentScene = new Level(this.level + 1, this.player, this.renderer);
	}
}

ScoreTable.prototype.Tick = function (length) {
	renderer.view.style.cursor = 'pointer';
	this.animate.Tick(length);
	this.Draw();
}

ScoreTable.prototype.Draw = function () {
	if (this.loaded) {
		this.renderer.render(this.container);
	}
}