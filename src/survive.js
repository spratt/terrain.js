(function(){
    var width = window.innerWidth,
    height = window.innerHeight;

	var x = d3.scale.linear()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.linear()
		.domain([10, 115, 135, 155, 175, 205])
		.range(["#0a0", "#6c0", "#ee0", "#eb4", "#eb9", "#ebf"]);

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g");

	var heatmap = terrain(128, 128);

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

	function isoline(min) {
		return function(x, y) {
			return x >= 0 && y >= 0 && x < dx && y < dy && heatmap[y][x] >= min;
		};
	}

	function transform(point) {
		return [point[0] * width / dx, point[1] * height / dy];
	}
})();