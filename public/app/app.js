'use strict';

/**
 * @ngdoc overview
 * @name app [smartadminApp]
 * @description
 * # app [smartadminApp]
 *
 * Main module of the application.
 */

angular.module('app', [
//'ngSanitize',
    'ngAnimate',
    'restangular',
    'ui.router',
    'ui.bootstrap',
    "trNgGrid",
    "validation",
    "validation.rule",
    "matchMedia",
// Smartadmin Angular Common Module
    'SmartAdmin',

// App
    'app.auth',
    'app.layout',
    'app.dashboard',
    'app.calendar',
    'app.inbox',
    'app.graphs',
    'app.tables',
    'app.forms',
    'app.ui',
    'app.widgets',
    'app.maps',
    'app.appViews',
    'app.misc',
    'app.smartAdmin',
    'app.policy',
    'app.client',
    'app.employee',
    'app.organization'
])
    .config(function ($provide, $httpProvider) {


        // Intercept http calls.
        $provide.factory('ErrorHttpInterceptor', function ($q) {
            var errorCounter = 0;

            function notifyError(rejection) {

                $.bigBox({
                    title: rejection.status + ' ' + rejection.statusText,
                    content: rejection.data,
                    color: "#C46A69",
                    icon: "fa fa-warning shake animated",
                    number: ++errorCounter,
                    timeout: 6000
                });
            }

            return {
                // On request failure
                requestError: function (rejection) {
                    // show notification
                    notifyError(rejection);

                    // Return the promise rejection.
                    return $q.reject(rejection);
                },

                // On response failure
                responseError: function (rejection) {
                    // show notification
                    notifyError(rejection);
                    // Return the promise rejection.
                    return $q.reject(rejection);
                }
            };
        });

        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('ErrorHttpInterceptor');

    })
    .constant('APP_CONFIG', window.appConfig)

    .run(function ($rootScope
        , $state, $stateParams, AuthService) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        // $rootScope.getUser = function () {
        //     if ($rootScope.user) {
        //         return $rootScope.user;
        //     } else {
        //         AuthService.getUser()
        //             .then(function (user) {
        //                 $rootScope.user = user;
        //                 return $rootScope.user;
        //             });
        //     }
        // };
        AuthService.getUser()
            .then(function (user) {
                $rootScope.user = user;
            });
        // editableOptions.theme = 'bs3';
        $rootScope.logout = function () {
            AuthService.logout()
                .then(function () {
                    $state.transitionTo('login');
                });
        };
        $rootScope.$on("$stateChangeStart",

            function (event, toState, toParams,
                fromState, fromParams) {
                if (toState.name != "login" && !AuthService.isLoggedIn()) {
                    event.preventDefault();
                    $state.transitionTo("login");
                }
            });
    });


