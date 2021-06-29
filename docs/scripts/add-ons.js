
//import { timeYear, utcYear } from "https://d3js.org/d3.v5.js";
//import datepicker from "https://unpkg.com/js-datepicker/dist/datepicker.min.js"
import * as preproc from './preprocess.js'

var end_date, begin_date;
var currentRegion = "Anglophone";
var maxArtists = 25;


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
		dateSelected: new Date(2017, 1, 1),
		formatter: (input, date, instance) => {
			// This will display the date as `2019-01-01`.
			var y = date.getFullYear().toString();
			var mtemp = date.getMonth();
			mtemp += 1;
			var m = mtemp.toString()
			var d = date.getDate().toString();
			if(m<10){m='0'+m;}
			if(d<10){d='0'+d;}
			input.value = y + '-' + m + '-' + d;
		},
		onSelect: instance => {
			console.log(document.getElementById("start-picker").value) 
			setBeginDate(document.getElementById("start-picker").value);
		},
	})
const endDate = datepicker("#end-picker", 
	{ 	id: 1,
		minDate: new Date(2017, 1, 1),
		maxDate: new Date(2020, 11, 29),
		showAllDates: true,
		dateSelected: new Date(2017, 1, 31),
		onSelect: instance => {
			var date = document.getElementById("end-picker").value
			console.log(date);
			setEndDate(date);
			preproc.getDataFinal(getRegion(), getBeginDate(), new Date(date), getMax());
		},
		formatter: (input, date, instance) => {
			// This will display the date as `2019-01-01`.
			var y = date.getFullYear().toString();
			var mtemp = date.getMonth();
			mtemp += 1;
			var m = mtemp.toString()
			var d = date.getDate().toString();
			if(m<10){m='0'+m;}
			if(d<10){d='0'+d;}
			input.value = y + '-' + m + '-' + d;
		},
		overlayButton: 'Go!',
	})
}

export function setRegion(region) {
	currentRegion = region;
}
export function getRegion() {
	return currentRegion;
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

export function getMax() {
	return maxArtists;
}
export function setMax(max) {
	maxArtists = max;
}