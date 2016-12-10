var ajax = {
	get : function (url, callback) {
		var xhr = new XMLHttpRequest();
		
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				callback(xhr.responseText);
			}
		}
		
		xhr.open('GET', url, true);
		xhr.send(null);
	},
	getJSON : function (url, callback) {
		ajax.get(url, function (data) {
			callback(JSON.parse(data));
		});
	},
	post : function (url, data, callback) {
		var xhr = new XMLHttpRequest();
		var datastr = '';
		
		for (var key in data) {
			datastr += key + '=' + data[key] + '&';
		}
		datastr = datastr.substring(0, datastr.length - 1);
		
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				callback(xhr.responseText);
			}
		}
		
		xhr.open('POST', url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(datastr);
	}
}
