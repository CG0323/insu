angular.module('app.wechat', [
  'ui.router',
])
.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('app.wechat.home', {
            url: '/wechat/home',
            data: {
                title: '红叶保险查询系统'
            },
            views: {
                "content@app": {
                    controller: 'WechatController as vm',
                    templateUrl: 'views/home.html'
                }
            }
        })
        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get("$state");
            $state.go("app.wechat.home");
        });

    });