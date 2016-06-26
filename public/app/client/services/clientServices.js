"use strict";

angular.module('app.client').factory('ClientService',
    ['$q', '$http',
        function ($q, $http) {
            // return available functions for use in controllers
            return ({
                saveClient: saveClient,
                getOrgClients: getOrgClients,
                getIndClients: getIndClients,
                getLifeClients: getLifeClients,
                getClient: getClient,
                deleteClient: deleteClient,
                getFollowers: getFollowers,
                getWechatsByIds: getWechatsByIds
            });

            function saveClient(client) {
                // create a new instance of deferred
                var deferred = $q.defer();

                if (client._id) {
                    client.updated_at = Date.now();
                    $http.put('/api/clients/' + client._id, client)
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
                } else {
                    client.created_at = Date.now();
                    client.updated_at = client.created_at;
                    $http.post('/api/clients', client)
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

            function getClient(clientId) {
                // create a new instance of deferred
                var deferred = $q.defer();

                $http.get('/api/clients/' + clientId)
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

            function deleteClient(clientId) {
                // create a new instance of deferred
                var deferred = $q.defer();

                $http.delete('/api/clients/' + clientId)
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

            function getOrgClients() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.get('/api/clients?type=organization')
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

            function getIndClients() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.get('/api/clients?type=individual')
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
            
            function getLifeClients() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.get('/api/clients?type=life')
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
            
            function getFollowers() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.get('/wechat/followers')
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
            
            function getWechatsByIds(openIds) {

                // create a new instance of deferred
                var deferred = $q.defer();

                $http.post('/wechat/byids', openIds)
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
            
            
           
        }]);