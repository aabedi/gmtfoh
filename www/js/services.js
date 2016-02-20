angular.module('starter.services', ['firebase'])
  .factory("Auth", ["$firebaseAuth", "$rootScope",
  function ($firebaseAuth, $rootScope) {
        var ref = new Firebase(firebaseUrl);
        return $firebaseAuth(ref);
}]);

// .factory('Chats', function() {
//   var itemsRef = new Firebase("https://gmtfoh.firebaseio.com/items");
//   return $firebaseArray(itemsRef);
// });
