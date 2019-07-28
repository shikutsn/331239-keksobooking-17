'use strict';

(function () {
  var pins = [];


  var setData = function (data) {
    pins = data;
    console.log('data is set!: ', pins);
  };

  var getData = function () {
    return pins;
  };


  window.data = {
    setData: setData,
    getData: getData
  };
})();
