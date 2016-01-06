var app = angular.module('MEANapp', ['ngRoute']);

/*********************************
 Controllers
 *********************************/

app.controller('HeaderController', function($scope, $location, UserInfo){

    $scope.UserInfo = UserInfo;

    $scope.logout = function(){
        $scope.status = false;
        // TODO destroy session cookie here
        $location.path('/'); // redirect to homepage after logout
    };
});

app.controller('HomeController', function($scope){
    $scope.mongoStatus = true; // TODO replace with actual check of DB status
});

app.controller('LoginController', function($scope, $location, $http, UserInfo){

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
            .success(function(){
                UserInfo.status = true; // TODO move this to the logout() in the factory object?
                $location.path('/'); // TODO change redirect to correct place
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

app.controller('AccountController', function($scope, $location, UserInfo){

    //TODO setup account update functionality
    //TODO setup account deletion functionality

    $scope.deleteAccount = function(){
        var response = confirm("Are you sure you want to delete your account? This cannot be undone!");
        if( response == true ){
            alert('Account deleted!!');
            // TODO insert code that actually deletes account
            UserInfo.staus = false; // TODO this should be part of a logged out function that also destroys cookie
            $location.path('/');
        }

        // delete account code
        // confirm their choice BEFORE submitting changes
    };

    $scope.updateAccount = function(){
        // code to update their account
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

    return user = {
        userInfo : {
            // TODO populate this variable with user's info when login occurs
        },

        status : false, // track the loggedin/out status of user

        logout : function(){
            // code that logs a user out. Should include:
            // destroying session cookie in MongoDB
            // updates 'status' and 'userInfo' keys above
        },

        login : function(){
            // code that logs user into system
            // creates session cookie
            // updates 'status' and 'userInfo' keys above
        }

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
