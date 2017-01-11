/* TODO : create base elements with container + bg image 
			+ ability to add image, text, resize collider and set an action callback
*/

function GUI(level) {
	this.level = level;
	this.container = new PIXI.Container();

	this.isDisplayed = false;
	this.isReady = false;

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
		skull : {},
		rib : {},
		bone : {},
		end : {}
	}
	this.resources = {
		pots : {},
		skulls : {},
		ribs : {},
		bones : {}
	}
	this.tools = {
		builder : {},
		hoven : {}
	}
	this.objectives = [];
	this.score = {};

	this.blueprint = {
		background : PIXI.Sprite.fromImage('textures/blueprint/background.png'),
		coords : {
			skull : {x : 204, y : 32, scale : 1},
			rib : {x : 214, y : 239, scale : 1},
			arml : {x : 53, y : 114, scale : 1},
			armr : {x : 569, y : 114, scale : -1},
			legl : {x : 102, y : 399, scale : 1},
			legr : {x : 520, y : 399, scale : -1}
		},
		todo : {
			skull : [],
			ribs : [],
			legs : [],
			arms : []
		},
		used : {
			skulls : 0,
			ribs : 0,
			bones : 0
		},
		count : 6
	}

	this.altButtons = false;

	this.Init();
}

GUI.prototype.Init = function () {
	this.buttons.fetcher.container = new PIXI.Container();
	this.buttons.fetcher.container.position = new PIXI.Point(-38, 0);
	this.buttons.fetcher.background = PIXI.Sprite.fromImage('textures/gui/background.png');
	this.buttons.fetcher.background.position = new PIXI.Point(11, 32);
	this.buttons.fetcher.container.addChild(this.buttons.fetcher.background);
	this.buttons.fetcher.sprite = PIXI.Sprite.fromImage('textures/gui/portrait_fetcher.png');
	this.buttons.fetcher.container.addChild(this.buttons.fetcher.sprite);
	this.buttons.fetcher.collider = new PIXI.Rectangle(this.buttons.fetcher.container.x, this.buttons.fetcher.container.y, this.buttons.fetcher.container.width, this.buttons.fetcher.container.height);
	this.buttons.fetcher.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 14, fontWeight : 'bold', fill : 0x111111});
	this.buttons.fetcher.counter.position = new PIXI.Point(113 + (20 - this.buttons.fetcher.counter.width) / 2, 59 + (16 - this.buttons.fetcher.counter.height) / 2);
	this.buttons.fetcher.container.addChild(this.buttons.fetcher.counter);
	this.buttons.fetcher.shortcut = PIXI.Sprite.fromImage('textures/gui/shortcut.png');
	this.buttons.fetcher.shortcut.position = new PIXI.Point(80, 96);
	this.buttons.fetcher.container.addChild(this.buttons.fetcher.shortcut);
	this.buttons.fetcher.keybind = new PIXI.Text('Q', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xDDDDDD});
	this.buttons.fetcher.keybind.position = new PIXI.Point((this.buttons.fetcher.shortcut.width - this.buttons.fetcher.keybind.width) / 2, (this.buttons.fetcher.shortcut.height - this.buttons.fetcher.keybind.height) / 2);
	this.buttons.fetcher.shortcut.addChild(this.buttons.fetcher.keybind);

	this.buttons.cleaner.container = new PIXI.Container();
	this.buttons.cleaner.container.position = new PIXI.Point(-38, 128);
	this.buttons.cleaner.background = PIXI.Sprite.fromImage('textures/gui/background.png');
	this.buttons.cleaner.background.position = new PIXI.Point(11, 32);
	this.buttons.cleaner.container.addChild(this.buttons.cleaner.background);
	this.buttons.cleaner.sprite = PIXI.Sprite.fromImage('textures/gui/portrait_cleaner.png');
	this.buttons.cleaner.container.addChild(this.buttons.cleaner.sprite);
	this.buttons.cleaner.collider = new PIXI.Rectangle(this.buttons.cleaner.container.x, this.buttons.cleaner.container.y, this.buttons.cleaner.container.width, this.buttons.cleaner.container.height);
	this.buttons.cleaner.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 14, fontWeight : 'bold', fill : 0x111111});
	this.buttons.cleaner.counter.position = new PIXI.Point(113 + (20 - this.buttons.cleaner.counter.width) / 2, 59 + (16 - this.buttons.cleaner.counter.height) / 2);
	this.buttons.cleaner.container.addChild(this.buttons.cleaner.counter);
	this.buttons.cleaner.shortcut = PIXI.Sprite.fromImage('textures/gui/shortcut.png');
	this.buttons.cleaner.shortcut.position = new PIXI.Point(80, 96);
	this.buttons.cleaner.container.addChild(this.buttons.cleaner.shortcut);
	this.buttons.cleaner.keybind = new PIXI.Text('W', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xDDDDDD});
	this.buttons.cleaner.keybind.position = new PIXI.Point((this.buttons.cleaner.shortcut.width - this.buttons.cleaner.keybind.width) / 2, (this.buttons.cleaner.shortcut.height - this.buttons.cleaner.keybind.height) / 2);
	this.buttons.cleaner.shortcut.addChild(this.buttons.cleaner.keybind);
	
	this.buttons.healer.container = new PIXI.Container();
	this.buttons.healer.container.position = new PIXI.Point(-38, 256);
	this.buttons.healer.background = PIXI.Sprite.fromImage('textures/gui/background.png');
	this.buttons.healer.background.position = new PIXI.Point(11, 32);
	this.buttons.healer.container.addChild(this.buttons.healer.background);
	this.buttons.healer.sprite = PIXI.Sprite.fromImage('textures/gui/portrait_healer.png');
	this.buttons.healer.container.addChild(this.buttons.healer.sprite);
	this.buttons.healer.collider = new PIXI.Rectangle(this.buttons.healer.container.x, this.buttons.healer.container.y, this.buttons.healer.container.width, this.buttons.healer.container.height);
	this.buttons.healer.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 14, fontWeight : 'bold', fill : 0x111111});
	this.buttons.healer.counter.position = new PIXI.Point(113 + (20 - this.buttons.healer.counter.width) / 2, 59 + (16 - this.buttons.healer.counter.height) / 2);
	this.buttons.healer.container.addChild(this.buttons.healer.counter);
	this.buttons.healer.shortcut = PIXI.Sprite.fromImage('textures/gui/shortcut.png');
	this.buttons.healer.shortcut.position = new PIXI.Point(80, 96);
	this.buttons.healer.container.addChild(this.buttons.healer.shortcut);
	this.buttons.healer.keybind = new PIXI.Text('E', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xDDDDDD});
	this.buttons.healer.keybind.position = new PIXI.Point((this.buttons.healer.shortcut.width - this.buttons.healer.keybind.width) / 2, (this.buttons.healer.shortcut.height - this.buttons.healer.keybind.height) / 2);
	this.buttons.healer.shortcut.addChild(this.buttons.healer.keybind);

	this.buttons.pot.container = new PIXI.Container();
	this.buttons.pot.container.position = new PIXI.Point(148, 618);
	this.buttons.pot.background = PIXI.Sprite.fromImage('textures/gui/objects_back.png');
	this.buttons.pot.background.position = new PIXI.Point(0, 46);
	this.buttons.pot.container.addChild(this.buttons.pot.background);
	this.buttons.pot.sprite = PIXI.Sprite.fromImage('textures/gui/pot.png');
	this.buttons.pot.sprite.position = new PIXI.Point(4, 0);
	this.buttons.pot.container.addChild(this.buttons.pot.sprite);
	this.buttons.pot.collider = new PIXI.Rectangle(this.buttons.pot.container.x + this.buttons.pot.sprite.x, this.buttons.pot.container.y + this.buttons.pot.sprite.y + 32, this.buttons.pot.sprite.width, this.buttons.pot.sprite.height - 32);
	this.buttons.pot.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0x111111});
	this.buttons.pot.counter.position = new PIXI.Point(62, 70);
	this.buttons.pot.sprite.addChild(this.buttons.pot.counter);

	this.buttons.skeleton.container = new PIXI.Container();
	this.buttons.skeleton.container.scale.x = -1;
	this.buttons.skeleton.container.position = new PIXI.Point(renderer.width + 38, 0);
	this.buttons.skeleton.background = PIXI.Sprite.fromImage('textures/gui/background.png');
	this.buttons.skeleton.background.position = new PIXI.Point(11, 32);
	this.buttons.skeleton.container.addChild(this.buttons.skeleton.background);
	this.buttons.skeleton.sprite = PIXI.Sprite.fromImage('textures/gui/portrait_skeleton.png');
	this.buttons.skeleton.container.addChild(this.buttons.skeleton.sprite);
	this.buttons.skeleton.collider = new PIXI.Rectangle(this.buttons.skeleton.container.x + this.buttons.skeleton.container.width, this.buttons.skeleton.container.y, -this.buttons.skeleton.container.width, this.buttons.skeleton.container.height);
	this.buttons.skeleton.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 14, fontWeight : 'bold', fill : 0x111111});
	this.buttons.skeleton.counter.scale.x = -1;
	this.buttons.skeleton.counter.position = new PIXI.Point(113 + (20 - this.buttons.skeleton.counter.width) / 2 + this.buttons.skeleton.counter.width, 59 + (16 - this.buttons.skeleton.counter.height) / 2);
	this.buttons.skeleton.container.addChild(this.buttons.skeleton.counter);
	this.buttons.skeleton.shortcut = PIXI.Sprite.fromImage('textures/gui/shortcut.png');
	this.buttons.skeleton.shortcut.position = new PIXI.Point(80, 96);
	this.buttons.skeleton.container.addChild(this.buttons.skeleton.shortcut);
	this.buttons.skeleton.keybind = new PIXI.Text('1', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xDDDDDD});
	this.buttons.skeleton.keybind.scale.x = -1;
	this.buttons.skeleton.keybind.position = new PIXI.Point((this.buttons.skeleton.shortcut.width - this.buttons.skeleton.keybind.width) / 2 + this.buttons.skeleton.keybind.width, (this.buttons.skeleton.shortcut.height - this.buttons.skeleton.keybind.height) / 2);
	this.buttons.skeleton.shortcut.addChild(this.buttons.skeleton.keybind);

	this.buttons.monster.container = new PIXI.Container();
	this.buttons.monster.container.scale.x = -1;
	this.buttons.monster.container.position = new PIXI.Point(renderer.width + 38, 128);
	this.buttons.monster.background = PIXI.Sprite.fromImage('textures/gui/background.png');
	this.buttons.monster.background.position = new PIXI.Point(11, 32);
	this.buttons.monster.container.addChild(this.buttons.monster.background);
	this.buttons.monster.sprite = PIXI.Sprite.fromImage('textures/gui/portrait_imp.png');
	this.buttons.monster.container.addChild(this.buttons.monster.sprite);
	this.buttons.monster.collider = new PIXI.Rectangle(this.buttons.monster.container.x + this.buttons.monster.container.width, this.buttons.monster.container.y, -this.buttons.monster.container.width, this.buttons.monster.container.height);
	this.buttons.monster.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 14, fontWeight : 'bold', fill : 0x111111});
	this.buttons.monster.counter.scale.x = -1;
	this.buttons.monster.counter.position = new PIXI.Point(113 + (20 - this.buttons.monster.counter.width) / 2 + this.buttons.monster.counter.width, 59 + (16 - this.buttons.monster.counter.height) / 2);
	this.buttons.monster.container.addChild(this.buttons.monster.counter);
	this.buttons.monster.shortcut = PIXI.Sprite.fromImage('textures/gui/shortcut.png');
	this.buttons.monster.shortcut.position = new PIXI.Point(80, 96);
	this.buttons.monster.container.addChild(this.buttons.monster.shortcut);
	this.buttons.monster.keybind = new PIXI.Text('2', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xDDDDDD});
	this.buttons.monster.keybind.scale.x = -1;
	this.buttons.monster.keybind.position = new PIXI.Point((this.buttons.monster.shortcut.width - this.buttons.monster.keybind.width) / 2 + this.buttons.monster.keybind.width, (this.buttons.monster.shortcut.height - this.buttons.monster.keybind.height) / 2);
	this.buttons.monster.shortcut.addChild(this.buttons.monster.keybind);

	this.buttons.heart.container = new PIXI.Container();
	this.buttons.heart.container.position = new PIXI.Point(245, 656);
	this.buttons.heart.background = PIXI.Sprite.fromImage('textures/gui/objects_back.png');
	this.buttons.heart.background.position = new PIXI.Point(0, 8);
	this.buttons.heart.container.addChild(this.buttons.heart.background);
	this.buttons.heart.sprite = PIXI.Sprite.fromImage('textures/gui/heart.png');
	this.buttons.heart.sprite.position = new PIXI.Point(11, 0);
	this.buttons.heart.container.addChild(this.buttons.heart.sprite);
	this.buttons.heart.collider = new PIXI.Rectangle(this.buttons.heart.container.x + this.buttons.heart.sprite.x, this.buttons.heart.container.y + this.buttons.heart.sprite.y, this.buttons.heart.sprite.width, this.buttons.heart.sprite.height);
	this.buttons.heart.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0x111111});
	this.buttons.heart.counter.position = new PIXI.Point(54, 32);
	this.buttons.heart.sprite.addChild(this.buttons.heart.counter);

	this.buttons.coin.container = new PIXI.Container();
	this.buttons.coin.container.position = new PIXI.Point(340, 632);
	this.buttons.coin.background = PIXI.Sprite.fromImage('textures/gui/objects_back.png');
	this.buttons.coin.background.position = new PIXI.Point(0, 32);
	this.buttons.coin.container.addChild(this.buttons.coin.background);
	this.buttons.coin.sprite = PIXI.Sprite.fromImage('textures/gui/coin.png');
	this.buttons.coin.sprite.position = new PIXI.Point(12, 0);
	this.buttons.coin.container.addChild(this.buttons.coin.sprite);
	this.buttons.coin.collider = new PIXI.Rectangle(this.buttons.coin.container.x + this.buttons.coin.sprite.x, this.buttons.coin.container.y + this.buttons.coin.sprite.y, this.buttons.coin.sprite.width, this.buttons.coin.sprite.height);
	this.buttons.coin.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0x111111});
	this.buttons.coin.counter.position = new PIXI.Point(54, 56);
	this.buttons.coin.sprite.addChild(this.buttons.coin.counter);

	this.buttons.skull.container = new PIXI.Container();
	this.buttons.skull.container.scale.x = -1;
	this.buttons.skull.container.position = new PIXI.Point(renderer.width + 38, 0);
	this.buttons.skull.background = PIXI.Sprite.fromImage('textures/gui/background.png');
	this.buttons.skull.background.position = new PIXI.Point(11, 32);
	this.buttons.skull.container.addChild(this.buttons.skull.background);
	this.buttons.skull.sprite = PIXI.Sprite.fromImage('textures/gui/skull.png');
	this.buttons.skull.sprite.position = new PIXI.Point(35, 55);
	this.buttons.skull.container.addChild(this.buttons.skull.sprite);
	this.buttons.skull.collider = new PIXI.Rectangle(this.buttons.skull.container.x + this.buttons.skull.container.width, this.buttons.skull.container.y, -this.buttons.skull.container.width, this.buttons.skull.container.height);
	this.buttons.skull.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 14, fontWeight : 'bold', fill : 0x111111});
	this.buttons.skull.counter.scale.x = -1;
	this.buttons.skull.counter.position = new PIXI.Point(113 + (20 - this.buttons.skull.counter.width) / 2 + this.buttons.skull.counter.width, 59 + (16 - this.buttons.skull.counter.height) / 2);
	this.buttons.skull.container.addChild(this.buttons.skull.counter);
	this.buttons.skull.shortcut = PIXI.Sprite.fromImage('textures/gui/shortcut.png');
	this.buttons.skull.shortcut.position = new PIXI.Point(80, 96);
	this.buttons.skull.container.addChild(this.buttons.skull.shortcut);
	this.buttons.skull.keybind = new PIXI.Text('1', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xDDDDDD});
	this.buttons.skull.keybind.scale.x = -1;
	this.buttons.skull.keybind.position = new PIXI.Point((this.buttons.skull.shortcut.width - this.buttons.skull.keybind.width) / 2 + this.buttons.skull.keybind.width, (this.buttons.skull.shortcut.height - this.buttons.skull.keybind.height) / 2);
	this.buttons.skull.shortcut.addChild(this.buttons.skull.keybind);

	this.buttons.rib.container = new PIXI.Container();
	this.buttons.rib.container.scale.x = -1;
	this.buttons.rib.container.position = new PIXI.Point(renderer.width + 38, 128);
	this.buttons.rib.background = PIXI.Sprite.fromImage('textures/gui/background.png');
	this.buttons.rib.background.position = new PIXI.Point(11, 32);
	this.buttons.rib.container.addChild(this.buttons.rib.background);
	this.buttons.rib.sprite = PIXI.Sprite.fromImage('textures/gui/rib.png');
	this.buttons.rib.sprite.position = new PIXI.Point(35, 55);
	this.buttons.rib.container.addChild(this.buttons.rib.sprite);
	this.buttons.rib.collider = new PIXI.Rectangle(this.buttons.rib.container.x + this.buttons.rib.container.width, this.buttons.rib.container.y, -this.buttons.rib.container.width, this.buttons.rib.container.height);
	this.buttons.rib.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 14, fontWeight : 'bold', fill : 0x111111});
	this.buttons.rib.counter.scale.x = -1;
	this.buttons.rib.counter.position = new PIXI.Point(113 + (20 - this.buttons.rib.counter.width) / 2 + this.buttons.rib.counter.width, 59 + (16 - this.buttons.rib.counter.height) / 2);
	this.buttons.rib.container.addChild(this.buttons.rib.counter);
	this.buttons.rib.shortcut = PIXI.Sprite.fromImage('textures/gui/shortcut.png');
	this.buttons.rib.shortcut.position = new PIXI.Point(80, 96);
	this.buttons.rib.container.addChild(this.buttons.rib.shortcut);
	this.buttons.rib.keybind = new PIXI.Text('2', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xDDDDDD});
	this.buttons.rib.keybind.scale.x = -1;
	this.buttons.rib.keybind.position = new PIXI.Point((this.buttons.rib.shortcut.width - this.buttons.rib.keybind.width) / 2 + this.buttons.rib.keybind.width, (this.buttons.rib.shortcut.height - this.buttons.rib.keybind.height) / 2);
	this.buttons.rib.shortcut.addChild(this.buttons.rib.keybind);

	this.buttons.bone.container = new PIXI.Container();
	this.buttons.bone.container.scale.x = -1;
	this.buttons.bone.container.position = new PIXI.Point(renderer.width + 38, 256);
	this.buttons.bone.background = PIXI.Sprite.fromImage('textures/gui/background.png');
	this.buttons.bone.background.position = new PIXI.Point(11, 32);
	this.buttons.bone.container.addChild(this.buttons.bone.background);
	this.buttons.bone.sprite = PIXI.Sprite.fromImage('textures/gui/bone.png');
	this.buttons.bone.sprite.position = new PIXI.Point(35, 55);
	this.buttons.bone.container.addChild(this.buttons.bone.sprite);
	this.buttons.bone.collider = new PIXI.Rectangle(this.buttons.bone.container.x + this.buttons.bone.container.width, this.buttons.bone.container.y, -this.buttons.bone.container.width, this.buttons.bone.container.height);
	this.buttons.bone.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 14, fontWeight : 'bold', fill : 0x111111});
	this.buttons.bone.counter.scale.x = -1;
	this.buttons.bone.counter.position = new PIXI.Point(113 + (20 - this.buttons.bone.counter.width) / 2 + this.buttons.bone.counter.width, 59 + (16 - this.buttons.bone.counter.height) / 2);
	this.buttons.bone.container.addChild(this.buttons.bone.counter);
	this.buttons.bone.shortcut = PIXI.Sprite.fromImage('textures/gui/shortcut.png');
	this.buttons.bone.shortcut.position = new PIXI.Point(80, 96);
	this.buttons.bone.container.addChild(this.buttons.bone.shortcut);
	this.buttons.bone.keybind = new PIXI.Text('3', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xDDDDDD});
	this.buttons.bone.keybind.scale.x = -1;
	this.buttons.bone.keybind.position = new PIXI.Point((this.buttons.bone.shortcut.width - this.buttons.bone.keybind.width) / 2 + this.buttons.bone.keybind.width, (this.buttons.bone.shortcut.height - this.buttons.bone.keybind.height) / 2);
	this.buttons.bone.shortcut.addChild(this.buttons.bone.keybind);


	var iconsTexture = PIXI.BaseTexture.fromImage('textures/gui/resources_icons.png');

	this.resources.pots.container = new PIXI.Container();
	this.resources.pots.container.scale.x = -1;
	this.resources.pots.container.position = new PIXI.Point(94, 544);
	this.resources.pots.background = PIXI.Sprite.fromImage('textures/gui/resources_back.png');
	this.resources.pots.background.position = new PIXI.Point(0, 0);
	this.resources.pots.container.addChild(this.resources.pots.background);
	this.resources.pots.sprite = new PIXI.Sprite(new PIXI.Texture(iconsTexture, new PIXI.Rectangle(96, 0, 32, 32)));
	this.resources.pots.sprite.position = new PIXI.Point(58, 16);
	this.resources.pots.container.addChild(this.resources.pots.sprite);
	this.resources.pots.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 18, fontWeight : 'bold', fill : 0x111111});
	this.resources.pots.counter.scale.x = -1;
	this.resources.pots.counter.position = new PIXI.Point(52, 23);
	this.resources.pots.container.addChild(this.resources.pots.counter);

	this.resources.skulls.container = new PIXI.Container();
	this.resources.skulls.container.position = new PIXI.Point(1186, 448);
	this.resources.skulls.background = PIXI.Sprite.fromImage('textures/gui/resources_back.png');
	this.resources.skulls.background.position = new PIXI.Point(0, 0);
	this.resources.skulls.container.addChild(this.resources.skulls.background);
	this.resources.skulls.sprite = new PIXI.Sprite(new PIXI.Texture(iconsTexture, new PIXI.Rectangle(0, 0, 32, 32)));
	this.resources.skulls.sprite.position = new PIXI.Point(58, 16);
	this.resources.skulls.container.addChild(this.resources.skulls.sprite);
	this.resources.skulls.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 18, fontWeight : 'bold', fill : 0x111111});
	this.resources.skulls.counter.position = new PIXI.Point(26, 23);
	this.resources.skulls.container.addChild(this.resources.skulls.counter);

	this.resources.ribs.container = new PIXI.Container();
	this.resources.ribs.container.position = new PIXI.Point(1186, 496);
	this.resources.ribs.background = PIXI.Sprite.fromImage('textures/gui/resources_back.png');
	this.resources.ribs.background.position = new PIXI.Point(0, 0);
	this.resources.ribs.container.addChild(this.resources.ribs.background);
	this.resources.ribs.sprite = new PIXI.Sprite(new PIXI.Texture(iconsTexture, new PIXI.Rectangle(32, 0, 32, 32)));
	this.resources.ribs.sprite.position = new PIXI.Point(58, 16);
	this.resources.ribs.container.addChild(this.resources.ribs.sprite);
	this.resources.ribs.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 18, fontWeight : 'bold', fill : 0x111111});
	this.resources.ribs.counter.position = new PIXI.Point(26, 23);
	this.resources.ribs.container.addChild(this.resources.ribs.counter);

	this.resources.bones.container = new PIXI.Container();
	this.resources.bones.container.position = new PIXI.Point(1186, 544);
	this.resources.bones.background = PIXI.Sprite.fromImage('textures/gui/resources_back.png');
	this.resources.bones.background.position = new PIXI.Point(0, 0);
	this.resources.bones.container.addChild(this.resources.bones.background);
	this.resources.bones.sprite = new PIXI.Sprite(new PIXI.Texture(iconsTexture, new PIXI.Rectangle(64, 0, 32, 32)));
	this.resources.bones.sprite.position = new PIXI.Point(58, 16);
	this.resources.bones.container.addChild(this.resources.bones.sprite);
	this.resources.bones.counter = new PIXI.Text('x0', {fontFamily : 'Arial', fontSize: 18, fontWeight : 'bold', fill : 0x111111});
	this.resources.bones.counter.position = new PIXI.Point(26, 23);
	this.resources.bones.container.addChild(this.resources.bones.counter);

	this.tools.builder.collider = new PIXI.Rectangle(1140, 620, 140, 100);
	this.tools.builder.container = new PIXI.Container();
	this.tools.builder.container.position = this.tools.builder.collider;
	this.tools.builder.sprite = PIXI.Sprite.fromImage('textures/gui/builder.png');
	this.tools.builder.sprite.position = new PIXI.Point(0, -20);
	this.tools.builder.container.addChild(this.tools.builder.sprite);
	this.tools.builder.timer = new PIXI.Text('00:00', {fontFamily : 'Arial', fontSize: 20, fontWeight : 'bold', fill : 0xEEEEEE});
	this.tools.builder.timer.position = new PIXI.Point((this.tools.builder.collider.width - this.tools.builder.timer.width) / 2, (this.tools.builder.collider.height - this.tools.builder.timer.height - 5));
	this.level.builder.on('start', function () {
		this.tools.builder.container.addChild(this.tools.builder.timer);
	}, this);
	this.level.builder.on('end', function () {
		this.tools.builder.container.removeChild(this.tools.builder.timer);
	}, this);

	this.tools.hoven.collider = new PIXI.Rectangle(0, 610, 140, 110);
	this.tools.hoven.container = new PIXI.Container();
	this.tools.hoven.container.position = this.tools.hoven.collider;
	this.tools.hoven.sprite = PIXI.Sprite.fromImage('textures/gui/hoven.png');
	this.tools.hoven.sprite.position = new PIXI.Point(0, -10);
	this.tools.hoven.container.addChild(this.tools.hoven.sprite);
	this.tools.hoven.highlight = PIXI.Sprite.fromImage('textures/gui/hoven_hl.png');
	this.tools.hoven.highlight.position = new PIXI.Point(60, 9);
	this.tools.hoven.timer = new PIXI.Text('00:00', {fontFamily : 'Arial', fontSize: 20, fontWeight : 'bold', fill : 0xEEEEEE});
	this.tools.hoven.timer.position = new PIXI.Point((this.tools.hoven.collider.width - this.tools.hoven.timer.width) / 2 + 5, (this.tools.hoven.collider.height - this.tools.hoven.timer.height) / 2 - 5);
	this.level.hoven.on('start', function () {
		this.tools.hoven.container.addChild(this.tools.hoven.highlight);
		this.tools.hoven.container.addChild(this.tools.hoven.timer);
	}, this);
	this.level.hoven.on('end', function () {
		this.tools.hoven.container.removeChild(this.tools.hoven.highlight);
		this.tools.hoven.container.removeChild(this.tools.hoven.timer);
	}, this);

	this.blueprint.background.position = new PIXI.Point((renderer.width - this.blueprint.background.width) / 2, 58);
	this.blueprint.build = new Button('Build', this.blueprint.background.width - 128 - 10, this.blueprint.background.height - 64 - 10, 128, 64)

	this.container.addChild(this.buttons.fetcher.container);
	this.container.addChild(this.buttons.cleaner.container);
	this.container.addChild(this.buttons.healer.container);
	this.container.addChild(this.buttons.pot.container);
	this.container.addChild(this.buttons.skeleton.container);
	this.container.addChild(this.buttons.monster.container);
	this.container.addChild(this.buttons.coin.container);
	this.container.addChild(this.buttons.heart.container);

	this.container.addChild(this.resources.pots.container);
	this.container.addChild(this.resources.skulls.container);
	this.container.addChild(this.resources.ribs.container);
	this.container.addChild(this.resources.bones.container);

	this.container.addChild(this.tools.builder.container);
	this.container.addChild(this.tools.hoven.container);

	this.timer.counter = new PIXI.Text('00:00', {fontFamily : 'Arial', fontSize: 48, fontWeight : 'bold', fill : 0xEEEEEE});
	this.timer.counter.position = new PIXI.Point((renderer.width - this.timer.counter.width) / 2, 24);
	this.timer.pause = new PIXI.Text('PAUSED', {fontFamily : 'Arial', fontSize: 32, fontWeight : 'bold', fill : 0xEEEEEE});
	this.timer.pause.position = new PIXI.Point((renderer.width - this.timer.pause.width) / 2, 32);

	this.score.counter = new PIXI.Text('0', {fontFamily : 'Arial', fontSize: 24, fontWeight : 'bold', fill : 0xEEEEEE});
	this.score.counter.position = new PIXI.Point(1128 - this.score.counter.width, 16);
	this.score.multiplier = new PIXI.Text('', {fontFamily : 'Arial', fontSize: 14, fontWeight : 'bold', fill : 0xEEEEEE});
	this.score.multiplier.position = new PIXI.Point(1128 - this.score.multiplier.width, 16 + this.score.counter.height + 4);

	this.level.objectives.forEach(function (objective, index) {
		this.objectives.push(new PIXI.Text('', {fontFamily : 'Arial', fontSize: 16, fontWeight : 'bold', fill : 0xEEEEEE}));
		this.objectives[index].position = new PIXI.Point(160, 20 + 20 * index);
		this.container.addChild(this.objectives[index]);
	}, this);

	this.buttons.end = new Button('GO', 400, 20, 64, 64);

	this.container.addChild(this.timer.counter);
	this.container.addChild(this.score.counter);
	this.container.addChild(this.score.multiplier);

	this.level.on('update', this.Update, this);

	this.Display();
}

