'use strict'

angular.module('app.policy').controller('PolicyListController', function($rootScope, $state, $scope, PolicyService){
    var vm = this;
    vm.policies = [];
    PolicyService.getPolicies()
    .then(function(policies){
        vm.policies = policies;
    })

    vm.isShowEditButton = function(){
        return $rootScope.user.role == "出单员";
    }

    vm.isShowPayButton = function(){
        return $rootScope.user.role == "财务";
    }

    vm.pay = function(policyId){
        $state.go("app.policy.pay", {policyId: policyId});
    }


});