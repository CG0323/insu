'use strict'

angular.module('app.policy').controller('PhotoReviewController', function (data) {
    var vm = this;
    vm.policy = data.policy;

    vm.getImageUrl = function() {
        // return "http://cwang1.oss-cn-shanghai.aliyuncs.com/" + data.fileName + "?x-oss-process=style/resize"
        return "http://image.4006778808.com/" + data.fileName + "?x-oss-process=style/resize"
    }

    vm.getCompanyName = function() {
        var policy = vm.policy;
        console.log(policy);
        return policy.level4_company ? policy.level4_company.name :  policy.level3_company? policy.level3_company.name :policy.level2_company? policy.level2_company.name : '';     
    }
    
});