GUI.prototype.Update = function () {
	this.buttons.fetcher.counter.text = 'x' + this.level.workers.fetcher;
	this.buttons.cleaner.counter.text = 'x' + this.level.workers.cleaner;
	this.buttons.healer.counter.text = 'x' + this.level.workers.healer;

	this.buttons.pot.counter.text = 'x' + this.level.stuff.pot;
	this.buttons.skeleton.counter.text = 'x' + this.level.stuff.skeleton;
	this.buttons.monster.counter.text = 'x' + this.level.stuff.monster;
	this.buttons.coin.counter.text = 'x' + this.level.stuff.coin;
	this.buttons.heart.counter.text = 'x' + this.level.stuff.heart;
	this.buttons.skull.counter.text = 'x' + this.level.resources.skulls;
	this.buttons.rib.counter.text = 'x' + this.level.resources.ribs;
	this.buttons.bone.counter.text = 'x' + this.level.resources.bones;

	this.resources.pots.counter.text = 'x' + this.level.resources.pots;
	this.resources.skulls.counter.text = 'x' + this.level.resources.skulls;
	this.resources.ribs.counter.text = 'x' + this.level.resources.ribs;
	this.resources.bones.counter.text = 'x' + this.level.resources.bones;

	this.score.counter.text = '' + this.level.score;
	this.score.counter.position = new PIXI.Point(1128 - this.score.counter.width, 16);
	this.score.multiplier.text = this.level.multiplier > 1 ? 'x' + this.level.multiplier : '';
	this.score.multiplier.position = new PIXI.Point(1128 - this.score.multiplier.width, 16 + this.score.counter.height);

	this.objectives.forEach(function (objective, index) {
		var count = Math.max(0, this.level.objectives[index].limit - this.level.objectives[index].count);
		objective.text = 'Place ' + count + ' ' + this.level.objectives[index].type + ' in the room.';
	}, this);

	if (this.level.CheckObjectives()) {
		this.isReady = true;
		this.buttons.end.AddTo(this.container);
	}
}

