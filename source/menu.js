function Menu(renderer) {
	this.loaded = false;
	this.listeners = {
		ready : []
	};
	this.next = {
		ready : []
	};

	this.renderer = renderer;
	this.container = new PIXI.Container();

	this.screens = {};

	this.Init();
}

Menu.prototype.Init = function (data) {
	var self = this;

	//main
	var main = {};
	main.screen = new PIXI.Container();
	// var title = new PIXI.Text('Adventure aboard the Narwhal', {fontFamily : 'Arial', fontSize: 32, fill : 0xEEEEEE});
	var title = PIXI.Sprite.fromImage('textures/title.png');
	title.position = new PIXI.Point((800 - 312) / 2, 50);
	var button_play = new Button(new PIXI.Text('PLAY', {fontFamily : 'Arial', fontSize: 22, fill : 0xEEEEEE}), 300, 196, 200, 36);
	var button_controls = new Button(new PIXI.Text('CONTROLS', {fontFamily : 'Arial', fontSize: 22, fill : 0xEEEEEE}), 300, 242, 200, 36);
	var button_credits = new Button(new PIXI.Text('CREDITS', {fontFamily : 'Arial', fontSize: 22, fill : 0xEEEEEE}), 300, 288, 200, 36);
	
	main.screen.addChild(PIXI.Sprite.fromImage('textures/background.png'));
	main.screen.addChild(title);
	button_play.AddTo(main.screen);
	button_controls.AddTo(main.screen);
	button_credits.AddTo(main.screen);

	main.listener = function (event) {
		if (event.button === 0) {
			if (button_play.collider.contains(mouse.x, mouse.y)) {
				self.SwitchTo();
				self.Play();
			} else if (button_controls.collider.contains(mouse.x, mouse.y)) {
				self.SwitchTo('controls');
			} else if (button_credits.collider.contains(mouse.x, mouse.y)) {
				self.SwitchTo('credits');
			}
		}
	};
	

	// controls
	var controls = {};
	controls.screen = new PIXI.Container();
	var button_back_controls = new Button(new PIXI.Text('BACK', {fontFamily : 'Arial', fontSize: 22, fill : 0xEEEEEE}), 640, 434, 150, 36)

	controls.screen.addChild(PIXI.Sprite.fromImage('textures/tutorial.png'));
	button_back_controls.AddTo(controls.screen);

	controls.listener = function (event) {
		if (event.button === 0) {
			if (button_back_controls.collider.contains(mouse.x, mouse.y)) {
				self.SwitchTo('main');
			}
		}
	};
	
	// credits
	var credits = {};
	credits.screen = new PIXI.Container();
	var button_back_credits = new Button(new PIXI.Text('BACK', {fontFamily : 'Arial', fontSize: 22, fill : 0xEEEEEE}), 640, 434, 150, 36)
	var role_maxgun = new PIXI.Text('Code, Assets, Design', {fontFamily : 'Arial', fontSize: 32, fontWeight : 'bolder', fill : 0xCCCCCC});
	var maxgun = new PIXI.Text('MaxguN', {fontFamily : 'Arial', fontSize: 30, fontWeight : 'lighter', fill : 0xEEEEEE});
	var role_lynn = new PIXI.Text('Story, Riddles, Portraits', {fontFamily : 'Arial', fontSize: 32, fontWeight : 'bolder', fill : 0xCCCCCC});
	var lynn = new PIXI.Text('Gwethelyn', {fontFamily : 'Arial', fontSize: 30, fontWeight : 'lighter', fill : 0xEEEEEE});
	role_maxgun.position = new PIXI.Point((800 - role_maxgun.width) / 2,90);
	maxgun.position = new PIXI.Point((800 - maxgun.width)/2,150);
	role_lynn.position = new PIXI.Point((800 - role_lynn.width)/2,260);
	lynn.position = new PIXI.Point((800 - lynn.width)/2,320);
	
	credits.screen.addChild(role_maxgun);
	credits.screen.addChild(maxgun);
	credits.screen.addChild(role_lynn);
	credits.screen.addChild(lynn);
	button_back_credits.AddTo(credits.screen);

	credits.listener = function (event) {
		if (event.button === 0) {
			if (button_back_credits.collider.contains(mouse.x, mouse.y)) {
				self.SwitchTo('main');
			}
		}
	};

	this.screens.main = main;
	this.screens.controls = controls;
	this.screens.credits = credits;

	this.SwitchTo('main');

	this.loaded = true;
	this.listeners.ready.forEach(function (listener) {
		listener();
	});
	while (this.next.ready.length > 0) {
		(this.next.ready.shift())();
	}
}

Menu.prototype.on = function(event, callback) {
	if (this.listeners[event]) {
		this.listeners[event].push(callback);
	}

	if (this.loaded) {
		callback();		
	}
};

Menu.prototype.ready = function(callback) {
	if (!this.loaded) {
		this.next.ready.push(callback);
	} else {
		callback();
	}
};

Menu.prototype.SwitchTo = function (screen) {
	for (var index in this.screens) {
		this.container.removeChild(this.screens[index].screen);
		mouse.off('click', this.screens[index].listener);
	}

	if (screen) {
		this.container.addChild(this.screens[screen].screen);
		mouse.on('click', this.screens[screen].listener);
	}
}

Menu.prototype.Play = function () {
	level = new Level('level1', renderer);

	currentScene = level;
}

Menu.prototype.Tick = function (length) {
	if (this.loaded) {
 		this.Draw();
	}
}

Menu.prototype.Draw = function () {
	if (this.loaded) {
		this.renderer.render(this.container);
	}
}