'use strict'

angular.module('app.policy').controller('PhotoReviewController', function (data) {
    var vm = this;
    vm.policy = data.policy;
    vm.companyName = data.companyName;
    vm.getImageUrl = function() {
        // return "http://cwang1.oss-cn-shanghai.aliyuncs.com/" + data.fileName + "?x-oss-process=style/resize"
        return "http://image.4006778808.com/" + data.fileName + "?x-oss-process=style/resize"
    }

    vm.getCompanyName = function() {
        return vm.policy.level4_company ? vm.policy.level4_company.name :  vm.policy.level3_company? vm.policy.level3_company.name :vm.policy.level2_company? vm.policy.level2_company.name : '';     
    }
    
});
