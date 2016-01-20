'use strict'

angular.module('app.policy').controller('PolicyListController', function($rootScope, $state, $scope, PolicyService){
    var vm = this;
    vm.policies = [];
    PolicyService.getPolicies()
    .then(function(policies){
        vm.policies = policies;
    })


    vm.refreshPolicies = function(){
        PolicyService.getPolicies()
            .then(function(policies){
                vm.policies = policies;
            })
    };

    vm.isShowEditButton = function(policy){
        return $rootScope.user.role == "出单员" && policy.policy_status == "待支付";
    };

    vm.isShowPayButton = function(policy){
        return $rootScope.user.role == "财务" && policy.policy_status == "待支付";
    };

    vm.isShowDeleteButton = function(policy){
        return $rootScope.user.role == "出单员" && policy.policy_status == "待支付";
    };

    vm.pay = function(policyId){
        $state.go("app.policy.pay", {policyId: policyId});
    };
    
    vm.edit = function(policyId){
        $state.go("app.policy.edit", {policyId: policyId});
    };

    vm.delete = function(policyId){
        PolicyService.deletePolicy(policyId)
            .then(function(){
                vm.refreshPolicies();
            })
    };

    /*
     * SmartAlerts
     */
    // With Callback
    vm.delete =  function (policyId) {
        $.SmartMessageBox({
            title: "删除保单",
            content: "确认删除该保单？",
            buttons: '[取消][确认]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "确认") {
                PolicyService.deletePolicy(policyId)
                    .then(function(){
                        vm.refreshPolicies();
                    })
            }
            if (ButtonPressed === "取消") {

            }

        });
    };

});