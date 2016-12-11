function GUI(level) {
	this.level = level;
	this.container = new PIXI.Container();
	this.backgrounds = new PIXI.Graphics();

	this.isDisplayed = false;

	this.timer = {};
	this.buttons = {
		fetcher : {},
		cleaner : {},
		healer : {},
		pot : {},
		skeleton : {},
		monster : {},
		coin : {},
		heart : {},
		end : {}
	}
	this.resources = {
		pots : {},
		skulls : {},
		ribs : {},
		bones : {}
	}
	this.objectives = [];
	this.score = {};

	this.Init();
}

GUI.prototype.Init = function () {
	this.backgrounds.beginFill(0xCC3333, 1)

	this.buttons.fetcher.sprite = PIXI.Sprite.fromImage('textures/crate.png');
	this.buttons.fetcher.sprite.position = new PIXI.Point(0, 52);
	this.buttons.fetcher.collider = new PIXI.Rectangle(this.buttons.fetcher.sprite.x, this.buttons.fetcher.sprite.y, this.buttons.fetcher.sprite.width, this.buttons.fetcher.sprite.height);
	this.buttons.fetcher.counter = new PIXI.Text('0', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xEEEEEE});
	this.buttons.fetcher.counter.position = new PIXI.Point(this.buttons.fetcher.sprite.x + this.buttons.fetcher.sprite.width - 5 - this.buttons.fetcher.counter.width, this.buttons.fetcher.sprite.y + this.buttons.fetcher.sprite.height - 5 - this.buttons.fetcher.counter.height);
	this.backgrounds.drawRoundedRect(this.buttons.fetcher.counter.x - 5, this.buttons.fetcher.counter.y - 2, this.buttons.fetcher.counter.width + 10, this.buttons.fetcher.counter.height + 4, 5);
	
	this.buttons.cleaner.sprite = PIXI.Sprite.fromImage('textures/broomstick.png');
	this.buttons.cleaner.sprite.position = new PIXI.Point(0, 180);
	this.buttons.cleaner.collider = new PIXI.Rectangle(this.buttons.cleaner.sprite.x, this.buttons.cleaner.sprite.y, this.buttons.cleaner.sprite.width, this.buttons.cleaner.sprite.height);
	this.buttons.cleaner.counter = new PIXI.Text('0', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xEEEEEE});
	this.buttons.cleaner.counter.position = new PIXI.Point(this.buttons.cleaner.sprite.x + this.buttons.cleaner.sprite.width - 5 - this.buttons.cleaner.counter.width, this.buttons.cleaner.sprite.y + this.buttons.cleaner.sprite.height - 5 - this.buttons.cleaner.counter.height);
	this.backgrounds.drawRoundedRect(this.buttons.cleaner.counter.x - 5, this.buttons.cleaner.counter.y - 2, this.buttons.cleaner.counter.width + 10, this.buttons.cleaner.counter.height + 4, 5);
	
	this.buttons.healer.sprite = PIXI.Sprite.fromImage('textures/redcross.png');
	this.buttons.healer.sprite.position = new PIXI.Point(0, 308);
	this.buttons.healer.collider = new PIXI.Rectangle(this.buttons.healer.sprite.x, this.buttons.healer.sprite.y, this.buttons.healer.sprite.width, this.buttons.healer.sprite.height);
	this.buttons.healer.counter = new PIXI.Text('0', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xEEEEEE});
	this.buttons.healer.counter.position = new PIXI.Point(this.buttons.healer.sprite.x + this.buttons.healer.sprite.width - 5 - this.buttons.healer.counter.width, this.buttons.healer.sprite.y + this.buttons.healer.sprite.height - 5 - this.buttons.healer.counter.height);
	this.backgrounds.drawRoundedRect(this.buttons.healer.counter.x - 5, this.buttons.healer.counter.y - 2, this.buttons.healer.counter.width + 10, this.buttons.healer.counter.height + 4, 5);

	this.buttons.pot.sprite = PIXI.Sprite.fromImage('textures/poticon.png');
	this.buttons.pot.sprite.position = new PIXI.Point(renderer.width - this.buttons.pot.sprite.width, 52);
	this.buttons.pot.collider = new PIXI.Rectangle(this.buttons.pot.sprite.x, this.buttons.pot.sprite.y, this.buttons.pot.sprite.width, this.buttons.pot.sprite.height);

	this.buttons.skeleton.sprite = PIXI.Sprite.fromImage('textures/skeletonicon.png');
	this.buttons.skeleton.sprite.position = new PIXI.Point(renderer.width - this.buttons.skeleton.sprite.width, 180);
	this.buttons.skeleton.collider = new PIXI.Rectangle(this.buttons.skeleton.sprite.x, this.buttons.skeleton.sprite.y, this.buttons.skeleton.sprite.width, this.buttons.skeleton.sprite.height);

	this.buttons.monster.sprite = PIXI.Sprite.fromImage('textures/monstericon.png');
	this.buttons.monster.sprite.position = new PIXI.Point(renderer.width - this.buttons.monster.sprite.width, 308);
	this.buttons.monster.collider = new PIXI.Rectangle(this.buttons.monster.sprite.x, this.buttons.monster.sprite.y, this.buttons.monster.sprite.width, this.buttons.monster.sprite.height);

	this.buttons.coin.sprite = PIXI.Sprite.fromImage('textures/coinicon.png');
	this.buttons.coin.sprite.position = new PIXI.Point(renderer.width - this.buttons.coin.sprite.width, 436);
	this.buttons.coin.collider = new PIXI.Rectangle(this.buttons.coin.sprite.x, this.buttons.coin.sprite.y, this.buttons.coin.sprite.width, this.buttons.coin.sprite.height);

	this.buttons.heart.sprite = PIXI.Sprite.fromImage('textures/hearticon.png');
	this.buttons.heart.sprite.position = new PIXI.Point(renderer.width - this.buttons.heart.sprite.width, 564);
	this.buttons.heart.collider = new PIXI.Rectangle(this.buttons.heart.sprite.x, this.buttons.heart.sprite.y, this.buttons.heart.sprite.width, this.buttons.heart.sprite.height);
	
	this.buttons.end = new Button('End', 5, renderer.height - 64 - 5, 128, 64);

	this.resources.pots.sprite = PIXI.Sprite.fromImage('textures/pots.png');
	this.resources.pots.sprite.position = new PIXI.Point(0, 436);
	this.resources.pots.counter = new PIXI.Text('0', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xEEEEEE});
	this.resources.pots.counter.position = new PIXI.Point(this.resources.pots.sprite.x + this.resources.pots.sprite.width, this.resources.pots.sprite.y + this.resources.pots.sprite.height - 5 - this.resources.pots.counter.height);
	this.backgrounds.drawRoundedRect(this.resources.pots.counter.x - 5, this.resources.pots.counter.y - 2, this.resources.pots.counter.width + 10, this.resources.pots.counter.height + 4, 5);

	this.resources.skulls.sprite = PIXI.Sprite.fromImage('textures/skulls.png');
	this.resources.skulls.sprite.position = new PIXI.Point(0, 472);
	this.resources.skulls.counter = new PIXI.Text('0', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xEEEEEE});
	this.resources.skulls.counter.position = new PIXI.Point(this.resources.skulls.sprite.x + this.resources.skulls.sprite.width, this.resources.skulls.sprite.y + this.resources.skulls.sprite.height - 5 - this.resources.skulls.counter.height);
	this.backgrounds.drawRoundedRect(this.resources.skulls.counter.x - 5, this.resources.skulls.counter.y - 2, this.resources.skulls.counter.width + 10, this.resources.skulls.counter.height + 4, 5);

	this.resources.ribs.sprite = PIXI.Sprite.fromImage('textures/ribs.png');
	this.resources.ribs.sprite.position = new PIXI.Point(0, 508);
	this.resources.ribs.counter = new PIXI.Text('0', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xEEEEEE});
	this.resources.ribs.counter.position = new PIXI.Point(this.resources.ribs.sprite.x + this.resources.ribs.sprite.width, this.resources.ribs.sprite.y + this.resources.ribs.sprite.height - 5 - this.resources.ribs.counter.height);
	this.backgrounds.drawRoundedRect(this.resources.ribs.counter.x - 5, this.resources.ribs.counter.y - 2, this.resources.ribs.counter.width + 10, this.resources.ribs.counter.height + 4, 5);

	this.resources.bones.sprite = PIXI.Sprite.fromImage('textures/bones.png');
	this.resources.bones.sprite.position = new PIXI.Point(0, 544);
	this.resources.bones.counter = new PIXI.Text('0', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xEEEEEE});
	this.resources.bones.counter.position = new PIXI.Point(this.resources.bones.sprite.x + this.resources.bones.sprite.width, this.resources.bones.sprite.y + this.resources.bones.sprite.height - 5 - this.resources.bones.counter.height);
	this.backgrounds.drawRoundedRect(this.resources.bones.counter.x - 5, this.resources.bones.counter.y - 2, this.resources.bones.counter.width + 10, this.resources.bones.counter.height + 4, 5);

	this.container.addChild(this.buttons.fetcher.sprite);
	this.container.addChild(this.buttons.cleaner.sprite);
	this.container.addChild(this.buttons.healer.sprite);
	this.container.addChild(this.buttons.pot.sprite);
	this.container.addChild(this.buttons.skeleton.sprite);
	this.container.addChild(this.buttons.monster.sprite);
	this.container.addChild(this.buttons.coin.sprite);
	this.container.addChild(this.buttons.heart.sprite);
	this.buttons.end.AddTo(this.container);

	this.container.addChild(this.resources.pots.sprite);
	this.container.addChild(this.resources.skulls.sprite);
	this.container.addChild(this.resources.ribs.sprite);
	this.container.addChild(this.resources.bones.sprite);

	this.container.addChild(this.backgrounds);

	this.container.addChild(this.buttons.fetcher.counter);
	this.container.addChild(this.buttons.cleaner.counter);
	this.container.addChild(this.buttons.healer.counter);

	this.container.addChild(this.resources.pots.counter);
	this.container.addChild(this.resources.skulls.counter);
	this.container.addChild(this.resources.ribs.counter);
	this.container.addChild(this.resources.bones.counter);

	this.timer.counter = new PIXI.Text('00:00', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xEEEEEE});
	this.timer.counter.position = new PIXI.Point(1024, 16);

	this.score.counter = new PIXI.Text('0', {fontFamily : 'Arial', fontSize: 24, fontWeight : 'bold', fill : 0xEEEEEE});
	this.score.counter.position = new PIXI.Point((renderer.width - this.score.counter.width) / 2, 16);
	this.score.multiplier = new PIXI.Text('', {fontFamily : 'Arial', fontSize: 14, fontWeight : 'bold', fill : 0xEEEEEE});
	this.score.multiplier.position = new PIXI.Point((renderer.width - this.score.multiplier.width) / 2, 16 + this.score.counter.height + 8);

	this.level.objectives.forEach(function (objective, index) {
		this.objectives.push(new PIXI.Text('', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xEEEEEE}));
		this.objectives[index].position = new PIXI.Point(192, 8 + 20 * index);
		this.container.addChild(this.objectives[index]);
	}, this);

	this.container.addChild(this.timer.counter);
	this.container.addChild(this.score.counter);
	this.container.addChild(this.score.multiplier);

	this.level.on('update', this.Update, this);

	this.Display();
}

