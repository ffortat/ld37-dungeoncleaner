function Timer(duration) {
	this.duration = duration ? duration : 5;

	this.timer = 0;

	this.listeners = {};
}

Timer.prototype.on = function (eventType, callback, self) {
	if (!this.listeners[eventType]) {
		this.listeners[eventType] = [];
	}

	this.listeners[eventType].push({func : callback, object : self});
}

Timer.prototype.off = function(eventType, callback) {
	var indexes = [];

	if (!this.listeners[eventType]) {
		this.listeners[eventType] = [];
	}

	this.listeners[eventType].forEach(function (listener, index) {
		if (listener.func === callback) {
			indexes.unshift(index);
		}
	}, this);

	indexes.forEach(function (index) {
		this.listeners[eventType].splice(index, 1);
	}, this);
}

Timer.prototype.start = function () {
	if (this.listeners['start']) {
		this.listeners['start'].forEach(function (listener) {
			listener.func.call(listener.object);
		}, this);
	}
}

Timer.prototype.end = function () {
	if (this.listeners['end']) {
		this.listeners['end'].forEach(function (listener) {
			listener.func.call(listener.object);
		}, this);
	}
}

Timer.prototype.Start = function () {
	this.timer = this.duration;
	this.start();
}

Timer.prototype.Tick = function (length) {
	if (this.timer) {
		this.timer -= length;

		if (this.timer <= 0) {
			this.timer = 0;
			this.end();
		}
	}
}