GUI.prototype.Click = function () {
	if (!this.level.paused) {
		if (this.altButtons) {
			if (this.buttons.skull.collider.contains(mouse.x, mouse.y)) {
				if (this.blueprint.todo.skull.length) {
					if (this.level.BuildSkeleton('skulls', 1)) {
						var coords = this.blueprint.todo.skull.shift();
						var sprite = PIXI.Sprite.fromImage('textures/blueprint/skeleton_skull.png');
						sprite.scale.x = coords.scale;
						sprite.position = coords;
						this.blueprint.background.addChild(sprite);
						this.blueprint.used.skulls += 1;
						this.blueprint.count -= 1;
					}
				}
			}

			if (this.buttons.rib.collider.contains(mouse.x, mouse.y)) {
				if (this.blueprint.todo.ribs.length) {
					if (this.level.BuildSkeleton('ribs', 2)) {
						var coords = this.blueprint.todo.ribs.shift();
						var sprite = PIXI.Sprite.fromImage('textures/blueprint/skeleton_ribs.png');
						sprite.scale.x = coords.scale;
						sprite.position = coords;
						this.blueprint.background.addChild(sprite);
						this.blueprint.background.setChildIndex(sprite, 0);
						this.blueprint.used.ribs += 2;
						this.blueprint.count -= 1;
					}
				}
			}

			if (this.buttons.bone.collider.contains(mouse.x, mouse.y)) {
				if (this.blueprint.todo.arms.length) {
					if (this.level.BuildSkeleton('bones', 2)) {
						var coords = this.blueprint.todo.arms.shift();
						var sprite = PIXI.Sprite.fromImage('textures/blueprint/skeleton_arm.png');
						sprite.scale.x = coords.scale;
						sprite.position = coords;
						this.blueprint.background.addChild(sprite);
						this.blueprint.used.bones += 2;
						this.blueprint.count -= 1;
					}
				} else if (this.blueprint.todo.legs.length) {
					if (this.level.BuildSkeleton('bones', 2)) {
						var coords = this.blueprint.todo.legs.shift();
						var sprite = PIXI.Sprite.fromImage('textures/blueprint/skeleton_leg.png');
						sprite.scale.x = coords.scale;
						sprite.position = coords;
						this.blueprint.background.addChild(sprite);
						this.blueprint.used.bones += 2;
						this.blueprint.count -= 1;
					}
				}
			}

			if (this.blueprint.build.collider.contains(mouse.x - this.blueprint.background.x, mouse.y - this.blueprint.background.y)) {
				if (this.blueprint.count === -1) {
					this.blueprint.used.skulls = 0;
					this.blueprint.used.ribs = 0;
					this.blueprint.used.bones = 0;

					this.level.builder.Start();

					this.CloseBlueprint();
				}
			}
		} else {
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
		}

		if (this.isReady && this.buttons.end.collider.contains(mouse.x, mouse.y)) {
			this.level.EndLevel();
		}

		if (this.tools.builder.collider.contains(mouse.x, mouse.y)) {
			this.OpenBlueprint();
		}

		if (this.tools.hoven.collider.contains(mouse.x, mouse.y)) {
			this.level.CookPot();
		}
	}
}

