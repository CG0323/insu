'use strict'

angular.module('app.client').controller('OrgClientEditorController',function ($scope,$filter, $rootScope, $state, $stateParams, ClientService) {
    var vm = this;
    vm.client = {};
    vm.wechats = [];

    vm.editable = false;
    
    if($state.is("app.client.organization.new")){
        vm.editable = true;
    }



    var clientId = $stateParams.clientId;
    if (clientId) {
        ClientService.getClient(clientId)
            .then(function (client) {
                vm.client = client;
            });
    }

    ClientService.getFollowers()
    .then(function(followers){
        vm.wechats = followers;
    });

    vm.toggleEdit = function(){
        vm.editable = !vm.editable;
    }

    vm.submitAndBack = function () {
        vm.back = true;
        vm.submit();
    }


    vm.submit = function () {
        vm.client.client_type = "机构";
        ClientService.saveClient(vm.client)
            .then(function (data) {
                $.smallBox({
                    title: "服务器确认信息",
                    content: "客户已成功保存",
                    color: "#739E73",
                    iconSmall: "fa fa-check",
                    timeout: 5000
                });
                vm.client = {};
                if (vm.back) {
                    $state.go("app.client.organization");
                }
            }, function (err) { });
    };

}); 

