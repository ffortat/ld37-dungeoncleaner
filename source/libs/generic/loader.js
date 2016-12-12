var load = (function() {
	var loading = [];
	var loaded = {};
	var callbacks = {};
	var listeners = {
		error : [],
		ready : []
	};
	var next = {
		error : [],
		ready : []
	};

	function checkready() {
		if (loading.length === 0) {
			listeners.ready.forEach(function (listener) {
				listener.func.call(listener.object);
			})

			var listener;
			while (next.ready.length > 0) {
				listener = next.ready.shift();
				listener.func.call(listener.object);
			}
		}
	}

	function setloaded(uri, data) {
		loading.some(function (waitinguri, index) {
			if (waitinguri === uri) {
				loading.splice(index, 1);
				return true;
			}
		});
		loaded[uri] = data;
		checkready();
	}

	function loadjson(uri, callback, self) {
		if (loaded[uri] === undefined) {
			if (loading.indexOf(uri) === -1) {
				loading.push(uri);
				callbacks[uri] = [{func : callback, object : self}];
				ajax.getJSON(uri, function (data) {
					setloaded(uri, data);
					callbacks[uri].forEach(function (cb) {
						if (cb.func) {
							cb.func.call(cb.object, data);
						}
					});
				});
			} else {
				callbacks[uri].push({func : callback, object : self});
			}
		} else {
			callback.call(self, loaded[uri]);
		}
	}

	function loadimage(uri, callback, self) {
		if (loaded[uri] === undefined) {
			if (loading.indexOf(uri) === -1) {
				loading.push(uri);
				callbacks[uri] = [{func : callback, object : self}];
				var image = new Image();
				image.addEventListener('load', function () {
					setloaded(uri, image);
					callbacks[uri].forEach(function (cb) {
						cb.func.call(cb.object, data);
					});
				});

				image.src = uri;
			} else {
				callbacks[uri].push({func : callback, object : self});
			}
		} else {
			callback.call(self, loaded[uri]);
		}
	}

	function loadaudio(uri, callback, self) {
		if (loaded[uri] === undefined) {
			if (loading.indexOf(uri) === -1) {
				loading.push(uri);
				callbacks[uri] = [{func : callback, object : self}];
				var audio = new Audio();
				audio.autoplay = false;
				audio.addEventListener('canplay', function () {
					setloaded(uri, audio);
					callbacks[uri].forEach(function (cb) {
						cb.func.call(cb.object, data);
					});
				});
				audio.src = uri;
			} else {
				callbacks[uri].push({func : callback, object : self});
			}
		} else {
			callback.call(self, loaded[uri]);
		}
	}

	function whenready(callback, self) {
		next.ready.push({func : callback, object : self});
		checkready();
	}

	function whenerror(callback, self) {
		next.error.push({func : callback, object : self});
	}

	function addlistener(eventType, callback, self) {
		if (listeners[eventType] && typeof(callback) === 'function') {
			listeners[eventType].push({func : callback, object : self});
		}
	}

	return {
		json : loadjson,
		image : loadimage,
		audio : loadaudio,
		ready : whenready,
		error : whenerror,
		on : addlistener
	}
})();