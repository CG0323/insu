'use strict'

angular.module('app.policy').controller('PolicyEditorController', function ($scope, $filter, $rootScope, $state, $stateParams, PolicyService) {
    var vm = this;
    vm.policy = {};
    vm.policy.plate_province = "苏";
    PolicyService.getClients()
        .then(function (clients) {
            vm.clients = clients;
        })

    var policyId = $stateParams.policyId;
    if (policyId) {
        PolicyService.getPolicy(policyId)
            .then(function (policy) {
                policy.client = policy.client._id;
                vm.policy = policy;
            });
    }

    vm.setBack = function () {
        vm.back = true;
    }


    vm.submit = function () {
        PolicyService.savePolicy(vm.policy)
            .then(function (data) {
                $.bigBox({
                    title: "服务器确认信息",
                    content: "保单已成功保存",
                    color: "#87D300",
                    icon: "fa fa-success animated",
                    timeout: 6000
                });
                vm.policy = {};
                vm.policy.plate_province = "苏";
                if (vm.back) {
                    console.log("准备跳转");
                    $state.go("app.policy.to-be-paid");
                }
            }, function (err) { });
    };

}); 