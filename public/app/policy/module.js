"use strict";


angular.module('app.policy', ['ui.router'])


angular.module('app.policy').config(function ($stateProvider) {

    $stateProvider
        .state('app.policy', {
            abstract: true,
            data: {
                title: 'Forms'
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
});