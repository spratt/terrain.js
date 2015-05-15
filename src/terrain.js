(function() {
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
		a[xs][ym] = avg + randomOffset(variance);
		a[xm][ys] = avg + randomOffset(variance);
		a[xe][ym] = avg + randomOffset(variance);
		a[xm][ye] = avg + randomOffset(variance);
		// recurse
		var v = Math.ceil(variance / 2);
		ds(a, xs, ys, xm, ym, v);
		ds(a, xs, ym, xm, ye, v);
		ds(a, xm, ys, xe, ym, v);
		ds(a, xm, ym, xe, ye, v);
	};

	terrain = function(width, height) {
		// Build the array
		var a = [];
		for(var x = 0; x < width; ++x) {
			var col = new Uint8Array(new ArrayBuffer(height));
			// var col = new Array(height);
			// for(var y = 0; y < height; ++y) {
			// 	col[y] = 0;
			// }
			a.push(col);
		}
		// Set the corners
		a[0][0] = getRandomInt(0, 255);
		a[width-1][0] = getRandomInt(0, 255);
		a[0][height-1] = getRandomInt(0, 255);
		a[width-1][height-1] = getRandomInt(0, 255);
		// Diamond-Square
		ds(a, 0, 0, width-1, height-1, 255);
		return a;
	};
})();