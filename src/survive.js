(function(){
	var width = window.innerWidth,
    height = window.innerHeight;

	var x = d3.scale.linear()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.linear()
		.domain(terrain.color_domain)
		.range(terrain.color_range);

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);
	
	var size = 257,
	heatmap = terrain.gen(size, size);

	var dx = heatmap[0].length,
    dy = heatmap.length;

	x.domain([0, dx]);
	y.domain([0, dy]);

	svg.selectAll(".isoline")
		.data(color.domain().map(isoline))
		.enter().append("path")
	    .datum(function(d) { return d3.geom.contour(d).map(transform); })
		.attr("class", "isoline")
		.attr("d", function(d) { return "M" + d.join("L") + "Z"; })
		.style("fill", function(d, i) { return color.range()[i]; });

	var player = {
		x : Math.floor(size/2),
		y : Math.floor(size/2)
	};
	
	player.symbol = svg.append("circle")
		.attr('r', 3)
		.attr('fill', '#f00');

	player.sety = function() {
		player.y = player.y < 0 ? 0 : player.y;
		player.y = player.y >= size ? size - 1 : player.y;
		var y = (player.y + 0.8) / size * height;
		player.symbol.attr('cy', y);
	};
	player.setx = function() {
		player.x = player.x < 0 ? 0 : player.x;
		player.x = player.x >= size ? size - 1 : player.x;
		var x = (player.x + 0.5) / size * width;
		player.symbol.attr('cx', x);
	};

	player.sety();
	player.setx();
	
	player.down = function() { player.y += 1; return player.sety(); };
	player.up = function() { player.y -= 1; return player.sety(); };
	player.right = function() { player.x += 1; return player.setx(); };
	player.left = function() { player.x -= 1; return player.setx(); };

	document.body.addEventListener('keydown', function(event) {
		event = event || window.event;
		var keyCode = event.keyCode;

		if (isArrowKey(keyCode)) {
			event.preventDefault();
			player[getArrowKeyDirection(keyCode)]();
		}
	});

	function isoline(min) {
		return function(x, y) {
			return x >= 0 && y >= 0 && x < dx && y < dy && heatmap[y][x] >= min;
		};
	}

	function transform(point) {
		return [point[0] * width / dx, point[1] * height / dy];
	}

	// input
	function getArrowKeyDirection (keyCode) {
		return {
			37: 'left',
			39: 'right',
			38: 'up',
			40: 'down'
		}[keyCode];
	}

	function isArrowKey (keyCode) {
		return !!getArrowKeyDirection(keyCode);
	}
})();
