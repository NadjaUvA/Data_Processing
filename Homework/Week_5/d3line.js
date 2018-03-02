d3.json("unempdata.json", function(error, data) {

	// return error if problem
	if (error) {
		return alert(error);
	}

	// convert data to array of numbers
	var data_array = [], count = 0;
	data.forEach(function(d) {
		console.log(d)
	});

});