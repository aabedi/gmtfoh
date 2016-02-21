angular.module('starter.controllers', [])


.controller('LoginCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) {
    console.log('Login Controller Initialized');

    var ref = new Firebase($scope.firebaseUrl);
    var auth = $firebaseAuth(ref);

    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.createUser = function (user) {
        console.log("Create User Function called")
        if (user && user.email && user.password && user.displayname) {
            $ionicLoading.show({
                template: 'Signing Up...'
            });

            auth.$createUser({
                email: user.email,
                password: user.password
            }).then(function (userData) {
                alert("User created successfully!");
                ref.child("users").child(userData.uid).set({
                    email: user.email,
                    displayName: user.displayname
                });
                $ionicLoading.hide();
                $scope.modal.hide();
            }).catch(function (error) {
                alert("Error: " + error);
                $ionicLoading.hide();
            });
        } else
            alert("Please fill all details");
    }

    $scope.signIn = function (user) {

        if (user && user.email && user.pwdForLogin) {
            $ionicLoading.show({
                template: 'Signing In...'
            });
            auth.$authWithPassword({
                email: user.email,
                password: user.pwdForLogin
            }).then(function (authData) {
                console.log("Logged in as:" + authData.uid);
                ref.child("users").child(authData.uid).once('value', function (snapshot) {
                    var val = snapshot.val();
                    // To Update AngularJS $scope either use $apply or $timeout
                    $scope.$apply(function () {
                        $rootScope.displayName = val;
                    });
                });
                $ionicLoading.hide();
                $state.go('tab.dash.index');
            }).catch(function (error) {
                alert("Authentication failed:" + error.message);
                $ionicLoading.hide();
            });
        } else
            alert("Please enter both email and password");
    }
})

.controller('DashCtrl', function($scope) {
  $scope.tests=[
    {title: "Test1"},
    {title: "Test2"},
    {title: "Test3"},
    {title: "Test4"},
    {title: "Test5"},
    {title: "Test6"},
  ]
})
.factory('TravelService', function($http) {
  var api = {
    privateKey: 's5yxpoASY8fjSV9lmMHPbQdQQGokbBBk',
    baseUrl: 'https://api.sandbox.amadeus.com/v1.2/',

    //
    // Get flight inspiration information. 
    // required that you provide destination. 
    // Any extra information should be packed in the 'extra' parameter 
    // extra = {destination: ~~~, one_way: ~~, direct: ~~, maxPrice: ~~}
    //
    flightInspiration: function(origin, departure_date, extra){
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

      $http({
        method: 'GET',
        url: url
      }).then(function successCallBack(response) {
          console.log(response);
          return response;
      }, function errorCallback(response){
          console.log(response);
      });
    },

    nearestAirport: function(lat, lon){
      var url = api.baseUrl+"airports/nearest-relevant?apikey="+api.privateKey+"&latitude="+lat+"&longitude="+lon;

      $http({
        method: 'GET',
        url: url
      }).then(function successCallBack(response) {
          console.log(response);
          return response;
      }, function errorCallback(response){
          console.log(response);
      });

    }

  }
  var data = {
    budget: 503,
    dateDepart: new Date(),
    dateArrive: new Date(),
  } 

  return {
    data: data,
    api: api
  }

})
.controller('TravelSearchCtrl', function($scope, TravelService) {
  $scope.user = TravelService.data;
  console.log(TravelService);
  console.log($scope.user.budget);
  
})
.controller('TravelResultsCtrl', function($scope, TravelService) {
  console.log(TravelService.api.flightInspiration("NYC",new Date(2016,02,20)));
  console.log(TravelService.api.nearestAirport(46.6734,-71.7412));
})

//  // With the new view caching in Ionic, Controllers are only called
//  // when they are recreated or on app start, instead of every page change.
//  // To listen for when this page is active (for example, to refresh data),
//  // listen for the $ionicView.enter event:
//  //
//  //$scope.$on('$ionicView.enter', function(e) {
//  //});
//
//  //$scope.travel = Travel.all();
//  //$scope.remove = function(travel) {
//  //  Travel.remove(travel);
//  //};
//})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
