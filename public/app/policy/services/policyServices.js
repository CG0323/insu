"use strict";

angular.module('app.policy').factory('PolicyService',
    ['$q', '$http',
        function ($q, $http) {
            // return available functions for use in controllers
            return ({
                savePolicy: savePolicy,
                getPolicies: getPolicies,
                getClients: getClients,
                getPolicy: getPolicy,
                deletePolicy: deletePolicy
            });

            function savePolicy(policy) {
                // create a new instance of deferred
                var deferred = $q.defer();
                
                if(policy._id){
                    policy.updated_at = Date.now();
                    $http.put('/api/policies/'+policy._id, policy)
                    .success(function (data, status) {
                        if (status === 200) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(status);
                        }
                    })
                    .error(function (err) {
                        deferred.reject(status);
                    });
                }else{
                policy.created_at = Date.now();
                policy.updated_at = policy.created_at;
                $http.post('/api/policies', policy)
                // handle success
                    .success(function (data, status) {
                        if (status === 200) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(status);
                        }
                    })
                // handle error
                    .error(function (err) {
                        deferred.reject(status);
                    });
                }
                
                // return promise object
                return deferred.promise;
            }
            
            function getPolicies(type) {
                // create a new instance of deferred
                var deferred = $q.defer();

                var url = "/api/policies"
                if(type == "to-be-paid"){
                    url = "/api/policies/to-be-paid";
                }else if(type == "paid"){
                    url = "/api/policies/paid";
                }
                console.log(type);
                $http.get(url)
                // handle success
                    .success(function (data, status) {
                        if (status === 200) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(status);
                        }
                    })
                // handle error
                    .error(function (err) {
                        deferred.reject(status);
                    });

                // return promise object
                return deferred.promise;
            }

            function getPolicy(policyId) {
                // create a new instance of deferred
                var deferred = $q.defer();

                $http.get('/api/policies/' + policyId)
                    // handle success
                    .success(function (data, status) {
                        if (status === 200) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(status);
                        }
                    })
                    // handle error
                    .error(function (err) {
                        deferred.reject(status);
                    });

                // return promise object
                return deferred.promise;
            }

            function deletePolicy(policyId) {
                // create a new instance of deferred
                var deferred = $q.defer();

                $http.delete('/api/policies/' + policyId)
                    // handle success
                    .success(function (data, status) {
                        if (status === 200) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(status);
                        }
                    })
                    // handle error
                    .error(function (err) {
                        deferred.reject(status);
                    });

                // return promise object
                return deferred.promise;
            }

            function getClients() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.get('/api/clients')
                // handle success
                    .success(function (data, status) {
                        if (status === 200) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(status);
                        }
                    })
                // handle error
                    .error(function (data) {
                        deferred.reject(status);
                    });

                // return promise object
                return deferred.promise;
            }
        }]);