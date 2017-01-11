/*	{
 *		"entrypoint" : <dialog_name>,
 *		<dialog_name> : {
 *			"dialog" : {
 *				"text" : [
 *					[<id>, <text>],
 *					...
 *				],
 *				"characters" : [
 *					{
 *						"id" : <id>,
 *						"name" : <character_name>,
 *						"image" : <image>,
 *						"side" : <side>
 *					}
 *				]
 *			},
 *			"choices" : [
 *				{
 *					"label" : <choice_name>, 
 *					"dialog" : <dialog_name>, 
 *					"file" : <filename>, 
 *					"result" : <result>
 *				},
 *				...
 *			],
 *			"followup" : { 
 *				"dialog" : <dialog_name>, 
 *				"file" : <filename>
 *			}
 *		},
 *		...
 *	}
 *
 *	<side> : "left" or "right"
 *	<result> : boolean
 *		Success or failure if applicable
 */

function Dialog(container, file, dialog) {
	var self = this;
	this.choiceHeight = parameters.dialog.height;
	this.choiceSpace = parameters.dialog.space;

	this.parent = container;
	this.file = file;
	this.dialog = dialog;

	this.textbox;
	this.choices = new PIXI.Container();
	this.listener = function () {};

	this.opened = false;

	this.listeners = {
		end : [],
		followup : [],
		answer : []
	}

	load.json('dialogs/' + file + '.json', function (data) {self.Init(data, dialog);});
}

Dialog.prototype.Init = function (data, dialog) {
	var self = this;
	if (!dialog) {
		dialog = data.entrypoint;
	}
	this.textbox = new TextBox(this.parent, data[dialog].dialog);

	if (data[dialog].choices) {
		var height = data[dialog].choices.length * this.choiceHeight + (data[dialog].choices.length - 1) * this.choiceSpace;
		var width = 400;
		var top = (350 - height) / 2;
		var left = (800 - width) / 2;
		var rectangles = [];

		data[dialog].choices.forEach(function (choice, index) {
			var choiceTop = top + index * (this.choiceHeight + this.choiceSpace);
			var button = new Button(choice.label, left, choiceTop, width, this.choiceHeight);
			button.AddTo(this.choices);
			rectangles.push(button.collider);
		}, this);

		this.listener = function (event) {
			if (event.button === 0) {
				rectangles.some(function (rectangle, index) {
					if (rectangle.contains(event.layerX, event.layerY)) {
						if (data[dialog].choices[index].dialog) {
							var file = data[dialog].choices[index].file ? data[dialog].choices[index].file : this.file;
							var followup = new Dialog(self.parent, file, data[dialog].choices[index].dialog);
							followup.on('end', function () {
								self.end(data[dialog].choices[index].result);
							});
							self.Hide();
							self.answered();
							followup.Display();
						} else {
							self.Hide();
							self.answered();
							self.end(data[dialog].choices[index].result);

							if (data[dialog].followup) {
								var file = data[dialog].followup.file ? data[dialog].followup.file : this.file;
								var followup = new Dialog(self.parent, file, data[dialog].followup.dialog);
								followup.Display();
							}
						}

						return true;
					}
				});
			}
		}

		this.textbox.on('end', function () {
			self.textbox.Lock();
			self.parent.addChild(self.choices);
			self.Unlock();
		});
	} else {
		this.textbox.on('end', function () {
			this.end();

			if (data[dialog].followup) {
				var file = data[dialog].followup.file ? data[dialog].followup.file : this.file;
				var followup = new Dialog(self.parent, file, data[dialog].followup.dialog);
				
				this.followup(followup);
				
				followup.Display();
			}
		}, this);
	}

	if (this.file === 'introduction') {
		this.Display();
	}
}

Dialog.prototype.on = function (eventType, callback, self) {
	if (this.listeners[eventType]) {
		this.listeners[eventType].push({func : callback, object : self});
	}
}

Dialog.prototype.off = function (eventType, callback) {
	if (this.listeners[eventType]) {
		var indexes = [];
	
		this.listeners[eventType].forEach(function (listener, index) {
			if (listener.func === callback) {
				indexes.unshift(index);
			}
		}, this);

		indexes.forEach(function (index) {
			this.listeners[eventType].splice(index, 1);
		}, this);
	}
}

Dialog.prototype.end = function (success) {
	if (this.listeners.end.length) {
		this.listeners.end.forEach(function (callback) {
			callback.func.call(callback.object, success);
		});

		this.listeners.end = [];
	}
	
	this.Hide();
}

Dialog.prototype.followup = function (dialog) {
	if (this.listeners.followup.length) {
		this.listeners.followup.forEach(function (callback) {
			callback.func.call(callback.object, dialog);
		});

		this.listeners.followup = [];
	}
}

Dialog.prototype.answered = function () {
	if (this.listeners.answer.length) {
		this.listeners.answer.forEach(function (callback) {
			callback.func.call(callback.object);
		});

		this.listeners.answer = [];
	}
}

Dialog.prototype.Hide = function () {
	this.opened = false;
	this.Lock();
	this.parent.removeChild(this.choices);
	this.textbox.Hide();
}

Dialog.prototype.Display = function () {
	this.opened = true;
	this.textbox.Display();
}

Dialog.prototype.IsOpened = function () {
	return this.opened;
}

Dialog.prototype.Unlock = function () {
	mouse.on('click', this.listener, this);
}

Dialog.prototype.Lock = function () {
	mouse.off('click', this.listener);
}