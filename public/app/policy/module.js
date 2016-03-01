"use strict";


angular.module('app.policy', ['ui.router','validation','ui.select'])


angular.module('app.policy').config(function ($stateProvider) {

    $stateProvider
        .state('app.policy', {
            abstract: true,
            data: {
                title: '保单'
            }
        })
        .state('app.policy.new', {
            url: '/policies/new',
            data: {
                title: '保单录入'
            },
            views: {
                "content@app": {
                    controller: 'PolicyEditorController as vm',
                    templateUrl: 'app/policy/views/policy.html'
                }
            }
        })
        .state('app.policy.pay', {
            url: '/policies/pay/:policyId',
            data: {
                title: '保单支付'
            },
            views: {
                "content@app": {
                    controller: 'PolicyEditorController as vm',
                    templateUrl: 'app/policy/views/policy.html'
                }
            }
        })
        .state('app.policy.view', {
            url: '/policies/view/:policyId',
            data: {
                title: '保单查看'
            },
            views: {
                "content@app": {
                    controller: 'PolicyEditorController as vm',
                    templateUrl: 'app/policy/views/policy.html'
                }
            }
        })
        .state('app.policy.to-be-paid', {
            url: '/policies/to-be-paid',
            data: {
                title: '待支付保单'
            },
            views: {
                "content@app": {
                    controller: 'PolicyListController as vm',
                    templateUrl: 'app/policy/views/policy-list.html'
                }
            },
            resolve: {
                srcipts: function(lazyScript){
                    return lazyScript.register([
                        'datatables',
                        'datatables-bootstrap',
                        'datatables-colvis',
                        'datatables-tools',
                        'datatables-responsive'
                    ])

                }
            }
        })
        .state('app.policy.paid', {
            url: '/policies/paid',
            data: {
                title: '已支付保单'
            },
            views: {
                "content@app": {
                    controller: 'PolicyListController as vm',
                    templateUrl: 'app/policy/views/policy-list-paid.html'
                }
            },
            resolve: {
                srcipts: function(lazyScript){
                    return lazyScript.register([
                        'datatables',
                        'datatables-bootstrap',
                        'datatables-colvis',
                        'datatables-tools',
                        'datatables-responsive'
                    ])

                }
            }
        })
});