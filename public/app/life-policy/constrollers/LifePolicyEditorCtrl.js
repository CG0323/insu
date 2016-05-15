'use strict'

angular.module('app.life-policy').controller('LifePolicyEditorController', function ($scope, $filter, $rootScope, $state, $stateParams, LifePolicyService) {
    var vm = this;
    vm.policy = {};
    vm.clientInfo = {};
    vm.sellerInfo = $rootScope.user;
    LifePolicyService.getClients()
        .then(function (clients) {
            vm.clients = clients;
        })
    LifePolicyService.getCompanies()
        .then(function (companies) {
            vm.companies = companies;
        })

    vm.editable = false;
    if ($state.is("app.life-policy.new")) {
        vm.editable = true;
    }



    var policyId = $stateParams.policyId;
    if (policyId) {
        LifePolicyService.getPolicy(policyId)
            .then(function (policy) {
                vm.policy = policy;
                vm.clientInfo = policy.client;
                vm.sellerInfo = policy.seller;
                policy.client = policy.client._id;
                policy.seller = policy.seller._id;
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
        vm.policy.client = vm.clientInfo._id;
        LifePolicyService.savePolicy(vm.policy)
            .then(function (data) {
                $.smallBox({
                    title: "服务器确认信息",
                    content: "保单已成功保存",
                    color: "#739E73",
                    iconSmall: "fa fa-check",
                    timeout: 5000
                });
                vm.policy = {};
                vm.policy.plate_province = "苏";
                if (vm.back) {
                    $state.go("app.life-policy.to-be-paid");
                }
            }, function (err) { });
    };

    vm.pay = function () {
        $.SmartMessageBox({
            title: "修改保单状态",
            content: "确认已支付该保单？",
            buttons: '[取消][确认]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "确认") {
                vm.policy.policy_status = "已支付";
                vm.policy.paid_at = Date.now();
                LifePolicyService.savePolicy(vm.policy)
                    .then(function (data) {
                        $.smallBox({
                            title: "服务器确认信息",
                            content: "保单状态已成功更改为已支付",
                            color: "#739E73",
                            iconSmall: "fa fa-check",
                            timeout: 5000
                        });
                    }, function (err) { });
            }
            if (ButtonPressed === "取消") {

            }

        });

    };

    vm.updateFee = function () {
        vm.policy.income = vm.policy.fee * vm.policy.income_rate / 100;
        if (vm.policy.income) {
            vm.policy.income = vm.policy.income.toFixed(2);
        }
        vm.policy.income_addition = vm.policy.fee * vm.policy.income_addition_rate / 100;
        if (vm.policy.income_addition) {
            vm.policy.income_addition = vm.policy.income_addition.toFixed(2);
        }
        
        if(!isNaN(vm.policy.income) && !isNaN(vm.policy.income_addition)){
            vm.policy.income_total = parseFloat(vm.policy.income) + parseFloat(vm.policy.income_addition);
            vm.policy.income_total = vm.policy.income_total.toFixed(2);
        }
        
        vm.policy.payment = vm.policy.fee * vm.policy.payment_rate / 100;
        if (vm.policy.payment) {
            vm.policy.payment = vm.policy.payment.toFixed(2);
        }
        vm.policy.payment_addition = vm.policy.fee * vm.policy.payment_addition_rate / 100;
        if (vm.policy.payment_addition) {
            vm.policy.payment_addition = vm.policy.payment_addition.toFixed(2);
        }
        
        if(!isNaN(vm.policy.payment) && !isNaN(vm.policy.payment_addition)){
            vm.policy.payment_total = parseFloat(vm.policy.payment) + parseFloat(vm.policy.payment_addition);
            vm.policy.payment_total = vm.policy.payment_total.toFixed(2);
        }
                
        if(!isNaN(vm.policy.income_total) && !isNaN(vm.policy.payment_total)){
            vm.policy.profit = parseFloat(vm.policy.income_total) - parseFloat(vm.policy.payment_total);
            vm.policy.profit = vm.policy.profit.toFixed(2);
        }
    }
});

angular.module('app.life-policy').directive('upper', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var capitalize = function (inputValue) {
                if (inputValue == undefined) inputValue = '';
                var capitalized = inputValue.toUpperCase();
                var re = /[^/u4e00-/u9fa5]/;
                if (re.test(inputValue) && capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);  // capitalize initial value
        }
    };
});

angular.module('app.life-policy').directive('price', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var removeIllegalInput = function (inputValue) {
                if (inputValue == undefined) inputValue = '';
                //    var output = inputValue.replace(/[^(\d|\\.)]/g,'') 
           
                //先把非数字的都替换掉，除了数字和.
                var output = inputValue.replace(/[^\d.]/g, "");
                //必须保证第一个为数字而不是.
                output = output.replace(/^\./g, "");
                //保证只有出现一个.而没有多个.
                output = output.replace(/\.{2,}/g, ".");
                //保证.只出现一次，而不能出现两次以上
                output = output.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                //只允许输入两位小数
                output = output.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

                if (output !== inputValue) {
                    modelCtrl.$setViewValue(output);
                    modelCtrl.$render();
                }
                return output;
            }
            modelCtrl.$parsers.push(removeIllegalInput);
            removeIllegalInput(scope[attrs.ngModel]);
        }
    };
});

angular.module('app.life-policy').filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    if (/^[\u4e00-\u9fa5]+$/.test(text)) {
                        if(item['name'].indexOf(text) == 0){
                            itemMatches = true;
                                break;
                        }
                    } else {
                        var text = props[prop].toUpperCase();
                        var pylist = item['py'];
                      
                        for (var j = 0; j < pylist.length; j++) {
                            if (pylist[j].indexOf(text) == 0) {
                                itemMatches = true;
                                break;
                            }
                        }
                        if(itemMatches){
                            break;
                        }
                    }


                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});