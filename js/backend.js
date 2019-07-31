'use strict';

(function () {
  var RESPONSE_CODE_OK = 200;
  var TIMEOUT = 10000;
  var Url = {
    DOWNLOAD: 'https://js.dump.academy/keksobooking/data',
    UPLOAD: 'https://js.dump.academy/keksobooking'
  };

  var RequestMethod = {
    GET: 'GET',
    POST: 'POST'
  };

  var createXHRequest = function (method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === RESPONSE_CODE_OK) {
        return onSuccess(xhr.response);
      }
      return onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
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
      return xhr.send(data);
    }
    return xhr.send();
  };

  window.backend = {
    download: function (onSuccess, onError) {
      return createXHRequest(RequestMethod.GET, Url.DOWNLOAD, onSuccess, onError);
    },
    upload: function (data, onSuccess, onError) {
      return createXHRequest(RequestMethod.POST, Url.UPLOAD, onSuccess, onError, data);
    }
  };
})();
