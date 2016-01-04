var app = angular.module('MEANapp', ['ngRoute']);

/*********************************
 Controllers
 *********************************/
app.controller('HomeController', function($scope){
   $scope.mongoStatus = true;
});

app.controller('LoginController', function($scope, $location){

    $scope.submitlogin = function(){
        // login code
    };

    $scope.createAccount = function(){
        $location.path('/createaccount');
    }
});

app.controller('CreateAccountController', function($scope){
    $scope.submitForm = function(){
        // submit form code
    };
});

/*********************************
 Routing
 *********************************/
app.config(function($routeProvider) {
    'use strict';

    $routeProvider.

        //Root
        when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        }).

        //Login page
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        }).

        //Create Account page
        when('/createaccount', {
            templateUrl: 'views/createaccount.html',
            controller: 'CreateAccountController'
        });

});

/*********************************
 Database API
 *********************************/

//$scope.addName = function(firstName){
//    $scope.postData(firstName);
//    $scope.newName = ''; //resets input
//};
//
//$scope.getData = function(){
//   //Get data from Node Server
//   $http.get('...')
//      .success(function(data){
//         $scope.items = data;
//         console.log('Success calling mongodb');
//      })
//      .error(function(data){
//         alert('Error retrieving data. See console.');
//         console.log(data);
//      });
//};
//
//$scope.postData = function(firstName){
//   $http.post('...', {name: firstName})
//      .success(function(data){
//         $scope.getData(); //refresh page with updated data from DB
//         console.log('Success posting to mongodb');
//      })
//      .error(function(data){
//         alert('Error posting data. See console.');
//         console.log(data);
//      });
//};

//$scope.getData();