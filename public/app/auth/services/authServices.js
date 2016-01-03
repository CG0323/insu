"use strict";

angular.module('app.auth').factory('AuthService',
    ['$q', '$timeout', '$http', '$cookies',
        function ($q, $timeout, $http, $cookies) {

            // return available functions for use in controllers
            return ({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                register: register
            });

            function isLoggedIn() {
                if ($cookies.get('loggedIn') == "true") {
                    return true;
                } else {
                    return false;
                }
            }

            function getUserStatus() {
                return $cookies.get('loggedIn');
            }

            function login(username, password) {

                console.log(username);
                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/users/login', { username: username, password: password })
                // handle success
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            $cookies.put('loggedIn', 'true');
                            deferred.resolve();
                        } else {
                            $cookies.put('loggedIn', 'false');
                            deferred.reject();
                        }
                    })
                // handle error
                    .error(function (data) {
                        $cookies.put('loggedIn', 'false');
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http.get('/users/logout')
                // handle success
                    .success(function (data) {
                        $cookies.put('loggedIn', 'false');
                        deferred.resolve();
                    })
                // handle error
                    .error(function (data) {
                        $cookies.put('loggedIn', 'false');
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function register(username, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/users/register', { username: username, password: password })
                // handle success
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

        }]);