"use strict";


angular.module('app.policy', ['ui.router'])


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
        .state('app.policy.edit', {
            url: '/policies/edit/:policyId',
            data: {
                title: '保单修改'
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
});