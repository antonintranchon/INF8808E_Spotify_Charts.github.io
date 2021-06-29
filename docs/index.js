'use strict'
import * as preproc from './scripts/preprocess.js'
import * as addons from './scripts/add-ons.js'

addons.setRegion("Anglophone")
addons.setBeginDate('2017-01-01');
addons.setEndDate('2017-01-31');
addons.generateCalendars();
addons.setMax(20);

document.getElementById("AmeriqueNord").addEventListener("click",  updateRegion.bind(this, "AmeriqueNord"));
document.getElementById("AmeriqueSud").addEventListener("click",  updateRegion.bind(this, "AmeriqueSud" ));
document.getElementById("EuropeNord").addEventListener("click",  updateRegion.bind(this, "EuropeNord"));
document.getElementById("EuropeOuest").addEventListener("click",  updateRegion.bind(this, "EuropeOuest"));
document.getElementById("EuropeEst").addEventListener("click",  updateRegion.bind(this, "EuropeEst"));
document.getElementById("OceanieAsie").addEventListener("click",  updateRegion.bind(this, "OceanieAsie"));
document.getElementById("Anglophone").addEventListener("click",  updateRegion.bind(this, "Anglophone"));
document.getElementById("max").addEventListener("click",  updateMax.bind(this));


updateAll();

function updateMax() {
	addons.setMax(document.getElementById('max').value);
	updateAll();
}

function updateAll() {
	preproc.getDataFinal(addons.getRegion(), addons.getBeginDate(), addons.getEndDate(), addons.getMax());
}
	
function updateRegion(region) {
	var clicked = document.getElementsByClassName("chosen");
	while (clicked.length) clicked[0].classList.remove("chosen");
	document.getElementById(region).classList.add("chosen")
	addons.setRegion(region);
	preproc.getDataFinal(region, addons.getBeginDate(), addons.getEndDate(), addons.getMax());
}