GUI.prototype.MouseMove = function () {
	if (!this.level.paused) {
		renderer.view.style.cursor = 'auto';

		if (this.altButtons) {
			if (this.buttons.skull.collider.contains(mouse.x, mouse.y) ||
					this.buttons.rib.collider.contains(mouse.x, mouse.y) ||
					this.buttons.bone.collider.contains(mouse.x, mouse.y) ||
					this.blueprint.build.collider.contains(mouse.x - this.blueprint.background.x, mouse.y - this.blueprint.background.y)) {
				renderer.view.style.cursor = 'pointer';
			}
		} else {
			if (this.buttons.fetcher.collider.contains(mouse.x, mouse.y) ||
					this.buttons.cleaner.collider.contains(mouse.x, mouse.y) ||
					this.buttons.healer.collider.contains(mouse.x, mouse.y) ||
					this.buttons.pot.collider.contains(mouse.x, mouse.y) ||
					this.buttons.skeleton.collider.contains(mouse.x, mouse.y) ||
					this.buttons.monster.collider.contains(mouse.x, mouse.y) ||
					this.buttons.coin.collider.contains(mouse.x, mouse.y) ||
					this.buttons.heart.collider.contains(mouse.x, mouse.y)) {
				renderer.view.style.cursor = 'pointer';
			}
		}

		if ((this.isReady && this.buttons.end.collider.contains(mouse.x, mouse.y)) ||
				this.tools.builder.collider.contains(mouse.x, mouse.y) ||
				this.tools.hoven.collider.contains(mouse.x, mouse.y)) {
			renderer.view.style.cursor = 'pointer';
		}
	}
}

