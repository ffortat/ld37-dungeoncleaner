// TODO : add parameters

function Button(text, x, y, width, height) {
	this.container = new PIXI.Container();

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.collider = new PIXI.Rectangle(x, y, width, height);

	this.text = new PIXI.Text(text, {fontFamily : 'Arial', fontSize: 22, fill : 0xEEEEEE});

	this.rectangle = new PIXI.Graphics()

	this.Init();
}

Button.prototype.Init = function () {
	this.rectangle.beginFill(0x000000, 1);
	this.rectangle.drawRect(this.x, this.y, this.width, this.height);

	this.text.position = new PIXI.Point(this.x + (this.width - this.text.width) / 2, this.y + (this.height - this.text.height) / 2);

	this.container.addChild(this.rectangle);
	this.container.addChild(this.text);
}

Button.prototype.AddTo = function (container) {
	container.addChild(this.container);
}

Button.prototype.RemoveFrom = function (container) {
	container.addChild(this.container);
}