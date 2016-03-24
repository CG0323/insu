'use strict'

angular.module('app.policy').controller('PolicyListController', function (screenSize, $timeout, $rootScope, $state, $scope, PolicyService, localStorageService) {
    var vm = this;
    vm.policies = [];
    vm.organizations = [];


    PolicyService.getClients()
        .then(function (clients) {
            vm.clients = clients;
        })
    PolicyService.getOrganizations()
        .then(function (organizations) {
            vm.organizations = organizations;
        })

    PolicyService.getSellers()
        .then(function (sellers) {
            vm.sellers = sellers;
        })


    vm.listType = "all";
    if ($state.is("app.policy.to-be-paid")) {
        vm.listType = "to-be-paid";
        vm.filterSettings = localStorageService.get("filterSettings") ? localStorageService.get("filterSettings") : {};
        vm.tableHeader = "待支付保单";
        if (screenSize.is('xs, sm')) {
            vm.displayFields = ["client.name", "plate"];
        }
    } else if ($state.is("app.policy.paid")) {
        vm.listType = "paid";
        vm.filterSettings = {};
        vm.tableHeader = "已支付保单";
        if (screenSize.is('xs, sm')) {
            vm.displayFields = ["client.name", "plate", "paid_at"];
        }
    }

    vm.onServerSideItemsRequested = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        vm.currentPage = currentPage;
        vm.pageItems = pageItems;
        PolicyService.searchPolicies(currentPage, pageItems, vm.listType, vm.filterSettings)
            .then(function (data) {
                vm.policies = data.policies;
                vm.policyTotalCount = data.totalCount;
            }, function (err) { });
    };

    vm.filterChanged = function () {
        localStorageService.set("filterSettings", vm.filterSettings);
        vm.refreshPolicies();
    };

    vm.refreshPolicies = function () {
        if (typeof (vm.currentPage) == 'undefined' || typeof (vm.pageItems) == 'undefined') {
            return;
        }
        vm.onServerSideItemsRequested(vm.currentPage, vm.pageItems);
    };



    var poller = function () {
        if ($rootScope.user.role != "财务") {
            return;
        }
        vm.refreshPolicies();
        $timeout(poller, 1000 * 60);
    };

    poller();

    vm.exportFilteredPolicies = function () {
        PolicyService.getFilteredCSV(vm.listType, vm.filterSettings)
            .then(function (csv) {
                var file = new Blob(['\ufeff', csv ], {
                    type : 'application/csv'
                });
                var fileURL = window.URL.createObjectURL(file);
                var anchor = angular.element('<a/>');
                anchor.attr({
                    href: fileURL,
                    target: '_blank',
                    download: 'statistics.csv'
                })[0].click();
            })
    };
    
    function UTF8ToGB2312(str1){
        var substr = "";
        var a = "";
        var b = "";
        var c = "";
        var i = -1;
        i = str1.indexOf("%");
        if(i==-1){
          return str1;
        }
        while(i!= -1){
    if(i<3){
                substr = substr + str1.substr(0,i-1);
                str1 = str1.substr(i+1,str1.length-i);
                a = str1.substr(0,2);
                str1 = str1.substr(2,str1.length - 2);
                if(parseInt("0x" + a) & 0x80 == 0){
                  substr = substr + String.fromCharCode(parseInt("0x" + a));
                }
                else if(parseInt("0x" + a) & 0xE0 == 0xC0){ //two byte
                        b = str1.substr(1,2);
                        str1 = str1.substr(3,str1.length - 3);
                        var widechar = (parseInt("0x" + a) & 0x1F) << 6;
                        widechar = widechar | (parseInt("0x" + b) & 0x3F);
                        substr = substr + String.fromCharCode(widechar);
                }
                else{
                        b = str1.substr(1,2);
                        str1 = str1.substr(3,str1.length - 3);
                        c = str1.substr(1,2);
                        str1 = str1.substr(3,str1.length - 3);
                        var widechar = (parseInt("0x" + a) & 0x0F) << 12;
                        widechar = widechar | ((parseInt("0x" + b) & 0x3F) << 6);
                        widechar = widechar | (parseInt("0x" + c) & 0x3F);
                        substr = substr + String.fromCharCode(widechar);
                }
     }
     else {
      substr = substr + str1.substring(0,i);
      str1= str1.substring(i);
     }
              i = str1.indexOf("%");
        }

        return substr+str1;
  };

    vm.isShowPayButton = function (policy) {
        return $rootScope.user.role == "财务" && policy.policy_status == "待支付";
    };

    vm.isShowDeleteButton = function (policy) {
        if ($rootScope.user.role == "管理员") return true;
        return $rootScope.user.role == "出单员" && policy.policy_status == "待支付";
    };

    vm.isShowViewButton = function (policy) {
        return $rootScope.user.role == "出单员" || $rootScope.user.role == "管理员" || policy.policy_status == "已支付";
    };

    vm.pay = function (policyId) {
        $state.go("app.policy.pay", { policyId: policyId });
    };

    vm.view = function (policyId) {
        $state.go("app.policy.view", { policyId: policyId });
    };

    /*
     * SmartAlerts
     */
    // With Callback
    vm.delete = function (policyId) {
        $.SmartMessageBox({
            title: "删除保单",
            content: "确认删除该保单？",
            buttons: '[取消][确认]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "确认") {
                PolicyService.deletePolicy(policyId)
                    .then(function () {
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
            return (item.plate_no);
        }
    });