GUI.prototype.Update = function () {
	this.buttons.fetcher.counter.text = '' + this.level.workers.fetcher;
	this.buttons.cleaner.counter.text = '' + this.level.workers.cleaner;
	this.buttons.healer.counter.text = '' + this.level.workers.healer;

	this.resources.pots.counter.text = '' + this.level.resources.pots;
	this.resources.skulls.counter.text = '' + this.level.resources.skulls;
	this.resources.ribs.counter.text = '' + this.level.resources.ribs;
	this.resources.bones.counter.text = '' + this.level.resources.bones;

	this.score.counter.text = '' + this.level.score;
	this.score.counter.position = new PIXI.Point((renderer.width - this.score.counter.width) / 2, 16);
	this.score.multiplier.text = this.level.multiplier > 1 ? 'x' + this.level.multiplier : '';

	this.objectives.forEach(function (objective, index) {
		var count = Math.max(0, this.level.objectives[index].limit - this.level.objectives[index].count);
		objective.text = 'Place ' + count + ' ' + this.level.objectives[index].type + ' in the room.';
	}, this);
}

GUI.prototype.Click = function () {
	if (!this.level.paused) {
		if (this.buttons.fetcher.collider.contains(mouse.x, mouse.y)) {
			this.level.Prepare('fetcher');
		}
		
		if (this.buttons.cleaner.collider.contains(mouse.x, mouse.y)) {
			this.level.Prepare('cleaner');
		}

		if (this.buttons.healer.collider.contains(mouse.x, mouse.y)) {
			this.level.Prepare('healer');
		}

		if (this.buttons.pot.collider.contains(mouse.x, mouse.y)) {
			this.level.Prepare('item', 'pot');
		}

		if (this.buttons.skeleton.collider.contains(mouse.x, mouse.y)) {
			this.level.Prepare('monster', 'skeleton');
		}

		if (this.buttons.monster.collider.contains(mouse.x, mouse.y)) {
			this.level.Prepare('monster', 'monster');
		}

		if (this.buttons.coin.collider.contains(mouse.x, mouse.y)) {
			this.level.Prepare('powerup', 'coin');
		}

		if (this.buttons.heart.collider.contains(mouse.x, mouse.y)) {
			this.level.Prepare('powerup', 'heart');
		}

		if (this.buttons.end.collider.contains(mouse.x, mouse.y)) {
			this.level.EndLevel();
		}
	}
}

GUI.prototype.Lock = function () {
	mouse.off('click', this.Click);
}

GUI.prototype.Unlock = function () {
	mouse.on('click', this.Click, this);
}

GUI.prototype.Hide = function () {
	this.Lock();
	this.level.gui.removeChild(this.container);
	this.isDisplayed = false;
}

GUI.prototype.Display = function () {
	this.level.gui.addChild(this.container);
	this.Unlock();
	this.isDisplayed = true;
}

GUI.prototype.SecondsToDisplay = function (seconds) {
	var minutes = Math.floor(seconds / 60);
	seconds = Math.floor(seconds % 60);

	return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

GUI.prototype.Tick = function (length) {
	this.timer.counter.text = this.SecondsToDisplay(this.level.timer);
}