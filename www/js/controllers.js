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
.factory('TravelService', function() {
  var data = {
    budget: 503,
    dateDepart: new Date(),
    dateArrive: new Date(),
  } 


  return {
    data: data
  }

})
.controller('TravelSearchCtrl', function($scope, TravelService) {
  $scope.user = TravelService.data;
  TravelService.data.budget = 4000;

  console.log($scope.user.budget);
  
})
.controller('TravelResultsCtrl', function($scope, TravelService) {
  console.log(TravelService.data.budget);
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
