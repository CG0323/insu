angular.module('app.wechat')
  .controllers('WechatController', function ($scope, dataAPI) {
    var vm = this;
    vm.policies = [];
    dataAPI.getPolicies()
      .then(function (policies) {
        vm.policies = policies;
      });
  });