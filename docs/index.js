'use strict'
import * as helper from './scripts/helper.js'
import * as scales from './scripts/scales.js'
import * as viz from './scripts/viz.js'
import * as tooltip from './scripts/tooltip.js'
import * as legend from './scripts/legend.js'
import * as preproc from './scripts/preprocess.js'
import * as addons from './scripts/add-ons.js'
import d3Tip from 'd3-tip'


addons.generateCalendars();
addons.setBeginDate('2017-01-01');
addons.setEndDate('2020-01-31');

document.getElementById("na").addEventListener("click",  updateData.bind(this, "AmeriqueNord"));
document.getElementById("sa").addEventListener("click",  updateData.bind(this, "AmeriqueSud" ));
document.getElementById("sc").addEventListener("click",  updateData.bind(this, "EuropeNord"));
document.getElementById("we").addEventListener("click",  updateData.bind(this, "EuropeOuest"));
document.getElementById("ee").addEventListener("click",  updateData.bind(this, "EuropeEst"));
document.getElementById("ao").addEventListener("click",  updateData.bind(this, "OceanieAsie"));
document.getElementById("an").addEventListener("click",  updateData.bind(this, "Anglophone"));

//getData();
function getData() {
	d3.csv("data.csv", function(error, data) {
		if (error) throw error;

		//--------------------Preprocess
		var arrays = preproc.getData(data);
		console.log("les donnees sont : ", arrays)
		
		
		var view = "main";
		
		/*d3.select("body").append("svg")
			.attr("cursor", "default")
			.attr("viewBox", [0, 0, arrays['y-axis'].length*80,  arrays['x-axis'].length*80]);
			
			*/
		viz.setSize(arrays['x-axis'], arrays['y-axis'])
		viz.setScales()
		viz.viz(arrays['x-axis'], arrays['y-axis'], arrays['matrix'], arrays['streams'], view)
		//updateData();
	});

}


updateData("AmeriqueNord");	
function updateData(region) {
	preproc.getDataFinal(region, addons.getBeginDate(), addons.getEndDate(), 0, "ca");
}


//preproc.getDataFinal("do", addons.getBeginDate(), addons.getEndDate(), 0, "ca");

//var result = preproc.getDataArtist()


	
    //var data_file = preproc.getData();


// (function (d3) {
//   const margin = {
//     top: 75,
//     right: 200,
//     bottom: 100,
//     left: 80
//   }

//   let currentYear = 2000

//   let svgSize, graphSize

//   setSizing()

//   const g = helper.generateG(margin)

//   const tip = d3Tip().attr('class', 'd3-tip').html(function (d) { return tooltip.getContents(d) })
//   g.call(tip)

//   helper.appendAxes(g)
//   helper.appendGraphLabels(g)
//   helper.placeTitle(g, graphSize.width)

//   viz.positionLabels(g, graphSize.width, graphSize.height)

//   helper.drawButton(g, currentYear === 2000 ? 2015 : 2000, graphSize.width)

//   d3.json('./countriesData.json').then((data) => {
//     const radiusScale = scales.setRadiusScale(data)
//     const colorScale = scales.setColorScale(data)
//     const xScale = scales.setXScale(graphSize.width, data)
//     const yScale = scales.setYScale(graphSize.height, data)

//     helper.drawXAxis(xScale, graphSize.height)
//     helper.drawYAxis(yScale)

//     legend.drawLegend(colorScale, g, graphSize.width)

//     build(data, 0, currentYear, radiusScale, colorScale, xScale, yScale)

//     viz.setCircleHoverHandler(tip)

//     setClickHandler()

//     /**
//      *   Sets up the click handler for the button.
//      */
//     function setClickHandler () {
//       d3.select('.button')
//         .on('click', () => {
//           const previousYear = currentYear
//           currentYear = (currentYear === 2000 ? 2015 : 2000)
//           build(data, 1000, currentYear, radiusScale, colorScale, xScale, yScale)
//           d3.select('.button').select('.button-text').text('See ' + previousYear + ' dataset')
//         }
//         )
//     }
//   })

//   /**
//    *   This function handles the graph's sizing.
//    */
//   function setSizing () {
//     svgSize = {
//       width: 1000,
//       height: 600
//     }

//     graphSize = {
//       width: svgSize.width - margin.right - margin.left,
//       height: svgSize.height - margin.bottom - margin.top
//     }

//     helper.setCanvasSize(svgSize.width, svgSize.height)
//   }

//   /**
//    * This function builds the graph.
//    *
//    * @param {object} data The data to be used
//    * @param {number} transitionDuration The duration of the transition while placing the circles
//    * @param {number} year The year to be displayed
//    * @param {*} rScale The scale for the circles' radius
//    * @param {*} colorScale The scale for the circles' color
//    * @param {*} xScale The x scale for the graph
//    * @param {*} yScale The y scale for the graph
//    */
//   function build (data, transitionDuration, year, rScale, colorScale, xScale, yScale) {
//     viz.drawCircles(data[year], rScale, colorScale, xScale, yScale, tip)
//     viz.moveCircles(xScale, yScale, transitionDuration)
//     viz.setTitleText(year)
//   }
// })(d3)
