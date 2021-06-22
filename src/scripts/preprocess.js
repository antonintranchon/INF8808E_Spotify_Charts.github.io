const COUNTRIES={
    'ar': 'Argentina',
    'at': 'Austria',
    'au': 'Australia',
    'be': 'Belgium',
    'bo': 'Bolivia',
    'br': 'Brazil',
    'ca': 'Canada',
    'ch': 'Switzerland',
    'cl': 'Chile',
    'co': 'Colombia',
    'cr': 'Costa Rica',
    'cz': 'Czechia',
    'de': 'Germany',
    'dk': 'Denmark',
    'do': 'Dominican Republic',
    'ec': 'Ecuador',
    'es': 'Spain',
    'fi': 'Finland',
    'fr': 'France',
    'gb': 'United Kingdom',
    'gr': 'Greece',
    'gt': 'Guatemala',
    'hk': 'Hong Kong',
    'hn': 'Honduras',
    'hu': 'Hungary',
    'id': 'Indonesia',
    'ie': 'Ireland',
    'is': 'Iceland',
    'it': 'Italy',
    'jp': 'Japan',
    'lt': 'Lithuania',
    'lv': 'Latvia',
    'mx': 'Mexico',
    'my': 'Malaysia',
    'nl': 'Netherlands',
    'no': 'Norway',
    'nz': 'New Zealand',
    'pa': 'Panama',
    'ph': 'Philippines',
    'pl': 'Poland',
    'pt': 'Portugal',
    'py': 'Paraguay',
    'se': 'Sweden',
    'sg': 'Singapore',
    'sk': 'Slovakia',
    'sv': 'El Salvador',
    'tr': 'Turkey',
    'tw': 'Taiwan',
    'us': 'United States',
    'uy': 'Uruguay'
}

var folder = 'C:\\Users\\anton\\Desktop\\Cours\\E21 Poly\\INF8808E_2021_Public\\git\\Projet\\dataset\\'

export function getData() {
    console.log("Debut du getData")
    var file_data = {}

    Object.entries(COUNTRIES).forEach(country=>{
        var file = country[0] + '.csv'
        //console.log(file)

        d3.csv(file, function (error, data) {
            if (error) throw error;
            //console.log("On est dans le fichier ! ")
            //console.log("data = ", data)
            var data_country = {}
            data.forEach(element=>{
                var date = element['date']
                if (!(date in data_country)){
                    data_country[date]=[]
                }
                var current_track = {"Position" : element['Position'],
                                "Track Name": element['Track Name'],
                                "Artist": element["Artist"],
                                "Streams": element["Streams"],
                                "date": element["date"],
                                "region": element["region"],
                                "spotify_id": element["spotify_id"]
                            }
                data_country[date].push(current_track)
            })
            file_data[COUNTRIES[country[0]]] = data_country
        })
    })

    console.log("data = ", file_data)
    console.log("data[Germany] = ", file_data['Germany'])
    console.log("Fin du preprocess")
    return file_data;


}

export function getCountryData(date_begin, date_end, id) {
//export function getCountryData(date_begin, date_end, data, id) {
    //Renvoie le tableau des 20 meilleurs artistes 
    var file = '../data/' + country[id] + '.csv';

    
    d3.csv(file, d3.autoType).then(function (data) {
        
    })
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