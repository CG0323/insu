'use strict'

angular.module('app.client').controller('OrgClientEditorController',function ($scope,$filter, $rootScope, $state, $stateParams, ClientService) {
    var vm = this;
    vm.client = {};
    vm.wechats = [];
    vm.bindedWechats = [];
    vm.editable = false;
    
    if($state.is("app.client.organization.new")){
        vm.editable = true;
    }



    var clientId = $stateParams.clientId;
    if (clientId) {
        ClientService.getClient(clientId)
            .then(function (client) {
                vm.client = client;
                LoadWechats();
            });
    }
    
    function LoadWechats(){
        var openIds = vm.client.wechats;
        ClientService.getWechatsByIds(openIds)
        .then(function(wechats){
            if(wechats && wechats.length > 0){
                vm.bindedWechats = wechats;
            }       
        })
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
    
    vm.bindWechat = function(wechat){
        console.log("here");
        console.log(vm.bindedWechats);
        vm.bindedWechats.push(wechat);
        console.log(vm.bindedWechats);
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

