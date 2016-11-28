'use strict'

angular.module('app.policy').controller('TestController', function ($scope, $filter, $rootScope, $state, $stateParams, PolicyService, OrgPolicyService) {
    var vm = this;
    
    vm.fileChanged = function(files) {
        vm.file = files[0];
        vm.uploadFile(files[0]);
    };

    vm.isDisableUploadButton = function(){
        return (!vm.file );
    }

    vm.uploadFile = function(file){
        PolicyService.uploadFile(file)
        .then(function(fileName){
            console.log(fileName);
            vm.fileName = fileName;
        })
    }
    vm.getFileLink = function(){
        return "http://hy-policy.oss-cn-shanghai.aliyuncs.com/" + vm.fileName;
    }
});
