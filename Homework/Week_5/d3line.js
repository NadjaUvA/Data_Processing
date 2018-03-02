d3.json("unempdata.json", function(error, data) {

	// return error if problem arrises
	if (error) {
		return alert(error);
	}

	// select the two years from the data object
	var year2008 = [], year2017 = [];
	data.forEach(function(d) {
		year2008 = d["year2008"];
		year2017 = d["year2017"];
	});

	// save data from object in arrays
	var men2008 = year2008["men2008"];
	var women2008 = year2008["women2008"];
	var youthmen2008 = year2008["youthmen2008"];
	var youthwomen2008 = year2008["youthwomen2008"]
	var men2017 = year2017["men2017"];
	var women2017 = year2017["women2017"];
	var youthmen2017 = year2017["youthmen2017"];
	var youthwomen2017 = year2017["youthwomen2017"]

	// convert strings to numbers
	for (var i = 0, n = 12; i < n; i++) {
		men2008[i] = +men2008[i];
		women2008[i] = +women2008[i];
		youthmen2008[i] = +youthmen2008[i];
		youthwomen2008[i] = +youthwomen2008[i];
		men2017[i] = +men2017[i];
		women2017[i] = +women2017[i];
		youthmen2017[i] = +youthmen2017[i];
		youthwomen2017[i] = +youthwomen2017[i];
	};

	// create array with names of months for plot
	var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep",
		"oct", "nov", "dec"];
});