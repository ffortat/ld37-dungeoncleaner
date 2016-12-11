function GUI(level) {
	this.level = level;
	this.container = new PIXI.Container();

	this.isDisplayed = false;

	this.buttons = {
		cleaner : {},
		healer : {},
		crate : {},
		pot : {},
		skeleton : {},
		monster : {},
		coin : {},
		heart : {}
	}

	this.Init();
}

GUI.prototype.Init = function () {
	this.buttons.crate.sprite = PIXI.Sprite.fromImage('textures/crate.png');
	this.buttons.crate.sprite.position = new PIXI.Point(0, 52);
	this.buttons.crate.collider = new PIXI.Rectangle(this.buttons.crate.sprite.x, this.buttons.crate.sprite.y, this.buttons.crate.sprite.width, this.buttons.crate.sprite.height);
	
	this.buttons.cleaner.sprite = PIXI.Sprite.fromImage('textures/broomstick.png');
	this.buttons.cleaner.sprite.position = new PIXI.Point(0, 180);
	this.buttons.cleaner.collider = new PIXI.Rectangle(this.buttons.cleaner.sprite.x, this.buttons.cleaner.sprite.y, this.buttons.cleaner.sprite.width, this.buttons.cleaner.sprite.height);
	
	this.buttons.healer.sprite = PIXI.Sprite.fromImage('textures/redcross.png');
	this.buttons.healer.sprite.position = new PIXI.Point(0, 308);
	this.buttons.healer.collider = new PIXI.Rectangle(this.buttons.healer.sprite.x, this.buttons.healer.sprite.y, this.buttons.healer.sprite.width, this.buttons.healer.sprite.height);

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

	this.container.addChild(this.buttons.cleaner.sprite);
	this.container.addChild(this.buttons.healer.sprite);
	this.container.addChild(this.buttons.crate.sprite);
	this.container.addChild(this.buttons.pot.sprite);
	this.container.addChild(this.buttons.skeleton.sprite);
	this.container.addChild(this.buttons.monster.sprite);
	this.container.addChild(this.buttons.coin.sprite);
	this.container.addChild(this.buttons.heart.sprite);

	this.Display();
}

GUI.prototype.Click = function () {
	if (this.buttons.crate.collider.contains(mouse.x, mouse.y)) {
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

GUI.prototype.Tick = function (length) {
}