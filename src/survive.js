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
	
	var size = 513,
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
		x : 100,
		y : 100
	};

	
	player.symbol = svg.append("circle")
		.attr('cx', player.x)
		.attr('cy', player.y)
		.attr('r', 10)
		.attr('fill', '#f00');

	player.sety = function() { player.symbol.attr('cy', player.y); return false; };
	player.setx = function() { player.symbol.attr('cx', player.x); return false; };
	
	player.down = function() { player.y += 10; return player.sety(); };
	player.up = function() { player.y -= 10; return player.sety(); };
	player.right = function() { player.x += 10; return player.setx(); };
	player.left = function() { player.x -= 10; return player.setx(); };

	document.body.addEventListener('keydown', function(event) {
		event = event || window.event;
		var keyCode = event.keyCode;

		if (isArrowKey(keyCode)) {
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
