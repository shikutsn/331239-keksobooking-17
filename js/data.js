'use strict';

(function () {
  var pins = [];

  var setData = function (data) {
    pins = data;
    // delete pins[1].offer;
    // console.log('data is set!: ', pins);
  };

  var getData = function () {
    return pins;
  };

  window.data = {
    set: setData,
    get: getData
  };
})();
