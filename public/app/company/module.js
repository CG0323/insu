"use strict";


angular.module('app.company', ['ui.router','validation'])


angular.module('app.company').config(function ($stateProvider) {

    $stateProvider
       .state('app.company', {
            abstract: true,
            data: {
                title: '保险公司管理'
            }
        })
        .state('app.company.all', {
            url: '/companies',
            data: {
                title: '保险公司'
            },
            views: {
                "content@app": {
                    controller: 'CompanyListController as vm',
                    templateUrl: 'app/company/views/company-list.html'
                }
            }
        })
        .state('app.company.view', {
            url: '/view/:companyId',
            data: {
                title: '保险公司查看'
            },
            views: {
                "content@app": {
                    controller: 'CompanyEditorController as vm',
                    templateUrl: 'app/company/views/company.html'
                }
            }
        })
        .state('app.company.new', {
            url: '/companies/new',
            data: {
                title: '添加保险公司'
            },
            views: {
                "content@app": {
                    controller: 'CompanyEditorController as vm',
                    templateUrl: 'app/company/views/company.html'
                }
            }
        })
});