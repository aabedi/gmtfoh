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

  return {
    data: data,
    api: api
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
