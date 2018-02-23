// set width and height of chart and bars
var barWidth = 25; 
var width = 517, height = 400;


var margin = {top: 30, right: 40, bottom: 30, left: 40},
			inner_width = width - margin.left - margin.right,
			inner_height = height - margin.top - margin.bottom;

var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// define functions to scale width and height
var y = d3.scale.linear()
	.range([inner_height, 0]);

var x = d3.scale.ordinal()
	.domain(months)
	.rangeRoundBands([0, inner_width], 0.1);
	// .rangeBands([0, barWidth]);

d3.json("data.json", function(error, data) {

	// return error if problem
	if (error) {
		return alert(error);
	}
	else {

		// convert data to array of numbers
		var data_array = [];
		for (var i = 0, n = Object.keys(data).length; i < n; i++) {
			data_array[i] = +data[months[i]];
		};

		// define domain of data values
		y.domain([0, d3.max(data_array, function(d) { return d; })]);
		// x.domain(data_array.map(function(d) { return d.name; }));

		// select class of the bar chart and set attributes
		var chart = d3.select(".chart")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// join data with the bars of chart
		var bar = chart.selectAll('g')
			.data(data_array)
			.enter().append("g")
			.attr("transform", function(d, i) {return "translate(" + 1.5 * i * barWidth + "," + 0 + ")"} );

		// create rectangles for bars
		bar.append("rect")
			.attr("y", function(d) { return y(d); })
			.attr("width", barWidth)
			.attr("height", function(d) { return inner_height - y(d); });

		// add text to bars
		bar.append("text")
			.attr("x", barWidth / 2)
			.attr("y", function(d) { return y(d) + 3 })
			.attr("dy", ".75em")
			.text(function(d) { return d; });

		
		var xAxis = d3.svg.axis()
			.scale(x)
			.tickSize(1)
			.tickPadding(13)
				.tickValues(months)
			.orient("bottom");

		// add axes
		d3.select(".chart").append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(" + margin.left + "," + (inner_height + margin.top) + ")")
			.call(xAxis);

	}
});