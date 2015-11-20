//Angular App
var app = angular.module('MEANapp', []);

app.controller('MEANcntrl', function($scope, $http){
   
   $scope.addName = function(firstName){
       $scope.postData(firstName);
       $scope.newName = ''; //resets input
   };
   
   $scope.getData = function(){
      //Get data from Node Server
      $http.get('...')
         .success(function(data){
            $scope.items = data;
            console.log('Success calling mongodb');
         })
         .error(function(data){
            alert('Error retrieving data. See console.');
            console.log(data);
         });
   };
   
   $scope.postData = function(firstName){
      $http.post('...', {name: firstName})
         .success(function(data){
            $scope.getData(); //refresh page with updated data from DB
            console.log('Success posting to mongodb');
         })
         .error(function(data){
            alert('Error posting data. See console.');
            console.log(data);
         });
   };
   
   //$scope.getData();
   
});