GUI.prototype.KeyPress = function (code) {
	if (!this.level.paused) {
		if (this.altButtons) {
			if (code === keys[1]) {
				if (this.blueprint.todo.skull.length) {
					if (this.level.BuildSkeleton('skulls', 1)) {
						var coords = this.blueprint.todo.skull.shift();
						var sprite = PIXI.Sprite.fromImage('textures/blueprint/skeleton_skull.png');
						sprite.scale.x = coords.scale;
						sprite.position = coords;
						this.blueprint.background.addChild(sprite);
						this.blueprint.used.skulls += 1;
						this.blueprint.count -= 1;
					}
				}
			}

			if (code === keys[2]) {
				if (this.blueprint.todo.ribs.length) {
					if (this.level.BuildSkeleton('ribs', 2)) {
						var coords = this.blueprint.todo.ribs.shift();
						var sprite = PIXI.Sprite.fromImage('textures/blueprint/skeleton_ribs.png');
						sprite.scale.x = coords.scale;
						sprite.position = coords;
						this.blueprint.background.addChild(sprite);
						this.blueprint.background.setChildIndex(sprite, 0);
						this.blueprint.used.ribs += 2;
						this.blueprint.count -= 1;
					}
				}
			}

			if (code === keys[3]) {
				if (this.blueprint.todo.arms.length) {
					if (this.level.BuildSkeleton('bones', 2)) {
						var coords = this.blueprint.todo.arms.shift();
						var sprite = PIXI.Sprite.fromImage('textures/blueprint/skeleton_arm.png');
						sprite.scale.x = coords.scale;
						sprite.position = coords;
						this.blueprint.background.addChild(sprite);
						this.blueprint.used.bones += 2;
						this.blueprint.count -= 1;
					}
				} else if (this.blueprint.todo.legs.length) {
					if (this.level.BuildSkeleton('bones', 2)) {
						var coords = this.blueprint.todo.legs.shift();
						var sprite = PIXI.Sprite.fromImage('textures/blueprint/skeleton_leg.png');
						sprite.scale.x = coords.scale;
						sprite.position = coords;
						this.blueprint.background.addChild(sprite);
						this.blueprint.used.bones += 2;
						this.blueprint.count -= 1;
					}
				}
			}
		} else {
			if (code === keys.q) {
				this.level.Prepare('fetcher');
			}
			
			if (code === keys.w) {
				this.level.Prepare('cleaner');
			}

			if (code === keys.e) {
				this.level.Prepare('healer');
			}
			// if (code === keys[1]) {
			// 	this.level.Prepare('item', 'pot');
			// }

			if (code === keys[1]) {
				this.level.Prepare('monster', 'skeleton');
			}

			if (code === keys[2]) {
				this.level.Prepare('monster', 'monster');
			}

			// if (code === keys[4]) {
			// 	this.level.Prepare('powerup', 'coin');
			// }

			// if (code === keys[5]) {
			// 	this.level.Prepare('powerup', 'heart');
			// }

			if (code === keys.space) {
				if (this.level.CheckObjectives()) {
					this.level.EndLevel();
				}
			}
		}


		if (code === keys.r) {
			this.OpenBlueprint();
		}

		if (code === keys.t) {
			this.level.CookPot();
		}
	}
}

