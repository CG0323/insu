'use strict'

angular.module('app.policy-editor').controller('PolicyEditorController', function($scope, PolicyService){
    var vm = this;
    vm.policy = {};
    
    vm.save = function(){
        console.log(vm.policy);
    };
});