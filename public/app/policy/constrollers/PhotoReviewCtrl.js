'use strict'

angular.module('app.policy').controller('PhotoReviewController', function (data, PolicyService) {
    var vm = this;
    vm.policy = data.policy;
    
    var companyId = vm.policy.level4_company ? vm.policy.level4_company:  vm.policy.level3_company? vm.policy.level3_company :vm.policy.level2_company? vm.policy.level2_company : null;    
    if(!companyId){
        vm.companyName = "";
    }else{
        PolicyService.getCompany(companyId)
        .then(function(company){
            vm.companyName = company.name;
        })
    }

    vm.getImageUrl = function() {
        // return "http://cwang1.oss-cn-shanghai.aliyuncs.com/" + data.fileName + "?x-oss-process=style/resize"
        return "http://image.4006778808.com/" + data.fileName + "?x-oss-process=style/resize"
    }

    vm.getCompanyName = function() {
        var companyId = vm.policy.level4_company ? vm.policy.level4_company:  vm.policy.level3_company? vm.policy.level3_company :vm.policy.level2_company? vm.policy.level2_company : null;    
        if(!companyId)
            return "";
         
    }
    
});