GUI.prototype.Pause = function () {
	this.container.removeChild(this.timer.counter);
	this.container.addChild(this.timer.pause);
}

GUI.prototype.Play = function () {
	this.container.removeChild(this.timer.pause);
	this.container.addChild(this.timer.counter);
}

GUI.prototype.OpenBlueprint = function () {
	if (!this.level.builder.timer) {
		this.blueprint.todo.skull.push(this.blueprint.coords.skull);
		this.blueprint.todo.ribs.push(this.blueprint.coords.rib);
		this.blueprint.todo.arms.push(this.blueprint.coords.arml);
		this.blueprint.todo.arms.push(this.blueprint.coords.armr);
		this.blueprint.todo.legs.push(this.blueprint.coords.legl);
		this.blueprint.todo.legs.push(this.blueprint.coords.legr);

		this.container.addChild(this.blueprint.background);

		// this.container.removeChild(this.buttons.pot.container);
		this.container.removeChild(this.buttons.skeleton.container);
		this.container.removeChild(this.buttons.monster.container);
		// this.container.removeChild(this.buttons.coin.container);
		// this.container.removeChild(this.buttons.heart.container);

		this.container.addChild(this.buttons.skull.container);
		this.container.addChild(this.buttons.rib.container);
		this.container.addChild(this.buttons.bone.container);

		this.altButtons = true;
	}
}

