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
            url: '/companies/view/:companyId',
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
        .state('app.company.companycatogory', {
            abstract: true,
            data: {
                title: '一级保险公司管理'
            }
        })
        .state('app.company.companycatogory.all', {
            url: '/companies/companycatogories',
            data: {
                title: '一级保险公司'
            },
            views: {
                "content@app": {
                    controller: 'CompanyCatogoryListController as vm',
                    templateUrl: 'app/company/views/company-catogory-list.html'
                }
            }
        })
        .state('app.company.companycatogory.view', {
            url: '/companies/compnaycatogories/view/:companyCatogoryId',
            data: {
                title: '一级保险公司查看'
            },
            views: {
                "content@app": {
                    controller: 'CompanyCatogoryEditorController as vm',
                    templateUrl: 'app/company/views/company-catogory.html'
                }
            }
        })
        .state('app.company.companycatogory.new', {
            url: '/companies/companycatogories/new',
            data: {
                title: '添加一级保险公司'
            },
            views: {
                "content@app": {
                    controller: 'CompanyCatogoryEditorController as vm',
                    templateUrl: 'app/company/views/company-catogory.html'
                }
            }
        })
        .state('app.company.policyname', {
            abstract: true,
            data: {
                title: '险种名称管理'
            }
        })
        .state('app.company.policyname.all', {
            url: '/companies/policynames',
            data: {
                title: '险种名称'
            },
            views: {
                "content@app": {
                    controller: 'PolicyNameListController as vm',
                    templateUrl: 'app/company/views/policy-name-list.html'
                }
            }
        })
        .state('app.company.policyname.view', {
            url: '/companies/policynames/view/:policyNameId',
            data: {
                title: '险种名称查看'
            },
            views: {
                "content@app": {
                    controller: 'PolicyNameEditorController as vm',
                    templateUrl: 'app/company/views/policy-name.html'
                }
            }
        })
        .state('app.company.policyname.new', {
            url: '/companies/policynames/new',
            data: {
                title: '添加险种名称'
            },
            views: {
                "content@app": {
                    controller: 'PolicyNameEditorController as vm',
                    templateUrl: 'app/company/views/policy-name.html'
                }
            }
        })
});