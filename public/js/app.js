var app = angular.module('MEANapp', ['ngRoute', 'ngStorage']);

/*********************************
 Controllers
 *********************************/

app.controller('HeaderController', function($scope, $localStorage, $sessionStorage, $location, $http){

    $scope.user = $localStorage;

    $scope.logout = function(){
        $http({
            method: 'GET',
            url: '/account/logout'
        })
            .success(function(response){
                alert(response);
                $localStorage.$reset();
                $location.path('/');
            })
            .error(function(response){
                alert(response);
                $location.path('/account/login');
            }
        );
    };
});

app.controller('HomeController', function($scope, $localStorage, $sessionStorage){});

app.controller('LoginController', function($scope, $localStorage, $sessionStorage, $location, $http){

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
                $localStorage.status = true;
                $localStorage.user = response;
                $location.path('/');
            })
            .error(function(){
                alert('Login failed on server side. Please try again.');
            }
        );
    };

    $scope.createAccount = function(){
        $location.path('/account/create');
    }
});

app.controller('CreateAccountController', function($scope, $localStorage, $sessionStorage, $http, $location){
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

app.controller('AccountController', function($scope, $localStorage, $sessionStorage, $location){

    //TODO setup account update functionality
    //TODO setup account deletion functionality

    $scope.user = $localStorage.user;

    $scope.deleteAccount = function(){
        var response = confirm("Are you sure you want to delete your account? This cannot be undone!");
        if( response == true ){
            alert('Account deleted!!');
            // TODO insert code that actually deletes account
            $location.staus = false; // TODO this should be part of a logged out function that also destroys cookie
            $location.path('/');
        }

        // delete account code
        // confirm their choice BEFORE submitting changes
    };

    $scope.updateAccount = function(){
        console.log('update submitted.')
    };
});

app.controller('ProtectedController', function($scope, $location, $http){

    $http({
        method: 'GET',
        url: '/protected'
    })
        .success(function(response){
            $scope.message = response;
        })
        .error(function(response){
            alert(response);
            $location.path('/account/login');
        }
    );

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