GUI.prototype.CloseBlueprint = function () {
	this.blueprint.todo.skull = [];
	this.blueprint.todo.ribs = [];
	this.blueprint.todo.bones = [];

	this.level.RefundSkeleton(this.blueprint.used);

	this.blueprint.count = 6;

	this.blueprint.background.removeChildren();
	this.container.removeChild(this.blueprint.background);

	this.container.removeChild(this.buttons.skull.container);
	this.container.removeChild(this.buttons.rib.container);
	this.container.removeChild(this.buttons.bone.container);

	// this.container.addChild(this.buttons.pot.container);
	this.container.addChild(this.buttons.skeleton.container);
	this.container.addChild(this.buttons.monster.container);
	// this.container.addChild(this.buttons.coin.container);
	// this.container.addChild(this.buttons.heart.container);

	this.altButtons = false;
}

GUI.prototype.Lock = function () {
	key.off('press', this.KeyPress);
	mouse.off('click', this.Click);
	mouse.off('mousemove', this.MouseMove);
}

GUI.prototype.Unlock = function () {
	key.on('press', this.KeyPress, this);
	mouse.on('click', this.Click, this);
	mouse.on('mousemove', this.MouseMove, this);
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
	seconds = Math.ceil(seconds % 60);

	return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

GUI.prototype.Tick = function (length) {
	this.timer.counter.text = this.SecondsToDisplay(this.level.timer);
	this.tools.builder.timer.text = this.SecondsToDisplay(this.level.builder.timer);
	this.tools.hoven.timer.text = this.SecondsToDisplay(this.level.hoven.timer);

	if (this.altButtons && !this.blueprint.count) {
		this.blueprint.count = -1;
		this.blueprint.build.AddTo(this.blueprint.background);
	}
}