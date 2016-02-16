'use strict'

angular.module('app.policy').controller('PolicyEditorController',function ($scope,$filter, $rootScope, $state, $stateParams, PolicyService) {
    var vm = this;
    vm.policy = {};
    vm.policy.plate_province = "苏";
    vm.clientInfo = {};
    vm.sellerInfo = $rootScope.getUser();
    PolicyService.getClients()
        .then(function (clients) {
            vm.clients = clients;
        })

    vm.editable = false;
    if($state.is("app.policy.new")){
        vm.editable = true;
    }



    var policyId = $stateParams.policyId;
    if (policyId) {
        PolicyService.getPolicy(policyId)
            .then(function (policy) {
                //policy.client = policy.client._id;
                vm.policy = policy;
                vm.clientInfo = policy.client;
                vm.sellerInfo = policy.seller;
                policy.client = policy.client._id;
                policy.seller = policy.seller._id;
            });
    }

    vm.toggleEdit = function(){
        vm.editable = !vm.editable;
    }

    vm.submitAndBack = function () {
        vm.back = true;
        vm.submit();
    }


    vm.submit = function () {
        PolicyService.savePolicy(vm.policy)
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
                    $state.go("app.policy.to-be-paid");
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
                PolicyService.savePolicy(vm.policy)
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
}); 

angular.module('app.policy').directive('upper', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue == undefined) inputValue = '';
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
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

angular.module('app.policy').directive('price', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var removeIllegalInput = function(inputValue) {
           if(inputValue == undefined) inputValue = '';
        //    var output = inputValue.replace(/[^(\d|\\.)]/g,'') 
           
           //先把非数字的都替换掉，除了数字和.
		var output= inputValue.replace(/[^\d.]/g,"");
		//必须保证第一个为数字而不是.
		output = output.replace(/^\./g,"");
		//保证只有出现一个.而没有多个.
		output = output.replace(/\.{2,}/g,".");
		//保证.只出现一次，而不能出现两次以上
		output = output.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        //只允许输入两位小数
        output = output.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
           
           if(output !== inputValue) {
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