var keys = {
	any : 'any',
	escape : 'Escape',
	space : 'Space',
	backspace : 'Backspace',
	enter : 'Enter',
	tab : 'Tab',
	ctrl : 'ControlLeft',
	ctrlright : 'ControlRight',
	shift : 'ShiftLeft',
	shiftright : 'ShiftRight',
	alt : 'AltLeft',
	altright : 'AltRight',
	meta : 'MetaLeft',
	metaright : 'MetaRight',
	left : 'ArrowLeft',
	up : 'ArrowUp',
	right : 'ArrowRight',
	down : 'ArrowDown',
	backquote : 'Backquote',
	1 : 'Digit1',
	2 : 'Digit2',
	3 : 'Digit3',
	4 : 'Digit4',
	5 : 'Digit5',
	6 : 'Digit6',
	7 : 'Digit7',
	8 : 'Digit8',
	9 : 'Digit9',
	0 : 'Digit0',
	minus : 'minus',
	equal : 'equal',
	q : 'KeyQ',
	w : 'KeyW',
	e : 'KeyE',
	r : 'KeyR',
	t : 'KeyT',
	y : 'KeyY',
	u : 'KeyU',
	i : 'KeyI',
	o : 'KeyO',
	p : 'KeyP',
	a : 'KeyA',
	s : 'KeyS',
	d : 'KeyD',
	f : 'KeyF',
	g : 'KeyG',
	h : 'KeyH',
	j : 'KeyJ',
	k : 'KeyK',
	l : 'KeyL',
	z : 'KeyZ',
	x : 'KeyX',
	c : 'KeyC',
	v : 'KeyV',
	b : 'KeyB',
	n : 'KeyN',
	m : 'KeyM',
	pageup : 'PageUp',
	pagedown : 'PageDown',
	home : 'Home',
	end : 'End',
	insert : 'Insert',
	delete : 'Delete',
	num1 : 'Numpad1',
	num2 : 'Numpad2',
	num3 : 'Numpad3',
	num4 : 'Numpad4',
	num5 : 'Numpad5',
	num6 : 'Numpad6',
	num7 : 'Numpad7',
	num8 : 'Numpad8',
	num9 : 'Numpad9',
	num0 : 'Numpad0',
	numenter : 'NumpadEnter'
}

var key = (function () {
	var keydown = {};
	var diagValue = Math.sqrt(2) / 2;

	var listeners = {
		press : [],
		up : [],
		down : []
	}

	var data = {
		down : keydown,
		on : on,
		off : off,
		move : IsMoving,
		direction : GetDirection
	}

	function on(eventType, callback, self) {
		if (listeners[eventType]) {
			listeners[eventType].push({func : callback, object : self});
		}
	}

	function off(eventType, callback) {
		if (listeners[eventType]) {
			var indexes = [];
		
			listeners[eventType].forEach(function (listener, index) {
				if (listener.func === callback) {
					indexes.unshift(index);
				}
			}, this);

			indexes.forEach(function (index) {
				listeners[eventType].splice(index, 1);
			}, this);
		}
	}

	function preventDefault(event) {
		switch (event.code) {
			case keys.space :
			case keys.up :
			case keys.left :
			case keys.down :
			case keys.right :
				event.preventDefault();
		}
	}

	function onkeydown(event) {
		preventDefault(event);
		if (keydown[event.code] === undefined) {
			keydown[event.code] = true;
		}
		if (keydown[keys.any] === undefined) {
			keydown[keys.any] = true;
		}

		listeners.down.forEach(function (listener) {
			listener.func.call(listener.object, event.code);
		});
	}

	function onkeyup (event) {
		preventDefault(event);
		delete keydown[event.code];
		delete keydown[keys.any];

		listeners.up.forEach(function (listener) {
			listener.func.call(listener.object, event.code);
		});

		listeners.press.forEach(function (listener) {
			listener.func.call(listener.object, event.code);
		});
	}

	document.addEventListener('keydown', onkeydown);
	document.addEventListener('keyup', onkeyup);

	function IsMoving() {
		return (keydown[keys.left] || keydown[keys.right] || keydown[keys.up] || keydown[keys.down] ||
				keydown[keys.w] || keydown[keys.a] || keydown[keys.s] || keydown[keys.d]);
	}

	function GetDirection() {
		var direction = {x : 0, y : 0};

		if (keydown[keys.left] || keydown[keys.a]) {
			direction.x -= 1;
		}

		if (keydown[keys.right] || keydown[keys.d]) {
			direction.x += 1;
		}

		if (keydown[keys.up] || keydown[keys.w]) {
			direction.y -= 1;
		}

		if (keydown[keys.down] || keydown[keys.s]) {
			direction.y += 1;
		}

		if (direction.x && direction.y) {
			direction.x *= diagValue;
			direction.y *= diagValue;
		}

		return direction;
	}

	return data;
})();

var mouse = (function () {
	var listeners = {
		click : [],
		mousedown : [],
		mousemove : [],
		mouseup : []
	}
	var attachedElement = document;

	var data = {
		x : 0,
		y : 0,
		left : false,
		middle : false,
		right : false,
		moved : false,
		attachTo : attachTo,
		on : on,
		off : off,
		down : onmousedown,
		move : onmousemove,
		up  : onmouseup
	};

	function attachTo(element) {
		attachedElement.removeEventListener('mousedown', onmousedown);
		attachedElement.removeEventListener('mousemove', onmousemove);
		attachedElement.removeEventListener('mouseup', onmouseup);

		attachedElement = element
		
		attachedElement.addEventListener('mousedown', onmousedown);
		attachedElement.addEventListener('mousemove', onmousemove);
		attachedElement.addEventListener('mouseup', onmouseup);
	}

	function on(eventType, callback, self) {
		if (listeners[eventType]) {
			listeners[eventType].push({func : callback, object : self});
		}
	}

	function off(eventType, callback) {
		if (listeners[eventType]) {
			var indexes = [];
		
			listeners[eventType].forEach(function (listener, index) {
				if (listener.func === callback) {
					indexes.unshift(index);
				}
			}, this);

			indexes.forEach(function (index) {
				listeners[eventType].splice(index, 1);
			}, this);
		}
	}

	function onmousedown(event) {
		data.left = (event.button === 0);
		data.middle = (event.button === 1);
		data.right = (event.button === 2);

		listeners.mousedown.forEach(function (listener) {
			listener.func.call(listener.object, event);
		});
	}

	function onmousemove(event) {
		data.x = event.layerX;
		data.y = event.layerY;
		data.moved = true;

		listeners.mousemove.forEach(function (listener) {
			listener.func.call(listener.object, event);
		});
	}

	function onmouseup(event) {
		data.left = !(event.button === 0);
		data.middle = !(event.button === 1);
		data.right = !(event.button === 2);

		listeners.mouseup.forEach(function (listener) {
			listener.func.call(listener.object, event);
		});
		listeners.click.forEach(function (listener) {
			listener.func.call(listener.object, event);
		});
	}

	attachedElement.addEventListener('mousedown', onmousedown);
	attachedElement.addEventListener('mousemove', onmousemove);
	attachedElement.addEventListener('mouseup', onmouseup);

	return data;
})();