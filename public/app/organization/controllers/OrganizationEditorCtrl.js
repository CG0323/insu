'use strict'

angular.module('app.organization').controller('OrganizationEditorController', function ($scope, $filter, $rootScope, $state, $stateParams, OrganizationService) {
    var vm = this;
    vm.organization = {};
    
    
    vm.editable = false;

    if ($state.is("app.organization.new")) {
        vm.editable = true;
    }



    var organizationId = $stateParams.organizationId;
    if (organizationId) {
        OrganizationService.getOrganization(organizationId)
            .then(function (organization) {
                vm.organization = organization;
            });
    }


    vm.toggleEdit = function () {
        vm.editable = !vm.editable;
    }

    vm.submitAndBack = function () {
        vm.back = true;
        vm.submit();
    }

    vm.submit = function () {
        OrganizationService.saveOrganization(vm.organization)
            .then(function (data) {
                $.smallBox({
                    title: "服务器确认信息",
                    content: "分支机构已成功保存",
                    color: "#739E73",
                    iconSmall: "fa fa-check",
                    timeout: 5000
                });
                vm.user = {};
                if (vm.back) {
                    $state.go("app.organization.all");
                }
            }, function (err) { });
    };



}); 

