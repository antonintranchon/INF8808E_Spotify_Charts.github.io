
import * as viz from './viz.js'
const COUNTRIES={
    'ar': 'Argentina', // Amerique Sud
    'at': 'Austria', // Europe 
    'au': 'Australia', // Oceanie Asie
    'be': 'Belgium', // Europe
    'bo': 'Bolivia', // Amerique Sud
    'br': 'Brazil', // Amerique Sud
    'ca': 'Canada', // Amerique Nord
    'ch': 'Switzerland', // Europe
    'cl': 'Chile', // Amerique Sud
    'co': 'Colombia', // Amerique Sud
    'cr': 'Costa Rica', // Amerique Nord
    'cz': 'Czechia', // Europe
    'de': 'Germany', // Europe
    'dk': 'Denmark', // Europe Scan
    'do': 'Dominican Republic', // Amerique Sud
    'ec': 'Ecuador', // Amerique Sud
    'es': 'Spain', // Europe 
    'fi': 'Finland', //Europe Scan
    'fr': 'France', // Europe 
 // Europe
    'gb': 'United Kingdom',
 // Europe
    'gr': 'Greece',
 // Europe
    'gt': 'Guatemala',
 // Amerique Nord
    'hk': 'Hong Kong',
 // Asi
    'hn': 'Honduras',
 // Amrique Nord
    'hu': 'Hungary',
 // Europe
    'id': 'Indonesia',
 // Oceanie Asie
    'ie': 'Ireland',
 // Europe Scan
    'is': 'Iceland',
 // Europe
    'it': 'Italy',
 // Europe
    'jp': 'Japan',
 // Oceanie Asie
    'lt': 'Lithuania',
 // Europe
    'lv': 'Latvia',
 // Europe
    'mx': 'Mexico',
 // Amerique Nord    
  'my': 'Malaysia',
 // Oceanie Asie
    'nl': 'Netherlands',
 // Europe  Scan
    'no': 'Norway',
 // Europe
    'nz': 'New Zealand',
 // Oceanie Asie
    'pa': 'Panama',
 // Amerique Nord
    'ph': 'Philippines',
 // Oceanie Asie
    'pl': 'Poland',
 // Europe
    'pt': 'Portugal',
 // Europe
    'py': 'Paraguay',
 // Amerique Sud 
    'se': 'Sweden',
 // Europe
    'sg': 'Singapore',
 // Oceanie Asie
    'sk': 'Slovakia',
 // Europe
    'sv': 'El Salvador',
 // Amerique Nord
    'tr': 'Turkey',
 // Europe
    'tw': 'Taiwan',
 // Oceanie Asie 
    'us': 'United States',
 // Amerique Nord
    'uy': 'Uruguay',
 // Amerique Sud

}

export function getName(abrev){
   return COUNTRIES[abrev];
 }

 export function getDataFinal(region, begin_date, end_date, max) {
  console.log(region + ".csv")
   d3.select('svg').selectAll('*').remove();
	d3.csv(region + ".csv", function(error, data) {
		if (error) throw error;
		//--------------------Preprocess
		//Recuperer les dates dans le calendrier avant 
		var arrays = getData(treatFile(data, begin_date, end_date ));
     		console.log("clicked arrays =", arrays)

		viz.setSize(max, arrays['y-axis'])
		viz.setScales()
		viz.viz(arrays['x-axis'], arrays['y-axis'], arrays['matrix'], arrays['streams'])
	});
}


export function treatFile(data, begin_date, end_date){
   var filteredData = data.filter(track => new Date(track.date) <= end_date && new Date(track.date) >= begin_date)
   var result  = Object.values(filteredData
       .reduce((acc, { Artist, Streams, region }) => {
         Streams = +Streams; // convert to number
         const key = Artist + '_' + region; // unique combination of Artist and region
         acc[key] = acc[key] || { Artist : Artist, Streams : Streams, region : region };
         acc[key].Streams += Streams;
         return acc;
       }, {}));
       
   return result;
}



export function getData(data_){
   
   var data = [];
   var streams =[];
   var Pays = {};
   var compteur = 0;
   data_.forEach((d) => {
       var dObj = {artist: d.Artist, country: COUNTRIES[d.region]/*.substring(0,3)*/, stream: d.Streams /*.toString()*/};
       data.push(dObj);

       if (!(d.region in Pays)){
         Pays[d.region] = compteur;
         compteur ++;
         streams.push(parseInt(d.Streams))
       }
       else {
         var indice = Pays[d.region]
         streams[indice] += parseInt(d.Streams)
       }
   })
   
   var artists = Array.from(new Set(data.flatMap(d => [d.artist])))
   
   var countries = Array.from(new Set(data.flatMap(d => [d.country])))

   var ti = new Map(artists.map((artist, i) => [artist, i]));
   
   const qi = new Map(countries.map((country, i) => [country, i]));  
   
   var matrix = Array.from(ti, () => new Array(countries.length).fill(null));  

   for (const {artist, country, stream} of data) {
       matrix[ti.get(artist)][qi.get(country)] = {rank: 0, stream: +stream, next: null};
   }

   matrix.forEach((d) => {
      
       for (let i = 0; i<d.length - 1; i++){
           if(d[i]!=null) d[i].next = d[i + 1];
           if (d[i]==null){
             d[i] = {rank : matrix.length+1 , stream : 0, next : null}
           }
       }
       if (d[d.length - 1]==null){
         d[d.length - 1] = {rank : matrix.length+1 , stream : 0, next : null}
       }
   });
   
   countries.forEach((d, i) => {
       const array = [];
       matrix.forEach((d) => array.push(d[i]));
       array.sort((a, b) => b.stream - a.stream);
       array.forEach((d, j) => d.rank = j);
   });
   return {"x-axis": artists, "y-axis": countries, "matrix": matrix, "streams": streams}
}
