angular.module('starter.services', ['firebase'])
  .factory("Auth", ["$firebaseAuth", "$rootScope",
  function ($firebaseAuth, $rootScope) {
        var ref = new Firebase(firebaseUrl);
        return $firebaseAuth(ref);
}])



.factory('TravelService', function($http) {
  var api = {
    privateKey: 's5yxpoASY8fjSV9lmMHPbQdQQGokbBBk',
    baseUrl: 'https://api.sandbox.amadeus.com/v1.2/',

    //
    // Get flight inspiration information. 
    // required that you provide destination. 
    // Any extra information should be packed in the 'extra' parameter 
    // extra = {destination: ~~~, duration~~~, one_way: ~~, direct: ~~, maxPrice: ~~}
    //
    flightInspiration: function(callback, origin, departure_date, extra){
      var url = api.baseUrl+"flights/inspiration-search?apikey="+api.privateKey+"&origin="+origin;

      var dateString = departure_date.toISOString().substring(0,10);
      url+="&departure_date="+dateString;

      if(extra && extra.destination){
        url+="&destination="+extra.destination;
      }
    
      if(extra && extra.one_way){
        url+="&one-way="+extra.one_way;
      }
      if(extra && extra.direct){
        url+="&direct="+extra.direct;
      }
      if(extra && extra.maxPrice){
        url+="&max_price="+extra.maxPrice;
      }

      if(extra && extra.duration && extra.duration!=0){
        url+="&duration="+extra.duration;
      }

      $http({
        method: 'GET',
        url: url
      }).then(function successCallBack(response) {
          callback(response);   
      }, function errorCallback(response){
          console.log(response);
      });

    },

    nearestAirport: function(callback,lat, lon){
      var url = api.baseUrl+"airports/nearest-relevant?apikey="+api.privateKey+"&latitude="+lat+"&longitude="+lon;

      $http({
        method: 'GET',
        url: url
      }).then(function successCallBack(response) {
          callback(response);   
      }, function errorCallback(response){
          console.log(response);
      });

    },

    airportAutocomp: function(callback,term){
      var url = api.baseUrl+"airports/autocomplete?apikey="+api.privateKey+"&term="+term;
      $http({ method: 'GET', url: url
      }).then(function successCallBack(response) {
          callback(response);   
      }, function errorCallback(response){
          console.log(response);
      });
    }

  }
  var data = {
    budget: 1503,
    dateDepart: new Date(),
    airportString: "New York",
    possibleAirports: [],
    selectedAirport: "",
    duration: 0,
    uid: -1
  } 

   var loc = '{"DFW":"Dallas , Fort Worth International Airport","MIA":"Miami International Airport","CHI":"Chicago","CLT":"Charlotte Douglas International Airport","ATL":"Hartsfield–Jackson Atlanta International Airport","ORD":"Chicago OHare International Airport","MYR":"Myrtle Beach International Airport","BTV":"Burlington International Airport","YYZ":"Toronto Pearson International Airport","CAE":"Columbia Metropolitan Airport","SAV":"Savannah International Airport","ABQ":"Albuquerque International Airport","CMH":"Port Columbus International Airport","YTO":"Toronto","DTT":"Detroit","SFO":"San Francisco International Airport","JAX":"Jacksonville International Airport","DTW":"Detroit Metropolitan Wayne County Airport","ILM":"Wilmington International Airport","CUN":"Cancún International Airport","MDW":"Chicago Midway Airport","PUJ":"Punta Cana International Airport","PWM":"Portland International Jetport","SYR":"Syracuse Hancock International Airport","MHT":"Manchester Airport","BUF":"Greater Buffalo International Airport","YMQ":"Montréal","YUL":"Montréal–Pierre Elliott Trudeau International Airport","PHX":"Phoenix Sky Harbor International Airport","PSP":"Palm Springs International Airport","YRL":"Red Lake, Ont.","YHZ":"Halifax International Airport","SLC":"Salt Lake City International Airport","JED":"Jeddah King Abdul Aziz International Airport","CLO":"Cali / Alfonso Bonillaaragon","MCO":"Orlando International Airport","DEN":"Denver International Airport","PEI":"Pereira , Matecana","RNO":"Reno , Tahoe International Airport","EYW":"Key West International Airport","SMF":"Sacramento International Airport","MOW":"Moscow","TPA":"Tampa International Airport","MSY":"Louis Armstrong New Orleans International Airport","DAY":"James M Cox Dayton International Airport","CWB":"Curitiba Aeroporto","SKB":"Golden Rock Airport","CAN":"Guangzhou","BOI":"Boise Airport","GND":"Maurice Bishop International Airport","STL":"Lambert–St. Louis International Airport","LGB":"Long Beach Airport (Daugherty Field)","SRQ":"Sarasota , Bradenton International Airport","PIT":"Pittsburgh International Airport","YWG":"Winnipeg J. A. Richardson International Airport","SAT":"San Antonio International Airport","MSQ":"Minsk National Airport","OAK":"Metropolitan Oakland International Airport","YVR":"Vancouver International Airport","PNS":"Pensacola International Airport","ZFN":"Tulita Airport","BNA":"Nashville International Airport","KIV":"Chisinau International Airport","VNO":"Vilnius International Airport","LUX":"Luxembourg Findel Airport","TLL":"Tallinn Airport","ALA":"Almaty","RIX":"Riga International Airport","BHM":"Birmingham–Shuttlesworth International Airport","AVL":"Asheville Regional Airport","LAX":"Los Angeles International Airport","HKG":"Hong Kong International Airport","ANC":"Anchorage International Airport","ODS":"Odessa International Airport","PSA":"Pisa , S. Giusto","PRG":"Prague Václav Havel Airport","TRN":"Turin Caselle Airport","GOI":"Goa International Airport","SVD":"Arnos Vale","GEG":"Spokane International Airport","BLQ":"Bologna Guglielmo Marconi Airport","CTA":"Catania–Fontanarossa Airport","AMS":"Amsterdam Airport Schiphol","VCE":"Venice Marco Polo Airport","BUD":"Budapest Ferenc Liszt International Airport","MIL":"Milano","BOO":"Bodø Airport","YEA":"Edmonton","LRM":"La Romana International Airport","LYS":"Lyon–Saint Exupéry Airport","WAW":"Warsaw Chopin Airport","AGP":"Málaga Airport","ROM":"Rome","VLC":"Valencia Airport","BIO":"Bilbao Airport","BEG":"Belgrade Nikola Tesla Airport","SKP":"Skopje Alexander the Great Airport","LCA":"Larnaca International Airport","STO":"Stockholm","PAR":"Paris","PDX":"Portland International Airport","MAD":"Adolfo Suárez Madrid–Barajas Airport","HAM":"Hamburg Airport","TUS":"Tucson International Airport","MRS":"Marseille Provence Airport","SZG":"Salzburg Airport","VIE":"Vienna International Airport","SJJ":"Sarajevo Airport","BRE":"Bremen Airport","SOF":"Sofia Airport","TXL":"Berlin Tegel Airport","DUS":"Düsseldorf International Airport","OSL":"Oslo Airport, Gardermoen","TBS":"Tbilisi International Airport","DXB":"Dubai International Airport","MUC":"Munich International Airport","ZAG":"Zagreb Airport","CPH":"Copenhagen Airport","AUH":"Abu Dhabi International Airport","WUH":"Wuhan Tianhe International Airport","LJU":"Ljubljana Jože Pucnik Airport","PVG":"Shanghai Pudong International Airport","PRN":"Pristina International Airport (PIA)","ATH":"Athens Eleftherios Venizelos International Airport","DOH":"Doha International Airport","YYC":"Calgary International, Alta.","BEY":"Beirut International Airport","SJC":"San Jose International Airport","LON":"London","BUH":"Bucharest","FAT":"Fresno Air Terminal Airport","MNL":"Ninoy Aquino Manila International Airport","NCE":"Nice Côte dAzur International Airport","BGO":"Bergen , Flesland","BLL":"Billund Lufthavn","ORF":"Norfolk International Airport","HNL":"Honolulu International Airport","BCN":"Barcelona–El Prat Airport","CAI":"Cairo International Airport","KRT":"Khartoum International Airport","CUE":"Cuenca , Mariscal Lamar","ELP":"El Paso International Airport","SIN":"Singapore Changi Airport","HRE":"Harare International Airport","ALG":"Algiers Houari Boumediene Airport","OGG":"Kahului Airport","SNN":"Shannon Airport","KHI":"Karachi Airport","ADD":"Addis Ababa Bole International Airport","SEL":"Seoul","MSO":"Missoula International Airport","MAA":"Chennai International Airport","TAS":"Tashkent International Airport","COK":"Cochin International Airport","BHX":"Birmingham Airport","EBB":"Entebbe Airport","BFS":"Belfast International Airport","BJS":"Beijing","EDI":"Edinburgh Airport","ASE":"Aspen–Pitkin County Airport","JRO":"Kilimanjaro International Airport","RGN":"Yangon International Airport","KRK":"John Paul II International Airport Kraków–Balice","AYT":"Antalya Airport","JKT":"Jakarta","GDN":"Gdansk Lech Walesa Airport","DLA":"Douala Obs.","TYO":"Tokyo","GYN":"Santa Genoveva , Goiânia Airport","BUE":"Buenos Aires","FOC":"Fuzhou Changle International Airport","HGH":"Hangzhou Xiaoshan International Airport","CPT":"Cape Town International Airport","ATQ":"Amritsar","RAK":"Marrakesh Menara Airport","REK":"Reykjavík","POZ":"Poznan–Lawica Airport","KTW":"Katowice International Airport","PMI":"Palma de Mallorca Airport","GLA":"Glasgow Airport","WRO":"Wroclaw – Copernicus Airport","ABZ":"Aberdeen International Airport","CTU":"Chengdu","CNX":"Chiang Mai International Airport","HKT":"Phuket International Airport","ORK":"Cork Airport","REP":"Siem Reap International Airport","TCI":"Santa Cruz de Tenerife","MEL":"Melbourne Airport","SYD":"Sydney International Airport","BNE":"Brisbane Airport","SAO":"São Paulo","REC":"Recife Aeroporto","PER":"Perth Airport","PNH":"Phnom Penh International Airport","MDZ":"Mendoza Aerodrome","FAO":"Faro Airport","AKL":"Auckland International Airport","ADL":"Adelaide Airport","BHZ":"Belo Horizonte","GIG":"Rio de Janeiro–Galeão International Airport"}';
  return {
    data: data,
    api: api,
    loc: JSON.parse(loc)
  }


})

.factory("SavedFlights",function($firebaseArray){
  var savedRef = new Firebase("https://gmtfoh.firebaseio.com/users");
  return $firebaseArray(savedRef);
});

// .factory('Chats', function() {
//   var itemsRef = new Firebase("https://gmtfoh.firebaseio.com/items");
//   return $firebaseArray(itemsRef);
// });
