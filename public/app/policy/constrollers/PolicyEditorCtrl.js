'use strict'

angular.module('app.policy').controller('PolicyEditorController', function($rootScope, $stateParams, PolicyService){
    var vm = this;
    vm.policy = {};
    vm.policy.plate_province = "苏";
    PolicyService.getClients()
    .then(function(clients){
        vm.clients = clients;
    })

    var policyId = $stateParams.policyId;
    if(policyId){
        PolicyService.getPolicy(policyId)
            .then(function(policy){
                vm.policy = policy;
            });
    }
    
    
    vm.submit = function(){
        PolicyService.savePolicy(vm.policy)
        .then(function(data){
            $.bigBox({
                title: "服务器确认信息",
                content: "保单已成功保存",
                color: "#87D300",
                icon: "fa fa-success animated",
                timeout: 6000
            });
        },function(err){});
    };
});