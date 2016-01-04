var app = angular.module('MEANapp', ['ngRoute']);

/*********************************
 Controllers
 *********************************/

app.controller('HeaderController', function($scope, $location, UserInfo){

    $scope.UserInfo = UserInfo;

    $scope.logout = function(){
        $scope.loggedIn = false;
        $location.path('/');
    };
});

app.controller('HomeController', function($scope){
    $scope.mongoStatus = true;
});

app.controller('LoginController', function($scope, $location){

    $scope.submitlogin = function(){
        // submit login form
    };

    $scope.createAccount = function(){
        $location.path('/createaccount');
    }
});

app.controller('CreateAccountController', function($scope){
    $scope.submitForm = function(){
        // submit form code
        // make sure to sanitize/validate input prior to saving to DB!
    };
});

app.controller('AccountController', function(){
    $scope.deleteAccount = function(){
        // delete account code
        // confirm their choice BEFORE submitting changes
    };
});

app.controller('ProtectedController', function(){
   // There should be some protected route function to prevent unauthorized views here
});

/*********************************
 Factories
 *********************************/

// Global storage for user's information (make it accessible to other controllers and such)
app.factory('UserInfo', function(){

    return userInfo = {
        loggedIn : true
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

        //Account page
        when('/account', {
            templateUrl: 'views/account.html',
            controller: 'AccountController'
        }).

        //Create Account page
        when('/createaccount', {
            templateUrl: 'views/create_account.html',
            controller: 'CreateAccountController'
        }).

        //Protected page
        when('/protected', {
            templateUrl: 'views/protected.html',
            controller: 'ProtectedController'
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