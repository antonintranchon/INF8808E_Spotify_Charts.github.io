import datepicker from 'js-datepicker'
//import * as preproc from './preprocess.js'
//import * as datepicker from './datepicker.min.js'

var end_date, begin_date;
var currentRegion = "Anglophone";

export function setRegion(region) {
	currentRegion = region;
}
export function getRegion() {
	return currentRegion;
}
/**
 * Generates the SVG element g which will contain the data visualisation.
 *
 * @returns {*} The d3 Selection for the created g element
 */
export function generateCalendars () {
  const startDate = datepicker("#start-picker", 
	{ 	id: 1,
		minDate: new Date(2017, 1, 1),
		maxDate: new Date(2020, 11, 29),
		showAllDates: true,
		//defaultView: 'overlay',
		//overlayPlaceholder: 'Years between 2017-2020',
		dateSelected: new Date(2017, 1, 1),
		formatter: (input, date, instance) => {
			// This will display the date as `2019-01-01`.
			var y = date.getFullYear().toString();
			var m = date.getMonth().toString();
			var d = date.getDay().toString();
			if(m<10){m='0'+m;}
			if(d<10){d='0'+d;}
			input.value = y + '-' + m + '-' + d;
		},
		onSelect: instance => {
			console.log(document.getElementById("start-picker").value) 
			document.getElementById("startDate").innerHTML = instance.dateSelected.toDateString();
			setBeginDate(document.getElementById("start-picker").value);
		},
	})
	var x=new Date(2019,1,1);
	console.log(x.getFullYear().toString());
const endDate = datepicker("#end-picker", 
	{ 	id: 1,
		minDate: new Date(2017, 1, 1),
		maxDate: new Date(2020, 11, 29),
		showAllDates: true,
		//defaultView: 'overlay',
		//overlayPlaceholder: 'Years between 2017-2020',
		dateSelected: new Date(2017, 1, 31),
		onSelect: instance => {
			console.log(document.getElementById("end-picker").value) 
			document.getElementById("endDate").innerHTML = instance.dateSelected.toDateString();
			setEndDate(document.getElementById("end-picker").value);
		},
		formatter: (input, date, instance) => {
			// This will display the date as `2019-01-01`.
			var y = date.getFullYear().toString();
			var m = date.getMonth().toString();
			var d = date.getDay().toString();
			if(m<10){m='0'+m;}
			if(d<10){d='0'+d;}
			input.value = y+'-'+m+'-'+d;
			//(instance.dateSelected);
		},
		overlayButton: 'Go!',
	})
}

// Search
export function filterFunction() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	div = document.getElementById("myDropdown");
	a = div.getElementsByTagName("a");
	for (i = 0; i < a.length; i++) {
	  txtValue = a[i].textContent || a[i].innerText;
	  if (txtValue.toUpperCase().indexOf(filter) > -1) {
		a[i].style.display = "";
	  } else {
		a[i].style.display = "none";
	  }
	}
}
export function setBeginDate(date) {
	begin_date = new Date(date)
}
export function setEndDate(date) {
	end_date = new Date(date)
}

export function getBeginDate() {
	return begin_date
}
export function getEndDate() {
	return end_date
}