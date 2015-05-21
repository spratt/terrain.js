(function() {
	var terrain = window.terrain || {};

	terrain.types = {
		'sea' : {
			min: 0,
			color: '#006'
		},
		'pool' : {
			min: 15,
			color: '#06a'
		},
		'beach' : {
			min: 70,
			color: '#0a6'
		},
		'grass' : {
			min: 110,
			color: '#0a0'
		},
		'forest' : {
			min: 180,
			color: '#290'
		},
		'jungle' : {
			min: 240,
			color: '#360'
		}
	};

	terrain.color_domain = Object.keys(terrain.types).map(function(key) { return terrain.types[key].min; });
	terrain.color_range = Object.keys(terrain.types).map(function(key) { return terrain.types[key].color; });
	
	// Generates elevation by the Diamond-Square Algorithm
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function randomOffset(variance) {
		return getRandomInt(-variance, variance);
	}

	function ds(a, xs, ys, xe, ye, variance) {
		if(xs >= (xe - 1) && ys >= (ye - 1)) return;
		// grab the corners
		var corners = [];
		corners.push(a[xs][ys]);
		corners.push(a[xs][ye]);
		corners.push(a[xe][ys]);
		corners.push(a[xe][ye]);
		// average
		var sum = 0;
		corners.forEach(function(i){sum += i;});
		var avg = Math.floor(sum / 4);
		// min
		var min = corners[0];
		corners.forEach(function(i){if(i < min) min = i;});
		// max
		var max = corners[0];
		corners.forEach(function(i){if(i > max) max = i;});
		// midpoints
		var xm = Math.floor((xs + xe)/2);
		var ym = Math.floor((ys + ye)/2);
		// set value of diamond midpoint
		a[xm][ym] = avg + randomOffset(variance);
		// set value of square midpoints
		a[xs][ym] = Math.floor((a[xs][ys] + a[xs][ye])/2);
		a[xm][ys] = Math.floor((a[xs][ys] + a[xe][ys])/2);
		a[xe][ym] = Math.floor((a[xe][ys] + a[xe][ye])/2);
		a[xm][ye] = Math.floor((a[xs][ye] + a[xe][ye])/2);
		// recurse
		var v = Math.ceil(variance / 2);
		ds(a, xs, ys, xm, ym, v);
		ds(a, xs, ym, xm, ye, v);
		ds(a, xm, ys, xe, ym, v);
		ds(a, xm, ym, xe, ye, v);
	};

	terrain.gen = function(width, height) {
		// Build the array
		var a = [];
		for(var x = 0; x < width; ++x) {
			//var col = new Uint8Array(new ArrayBuffer(height));
			var col = new Array(height);
			a.push(col);
		}
		// Set the corners
		a[0][0] = getRandomInt(0, 255);
		a[width-1][0] = getRandomInt(0, 255);
		a[0][height-1] = getRandomInt(0, 255);
		a[width-1][height-1] = getRandomInt(0, 255);
		// Diamond-Square
		ds(a, 0, 0, width-1, height-1, 127);
		return a;
	};

	window.terrain = terrain;
})();