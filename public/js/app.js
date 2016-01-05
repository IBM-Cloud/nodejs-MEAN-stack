var app = angular.module('MEANapp', ['ngRoute']);

/*********************************
 Controllers
 *********************************/

app.controller('HeaderController', function($scope, $location, UserInfo){

    $scope.UserInfo = UserInfo;

    $scope.logout = function(){
        $scope.loggedIn = false;
        // TODO destroy session cookie here
        $location.path('/'); // redirect to homepage after logout
    };
});

app.controller('HomeController', function($scope){
    $scope.mongoStatus = true; // TODO replace with actual check of DB status
});

app.controller('LoginController', function($scope, $location, $http){

    $scope.submitLogin = function(){

        // Login request
        $http({
            method: 'POST',
            url: '/account/login',
            data: {
                    'username': $scope.loginForm.username,
                    'password': $scope.loginForm.password
                }
            })
            .success(function(response){
                alert('Success');
                console.log(response);
            })
            .error(function(response){

                // TODO send reason for error to page
                alert('Fail');
                console.log(response);
            }
        );
    };

    $scope.createAccount = function(){
        $location.path('/account/create');
    }
});

app.controller('CreateAccountController', function($scope, $http, $location){
    $scope.submitForm = function(){

        $http({
            method: 'POST',
            url: '/account/create',
            data: {
                'username': $scope.newUser.username,
                'password': $scope.newUser.password,
                'name' : $scope.newUser.name,
                'email' : $scope.newUser.email
            }
        })
            .success(function(response){
                alert(response); // TODO replace with proper message, same as used with error notification
                $location.path('/account/login');
            })
            .error(function(response){
                // TODO send reason for error to page
                alert('Fail. See console for details');
                console.log(response);
            }
        );

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
        loggedIn : false
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
        when('/account/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        }).

        //Account page
        when('/account', {
            templateUrl: 'views/account.html',
            controller: 'AccountController'
        }).

        //Create Account page
        when('/account/create', {
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
