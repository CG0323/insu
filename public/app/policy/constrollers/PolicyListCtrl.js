'use strict'

angular.module('app.policy').controller('PolicyListController', function($rootScope, $state, $scope, PolicyService){
    var vm = this;
    vm.policies = [];
    PolicyService.getPolicies()
    .then(function(policies){
        vm.policies = policies;
    })

    vm.isShowEditButton = function(policy){
        return $rootScope.user.role == "出单员" && policy.policy_status == "待支付";
    }

    vm.isShowPayButton = function(policy){
        return $rootScope.user.role == "财务" && policy.policy_status == "待支付";
    }

    vm.pay = function(policyId){
        $state.go("app.policy.pay", {policyId: policyId});
    }
    
    vm.edit = function(policyId){
        $state.go("app.policy.edit", {policyId: policyId});
    }

});