'use strict'

angular.module('app.policy-editor').controller('PolicyEditorController', function($scope, PolicyService){
    var vm = this;
    vm.policy = {};
    
    PolicyService.getClients()
    .then(function(clients){
        vm.clients = clients;
    })
    
    
    vm.save = function(){
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