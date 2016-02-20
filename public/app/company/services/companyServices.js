"use strict";

angular.module('app.company').factory('CompanyService',
    ['$q', '$http',
        function ($q, $http) {
            // return available functions for use in controllers
            return ({
                saveCompany: saveCompany,
                getCompanies: getCompanies,
                getCompany: getCompany,
                deleteCompany: deleteCompany,
            });

            function saveCompany(company) {
                // create a new instance of deferred
                var deferred = $q.defer();
                if (company._id) {
                    company.updated_at = Date.now();
                    $http.put('api/companies/' + company._id, company)
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
                    company.created_at = Date.now();
                    company.updated_at = company.created_at;
                    $http.post('api/companies', company)
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

            function getCompany(companyId) {
                // create a new instance of deferred
                var deferred = $q.defer();

                $http.get('api/companies/' + companyId)
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

            function deleteCompany(companyId) {
                // create a new instance of deferred
                var deferred = $q.defer();

                $http.delete('api/companies/' + companyId)
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

            function getCompanies() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.get('api/companies')
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