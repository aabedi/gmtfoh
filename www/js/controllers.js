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
                $state.go('tab.travel.search');
            }).catch(function (error) {
                alert("Authentication failed:" + error.message);
                $ionicLoading.hide();
            });
        } else
            alert("Please enter both email and password");
    }
})

.controller('TravelSearchCtrl', function($scope, $state,$compile, TravelService) {
  $scope.user = TravelService.data;

  var insertElement = angular.element(document.querySelector('[nav-view="active"] #select_div'));
  //$scope.airports = [];

  $scope.onSearch = function(){
    //$state.go("tab.travel.selectairport");
  }

  $scope.updateSelectedValue = function(value){
    $scope.user.selectedAirport = value;
    console.log($scope.user.selectedAirport);

  }

  TravelService.api.airportAutocomp(function(result){
    $scope.user.possibleAirports = result;
    var newDirective = angular.element("<select ng-model='mySelect' ng-options='test.value as test.label for test in user.possibleAirports' ng-change='updateSelectedValue(mySelect)'></select>");
    $scope.user.possibleAirports = result.data;
    insertElement.empty();
    insertElement.append(newDirective);
    $compile(insertElement)($scope)
      
  }, $scope.user.airportString);

  $scope.$watch('user.airportString', function(newvalue, oldvalue) {
    if(newvalue.length>oldvalue.length){//dont update when deleting
      if(newvalue.length>=3){//only update when at least 3 chars (smaller search time/size)
          TravelService.api.airportAutocomp(function(result){
            $scope.user.possibleAirports = result
            var newDirective = angular.element("<select ng-model='selectedItem' ng-options='test.value as test.label for test in user.possibleAirports'></select>");
            $scope.user.possibleAirports = result.data;
            insertElement.empty();
            insertElement.append(newDirective);
            $compile(insertElement)($scope)
            console.log($scope.user.selectedAirport);
          }, newvalue);
      }
    }

  });
 
})

.controller('TravelResultsCtrl', function($scope, TravelService) {
  var flightIn;
  TravelService.api.flightInspiration(function(result){
       flightIn = result;
       console.log(result);
  },TravelService.data.selectedAirport, TravelService.data.dateDepart, {duration: TravelService.data.duration});

  TravelService.api.nearestAirport(function(result){
  //     nearair = result;
       console.log(result);
  }, 46.6734,-71.7412);
})

.controller('SavedCtrl', function($scope){


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
