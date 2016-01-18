"use strict";


angular.module('app.policy-editor', ['ui.router'])


angular.module('app.policy-editor').config(function ($stateProvider) {

    $stateProvider
        .state('app.policy-editor', {
            abstract: true,
            data: {
                title: 'Forms'
            }
        })
        .state('app.policy-editor.new', {
            url: '/policies/new',
            data: {
                title: '保单录入'
            },
            views: {
                "content@app": {
                    controller: 'PolicyEditorController as vm',
                    templateUrl: 'app/policy-editor/views/policy-editor.html'
                }
            }
        })
});