'use strict'

angular.module('app.policy').controller('PolicyListController', function(screenSize, $timeout, $rootScope, $state, $scope, PolicyService){
    var vm = this;
    vm.policies = [];


    vm.listType = "all";
    if($state.is("app.policy.to-be-paid")){
        vm.listType= "to-be-paid";
        vm.tableHeader = "待支付保单";
        if (screenSize.is('xs, sm')) {
            vm.displayFields=["client.name", "plate"];
        }
    }else if($state.is("app.policy.paid")){
        vm.listType = "paid";
        vm.tableHeader = "已支付保单";
        if (screenSize.is('xs, sm')) {
            vm.displayFields=["client.name", "plate","paid_at"];
        }
    }

    vm.onServerSideItemsRequested = function(currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse){
        vm.currentPage = currentPage;
        vm.pageItems = pageItems;
        PolicyService.searchPolicies(currentPage, pageItems, vm.listType)
        .then(function(data){
            vm.policies = data.policies;
            vm.policyTotalCount = data.totalCount;
        }, function(err){});
    };


    vm.refreshPolicies = function(){
        if(typeof(vm.currentPage) == 'undefined'|| typeof(vm.pageItems) == 'undefined'){
            return;
        }
        vm.onServerSideItemsRequested(vm.currentPage, vm.pageItems);
    };
    
    var poller = function(){
        if($rootScope.getUser().role != "财务"){
            return;
        }
        vm.refreshPolicies();
        $timeout(poller, 1000*60);
    };
    
    poller();

    vm.isShowPayButton = function(policy){
        return $rootScope.getUser().role == "财务" && policy.policy_status == "待支付";
    };

    vm.isShowDeleteButton = function(policy){
        if($rootScope.getUser().role == "管理员") return true;
        return $rootScope.user.role == "出单员" && policy.policy_status == "待支付";
    };

    vm.isShowViewButton = function(policy){
        return $rootScope.getUser().role == "出单员" || $rootScope.user.role == "管理员" || policy.policy_status == "已支付";
    };

    vm.pay = function(policyId){
        $state.go("app.policy.pay", {policyId: policyId});
    };
    
    vm.view = function(policyId){
        $state.go("app.policy.view", {policyId: policyId});
    };

    /*
     * SmartAlerts
     */
    // With Callback
    vm.delete =  function (policyId) {
        $.SmartMessageBox({
            title: "删除保单",
            content: "确认删除该保单？",
            buttons: '[取消][确认]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "确认") {
                PolicyService.deletePolicy(policyId)
                    .then(function(){
                        vm.refreshPolicies();
                    })
            }
            if (ButtonPressed === "取消") {

            }

        });
    };
    

});

angular.module('app.policy')
.filter("computeTotal", function () {
    return function (fieldValueUnused, item) {
        return (item.mandatory_fee + item.commercial_fee + item.tax_fee);
    }
 })
.filter("combinePlate", function () {
    return function (fieldValueUnused, item) {
        return (item.plate_province + item.plate_no);
    }
 });