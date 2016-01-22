angular.module('app.wechat')
  .controller('WechatController', function ($scope, dataAPI) {
    var vm = this;
    vm.policies = [];
    dataAPI.getPolicies()
      .then(function (policies) {
        vm.policies = policies;
      });
  });