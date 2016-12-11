function GUI(level) {
	this.level = level;
	this.container = new PIXI.Container();

	this.isDisplayed = false;

	this.buttons = {
		cleaner : {},
		healer : {},
		plus : {}
	}

	this.Init();
}

GUI.prototype.Init = function () {
	this.buttons.cleaner.sprite = PIXI.Sprite.fromImage('textures/broomstick.png');
	this.buttons.cleaner.sprite.position = new PIXI.Point(20, 20);
	this.buttons.cleaner.collider = new PIXI.Rectangle(this.buttons.cleaner.sprite.x, this.buttons.cleaner.sprite.y, this.buttons.cleaner.sprite.width, this.buttons.cleaner.sprite.height);
	
	this.buttons.healer.sprite = PIXI.Sprite.fromImage('textures/redcross.png');
	this.buttons.healer.sprite.position = new PIXI.Point(20, 120);
	this.buttons.healer.collider = new PIXI.Rectangle(this.buttons.healer.sprite.x, this.buttons.healer.sprite.y, this.buttons.healer.sprite.width, this.buttons.healer.sprite.height);

	this.buttons.plus.sprite = PIXI.Sprite.fromImage('textures/plusicon.png');
	this.buttons.plus.sprite.position = new PIXI.Point(20, 220);
	this.buttons.plus.collider = new PIXI.Rectangle(this.buttons.plus.sprite.x, this.buttons.plus.sprite.y, this.buttons.plus.sprite.width, this.buttons.plus.sprite.height);

	this.container.addChild(this.buttons.cleaner.sprite);
	this.container.addChild(this.buttons.healer.sprite);
	this.container.addChild(this.buttons.plus.sprite);

	this.Display();
}

GUI.prototype.Click = function () {
	if (this.buttons.cleaner.collider.contains(mouse.x, mouse.y)) {
		this.level.Prepare('cleaner');
	}

	if (this.buttons.healer.collider.contains(mouse.x, mouse.y)) {
		this.level.Prepare('healer');
	}

	if (this.buttons.plus.collider.contains(mouse.x, mouse.y)) {
		this.level.Prepare('powerup', 'plus');
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

GUI.prototype.ResetRadar = function () {
	this.container.removeChild(this.gradient);
	this.gradient = null;
}

GUI.prototype.Display = function () {
	this.level.gui.addChild(this.container);
	this.Unlock();
	this.isDisplayed = true;
}

GUI.prototype.Tick = function (length) {
}