'use strict'

angular.module('app.policy').controller('TestController', function ($scope, $filter, $rootScope, $state, $stateParams, PolicyService, OrgPolicyService) {
    var vm = this;
    
    vm.fileChanged = function(files) {
        vm.file = files[0];
    };

    vm.isDisableUploadButton = function(){
        return (!vm.file );
    }

    vm.uploadFile = function(){
        var client = new OSS.Wrapper({
            region: 'oss-cn-shanghai',
            accessKeyId: 'LTAIZDJoabqQUUmZ',
            accessKeySecret: 'vv5bFFUzoQFL0LGxEpY7w5y5l8z7JI',
            bucket: 'cwang1'
        });
        var file = vm.file;
        var storeAs = 'upload-file';
        client.multipartUpload(file.name, file).then(function (result) {
            console.log(result);
        }).catch(function (err) {
            console.log(err);
        });
    }
    vm.getFileLink = function(){
        if(!vm.file) return "";
        return "http://cwang1.oss-cn-shanghai.aliyuncs.com/" + vm.file.name;
    }
});
