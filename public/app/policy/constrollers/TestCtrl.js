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
        // var client = new OSS.Wrapper({
        //     region: 'oss-cn-shanghai',
        //     accessKeyId: 'LTAIZDJoabqQUUmZ',
        //     accessKeySecret: 'vv5bFFUzoQFL0LGxEpY7w5y5l8z7JI',
        //     bucket: 'cwang1'
        // });
        // var file = vm.file;
        // var storeAs = 'upload-file';
        // client.multipartUpload(file.name, file).then(function (result) {
        //     console.log(result);
        // }).catch(function (err) {
        //     console.log(err);
        // });
        PolicyService.uploadFile(file)
        .then(function(fileName){
            console.log(fileName);
            vm.fileName = fileName;
        })
    }
    vm.getFileLink = function(){
        return "http://cwang1.oss-cn-shanghai.aliyuncs.com/" + vm.fileName;
    }
});
