(function () {
  angular
    .module('validation.rule', ['validation'])
    .config(['$validationProvider', function ($validationProvider) {
      var expression = {
        required: function (value) {
          return !!value;
        },
        url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
        number: /^\d+$/,
        plate: /^[a-zA-Z]{1}[a-zA-Z_0-9]{5}$/,
        minlength: function (value, scope, element, attrs, param) {
          return value.length >= param;
        },
        maxlength: function (value, scope, element, attrs, param) {
          return value.length <= param;
        },
        nonNegative: /^\\d+(\\.\\d+)?$/,
        identity: function (value) {
          if (!value) {
            return true;
          }
          return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value);
        },
        phone: function (value) {
          if (/^1[3|4|5|7|8]\d{9}$/.test(value)) {
            return true;
          }
          else if(/^0(\d{2,3}\-?)?\d{7,8}$/.test(value)){
            return true;
          }
          return false;
        },
      };

      var defaultMsg = {
        required: {
          error: '此项不能为空',
        },
        url: {
          error: 'This should be Url',
        },
        email: {
          error: 'This should be Email',
        },
        number: {
          error: '请输入数字',
        },
        minlength: {
          error: '输入少于最小长度',
        },
        maxlength: {
          error: '输入超过最大长度',
        },
        nonNegative: {
          error: '金额格式不正确',
        },
        identity: {
          error: '身份证号格式不正确',
        },
        phone: {
          error: '电话号码格式不正确',
        },
        plate: {
          error: '车牌号码格式不正确',
        }        
      };
      $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
      $validationProvider.setValidMethod('blur');
    }]);
}).call(this);
