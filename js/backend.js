'use strict';

(function () {
  var RESPONSE_CODE_OK = 200;
  var TIMEOUT = 10000;
  var REQUEST_GET = 'GET';
  var REQUEST_POST = 'POST';

  var createXHRequest = function (method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === RESPONSE_CODE_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };


  window.backend = {
    download: function (url, onSuccess, onError) {
      createXHRequest(REQUEST_GET, url, onSuccess, onError);
    },
    upload: function (url, data, onSuccess, onError) {
      createXHRequest(REQUEST_POST, url, onSuccess, onError, data);
    }
  };
})();
