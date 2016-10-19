"use strict";

angular.module('app.policy').factory('PolicyImportService',
    ['$q', '$http',
        function ($q, $http) {
            // return available functions for use in controllers
            return ({
                readExcel: readExcel,
            });


            function readExcel(file,level1_company,level2_company,level3_company,level4_company,clientInfo) {
                // create a new instance of deferred
                var deferred = $q.defer();
                var reader = new FileReader();
                var name = file.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });

                    var first_sheet_name = workbook.SheetNames[1];
                    var sheet = workbook.Sheets[first_sheet_name];
                    //
                    var range = XLSX.utils.decode_range(sheet['!ref']);
                    var sheetData = [];

                    _.forEachRight(_.range(range.s.r, range.e.r + 1), function (row) {
                        var rowData = [];
                        _.forEachRight(_.range(range.s.c, range.e.c + 1), function (column) {
                            var cellIndex = XLSX.utils.encode_cell({
                                'c': column,
                                'r': row
                            });
                            var cell = sheet[cellIndex];
                            rowData[column] = cell ? cell.v : undefined;
                        });
                        sheetData[row] = rowData;
                    });
                    var policies = [];
                    for(var i = 1; i < sheetData.length; i++){
                        var row = sheetData[i];
                        var policy = {};
                        policy.policy_no = row[0];
                        policy.plate = row[1];
                        policy.applicant = row[2];
                        policy.policy_name = row[3];
                        policy.fee = row[4];
                        policy.income_rate = row[5];
                        policy.income = row[6];
                        policy.created_at = row[7];
                        policy.level1_company = level1_company;
                        policy.level2_company = level2_company;
                        policy.level3_company = level3_company;
                        policy.level4_company = level4_company;
                        policy.payment_substract_rate = clientInfo.payment_substract_rate;
                        policy.payment = policy.income * (1-policy.payment_substract_rate / 100);
                        policies.push(policy);
                    }
                    deferred.resolve(policies);
                }

                reader.readAsBinaryString(file);

                return deferred.promise;

            }

        }]);