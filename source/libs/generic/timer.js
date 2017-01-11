function Timer(duration, speed) {
	this.duration = duration ? duration : 5;
	this.speed = speed ? speed : 1;

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

Timer.prototype.tick = function () {
	if (this.listeners['tick']) {
		this.listeners['tick'].forEach(function (listener) {
			listener.func.call(listener.object, Math.ceil(this.timer));
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

Timer.prototype.IsRunning = function () {
	return this.timer !== 0;
}

Timer.prototype.Stop = function () {
	this.timer = 0;
	this.end();
}

Timer.prototype.Tick = function (length) {
	if (this.timer) {
		var oldTime = this.timer;
		this.timer -= length * this.speed;

		if (Math.ceil(this.timer) < Math.ceil(oldTime)) {
			this.tick();
		}

		if (this.timer <= 0) {
			this.timer = 0;
			this.end();
		}
	}
}