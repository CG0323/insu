"use strict";


angular.module('app.client', ['ui.router','validation'])


angular.module('app.client').config(function ($stateProvider) {

    $stateProvider
        .state('app.client', {
            abstract: true,
            data: {
                title: '客户信息管理'
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
                title: '个人客户'
            },
            views: {
                "content@app": {
                    controller: 'IndClientListController as vm',
                    templateUrl: 'app/client/views/ind-client-list.html'
                }
            }
        })
        .state('app.client.organization.view', {
            url: '/clients/organization/view/:clientId',
            data: {
                title: '客户信息查看'
            },
            views: {
                "content@app": {
                    controller: 'OrgClientEditorController as vm',
                    templateUrl: 'app/client/views/org-client.html'
                }
            }
        })
        .state('app.client.organization.new', {
            url: '/clients/organization/new',
            data: {
                title: '添加机构客户'
            },
            views: {
                "content@app": {
                    controller: 'OrgClientEditorController as vm',
                    templateUrl: 'app/client/views/org-client.html'
                }
            }
        })
        .state('app.client.individual.view', {
            url: '/clients/individual/view/:clientId',
            data: {
                title: '客户信息查看'
            },
            views: {
                "content@app": {
                    controller: 'IndClientEditorController as vm',
                    templateUrl: 'app/client/views/ind-client.html'
                }
            }
        })
        .state('app.client.individual.new', {
            url: '/clients/individual/new',
            data: {
                title: '添加个人客户'
            },
            views: {
                "content@app": {
                    controller: 'IndClientEditorController as vm',
                    templateUrl: 'app/client/views/ind-client.html'
                }
            }
        })
});