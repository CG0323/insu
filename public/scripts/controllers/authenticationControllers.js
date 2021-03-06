'use strict';
/**
 * @ngdoc function
 * @name myApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myApp
 */
angular.module('myApp').controller('LoginCtrl',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            var vm = this;
            vm.username= "";
            vm.password= "";
            console.log(AuthService.getUserStatus());

            vm.login = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;
                // call login from service
                AuthService.login(vm.username, vm.password)
                    // handle success
                    .then(function () {
                        $location.path('/');
                        $scope.disabled = false;
                        vm.username= "";
                        vm.password= "";
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Invalid username and/or password";
                        $scope.disabled = false;
                        //vm.username= "";
                        vm.password= "";
                    });

            };
        }]);
