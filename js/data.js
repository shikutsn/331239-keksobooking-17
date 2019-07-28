'use strict';

(function () {
  var pins = [];


  var setData = function (data) {
    pins = data;
    console.log('data is set!: ', pins);
  };


  window.data = {
    setData: setData,
  };
})();
