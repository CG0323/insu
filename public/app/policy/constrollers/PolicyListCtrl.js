'use strict'

angular.module('app.policy').controller('PolicyListController', function (screenSize, $timeout, $rootScope, $state, $scope, PolicyService, localStorageService) {
    var vm = this;
    vm.policies = [];
    vm.organizations = [];
    vm.totalIncome = 0;
    vm.totalPayment = 0;
    vm.totalProfit = 0;


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
        vm.fromDate = localStorageService.get("fromDate") ? localStorageService.get("fromDate") : undefined;
        vm.toDate = localStorageService.get("toDate") ? localStorageService.get("toDate") : undefined;
        vm.tableHeader = "待支付保单";
        if (screenSize.is('xs, sm')) {
            vm.displayFields = ["client.name", "plate"];
        }
    } else if ($state.is("app.policy.paid")) {
        vm.listType = "paid";
        vm.filterSettings = localStorageService.get("paid-filterSettings") ? localStorageService.get("paid-filterSettings") : {};
        vm.fromDate = localStorageService.get("paid-fromDate") ? localStorageService.get("paid-fromDate") : undefined;
        vm.toDate = localStorageService.get("paid-toDate") ? localStorageService.get("paid-toDate") : undefined;
        vm.tableHeader = "已支付保单";
        if (screenSize.is('xs, sm')) {
            vm.displayFields = ["client.name", "plate", "paid_at"];
        }
    }

    vm.onServerSideItemsRequested = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        vm.currentPage = currentPage;
        vm.pageItems = pageItems;
        PolicyService.searchPolicies(currentPage, pageItems, vm.listType, vm.filterSettings, vm.fromDate, vm.toDate)
            .then(function (data) {
                vm.policies = data.policies;
                vm.policyTotalCount = data.totalCount;
            }, function (err) { });
    };

    vm.filterChanged = function () {
        if ($state.is("app.policy.to-be-paid")) {
            localStorageService.set("filterSettings", vm.filterSettings);
            localStorageService.set('fromDate', vm.fromDate);
            localStorageService.set('toDate', vm.toDate);
        }
        else if ($state.is("app.policy.paid")) {
            localStorageService.set("paid-filterSettings", vm.filterSettings);
            localStorageService.set('paid-fromDate', vm.fromDate);
            localStorageService.set('paid-toDate', vm.toDate);
        }
        
        vm.refreshPolicies();
        vm.refreshSummary();
    };

    vm.refreshPolicies = function () {
        if (typeof (vm.currentPage) == 'undefined' || typeof (vm.pageItems) == 'undefined') {
            return;
        }
        vm.onServerSideItemsRequested(vm.currentPage, vm.pageItems);
    };

    vm.refreshSummary = function () {

        PolicyService.getSummary(vm.listType, vm.filterSettings, vm.fromDate, vm.toDate)
            .then(function (data) {
                vm.totalIncome = data.total_income;
                vm.totalPayment = data.total_payment;
                vm.totalProfit = data.total_profit;
            }, function (err) { });
    };




    var poller = function () {
        if ($rootScope.user.role == "出单员") {
            return;
        }
        vm.refreshPolicies();
        vm.refreshSummary();
        $timeout(poller, 1000 * 60 * 2);
    };

    poller();

    vm.exportFilteredPolicies = function () {
        PolicyService.getFilteredCSV(vm.listType, vm.filterSettings, vm.fromDate, vm.toDate)
            .then(function (csv) {
                var file = new Blob(['\ufeff', csv], {
                    type: 'application/csv'
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

    vm.bulkPay = function () {
        $.SmartMessageBox({
            title: "批量修改保单状态",
            content: "确认已支付筛选出的所有保单？结算费共计:" + vm.totalPayment.toFixed(2),
            buttons: '[取消][确认]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "确认") {
                PolicyService.bulkPay(vm.listType, vm.filterSettings, vm.fromDate, vm.toDate)
                    .then(function (data) {
                        $.smallBox({
                            title: "服务器确认信息",
                            content: "保单状态已批量更改为已支付",
                            color: "#739E73",
                            iconSmall: "fa fa-check",
                            timeout: 5000
                        });
                        vm.refreshPolicies();
                        vm.refreshSummary();
                    }, function (err) {

                    });
            }
            if (ButtonPressed === "取消") {

            }

        });



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
                        vm.refreshSummary();
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