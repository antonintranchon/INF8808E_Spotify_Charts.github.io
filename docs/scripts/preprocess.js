
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
  //console.log(abrev)
  return COUNTRIES[abrev];
}
export function getDataFinal(region, begin_date, end_date, type, search) {
  console.log(region + ".csv")
   d3.select('svg').selectAll('*').remove();
	d3.csv("./assets/data/"+ region + ".csv", function(error, data) {
		if (error) throw error;
		//--------------------Preprocess
		//Recuperer les dates dans le calendrier avant 
		var arrays = getData(treatFile(data, begin_date, end_date, type, search ));
      console.log(arrays)

		//console.log("les donnees sont : ", arrays)

		var view = "main";
			

		viz.setSize(arrays['x-axis'], arrays['y-axis'])
		viz.setScales()
		viz.viz(arrays['x-axis'], arrays['y-axis'], arrays['matrix'], arrays['streams'], view)
	});
}


export function treatFile(data, begin_date, end_date, type, search){
    var filteredData = data.filter(track => new Date(track.date) <= end_date && new Date(track.date) >= begin_date)
    if (type == 1) filteredData = data.filter(track => track.Artist === search)
    if (type == 2) filteredData = data.filter(track => track.region === search)
    //console.log(filteredData);
    //var compteur = 0
    var result  = Object.values(filteredData
        .reduce((acc, { Artist, Streams, region }) => {
          Streams = +Streams; // convert to number
          const key = Artist + '_' + region; // unique combination of Artist and region
          acc[key] = acc[key] || { Artist : Artist, Streams : Streams, region : region };
          acc[key].Streams += Streams;
          return acc;
        /*.reduce((a, item) => {
            console.log("a = ", a," and item = ", item)
            const {Artist, Streams, region} = item;
            if (!a[Artist] || a[Artist].Streams < Streams && a[region] === region) a[Artist] = {Artist: Artist, region: region, Streams: Streams};


            //if (!a[Artist]) a[Artist] = item
            //elif (a[Artist] && a[Artist][region])
            return a;*/
        }, {}));
        
    //result.forEach(d => d['Country'] = country_name)
    //if (country_name == 'Argentina') console.log("result pour Bolivia : ", result)
    //console.log("Result of treatFile : ", result)
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
    //console.log("streams = ", streams, "Pays = ", Pays, " compteur = ", compteur)
    //console.log(data)
    var artists = Array.from(new Set(data.flatMap(d => [d.artist])))
    //artists = artists.slice(0, 20);
    //console.log("artists = ", artists)
    var countries = Array.from(new Set(data.flatMap(d => [d.country])))
    //console.log("countries = ", countries)

    var ti = new Map(artists.map((artist, i) => [artist, i]));
    //console.log("ti = ", ti)
    
    const qi = new Map(countries.map((country, i) => [country, i]));  
    //console.log("qi = ", qi)
    
    var matrix = Array.from(ti, () => new Array(countries.length).fill(null));  
    for (const {artist, country, stream} of data) {
        
    //console.log(ti.get(artist),qi.get(country))
        //console.log("artist, country, stream = ", artist, country, stream)
        //console.log("ti.get(artist) = ", ti.get(artist))
        //console.log("qi.get(country) = ", qi.get(country))
        matrix[ti.get(artist)][qi.get(country)] = {rank: 0, stream: +stream, next: null};
    }
    //console.log(matrix);
    matrix.forEach((d) => {
        //console.log("d = ", d, "d.length - 1 = ", d.length - 1)
        for (let i = 0; i<d.length - 1; i++){
            if(d[i]!=null) d[i].next = d[i + 1];
            if (d[i]==null){
             // console.log("On est dans le cas où d[i] == null ! matrix.length+1 = ", matrix.length+1)
              d[i] = {rank : matrix.length+1 , stream : 0, next : null}
            }
        }
        if (d[d.length - 1]==null){
          //console.log("On est dans le cas où d[d.length - 1] == null ! matrix.length+1 = ", matrix.length+1)
          d[d.length - 1] = {rank : matrix.length+1 , stream : 0, next : null}
        }
    });
    
    countries.forEach((d, i) => {
        const array = [];
        matrix.forEach((d) => array.push(d[i]));
        array.sort((a, b) => b.stream - a.stream);
        array.forEach((d, j) => d.rank = j);
    });
    //matrix = matrix.slice(0, 8);
    //artists = artists.slice(0, 20);
    //-------------------------
    //const streams = [2, 5, 10, 7, 6, 13, 1, 4, 8, 9, 11, 12, 12]
    return {"x-axis": artists, "y-axis": countries, "matrix": matrix, "streams": streams}
}


/*Obtenir une structure : 
data = {
    'nom_pays_1':[{'Date_1' : [
                        {
                            Position : xxx1
                            Track Name: tn1
                            Artist : art1
                            Streams : str1
                            region : reg1
                            spotify_id : spo1
                        },
                        {
                            Position : xxx2
                            Track Name: tn2
                            Artist : art2
                            Streams : str2
                            region : reg2
                            spotify_id : spo2
                        }, ...
                    ] 
                 },
                 {'Date_2' : [
                        {
                            Position : xxx3
                            Track Name: tn3
                            Artist : art3
                            Streams : str3
                            region : reg3
                            spotify_id : spo3
                        },
                        {
                            Position : xxx4
                            Track Name: tn4
                            Artist : art4
                            Streams : str4
                            region : reg4
                            spotify_id : spo4
                        }, ...
                    ] 
                 }, ...
                ]

    'nom_pays_2': (...)
}
*/
