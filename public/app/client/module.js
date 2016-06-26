"use strict";


angular.module('app.client', ['ui.router','validation'])


angular.module('app.client').config(function ($stateProvider) {

    $stateProvider
        .state('app.client', {
            abstract: true,
            data: {
                title: '业务员信息管理'
            }
        })
        .state('app.client.organization', {
            url: '/clients/organization',
            data: {
                title: '机构客户'
            },
            views: {
                "content@app": {
                    controller: 'OrgClientListController as vm',
                    templateUrl: 'app/client/views/org-client-list.html'
                }
            }
        })
        .state('app.client.individual', {
            url: '/clients/individual',
            data: {
                title: '车险个人业务员'
            },
            views: {
                "content@app": {
                    controller: 'IndClientListController as vm',
                    templateUrl: 'app/client/views/ind-client-list.html'
                }
            }
        })
        .state('app.client.life', {
            url: '/clients/life',
            data: {
                title: '寿险业务员'
            },
            views: {
                "content@app": {
                    controller: 'LifeClientListController as vm',
                    templateUrl: 'app/client/views/life-client-list.html'
                }
            }
        })
        .state('app.client.organization.view', {
            url: '/clients/view/:clientId',
            data: {
                title: '机构信息查看'
            },
            views: {
                "content@app": {
                    controller: 'OrgClientEditorController as vm',
                    templateUrl: 'app/client/views/org-client.html'
                }
            }
        })
        .state('app.client.organization.new', {
            url: '/new',
            data: {
                title: '添加车险机构客户'
            },
            views: {
                "content@app": {
                    controller: 'OrgClientEditorController as vm',
                    templateUrl: 'app/client/views/org-client.html'
                }
            }
        })
        .state('app.client.individual.view', {
            url: '/view/:clientId',
            data: {
                title: '车险业务员信息查看'
            },
            views: {
                "content@app": {
                    controller: 'IndClientEditorController as vm',
                    templateUrl: 'app/client/views/Ind-client.html'
                }
            }
        })
        .state('app.client.individual.new', {
            url: '/new',
            data: {
                title: '添加车险业务员'
            },
            views: {
                "content@app": {
                    controller: 'IndClientEditorController as vm',
                    templateUrl: 'app/client/views/Ind-client.html'
                }
            }
        })
        .state('app.client.life.view', {
            url: '/view/:clientId',
            data: {
                title: '寿险业务员信息查看'
            },
            views: {
                "content@app": {
                    controller: 'LifeClientEditorController as vm',
                    templateUrl: 'app/client/views/life-client.html'
                }
            }
        })
        .state('app.client.life.new', {
            url: '/new',
            data: {
                title: '添加寿险业务员'
            },
            views: {
                "content@app": {
                    controller: 'LifeClientEditorController as vm',
                    templateUrl: 'app/client/views/life-client.html'
                }
            }
        })
});