'use strict';

(function () {
  var pins = [];
  var dataLoaded = false;

  var setData = function (data) {
    pins = data;
    dataLoaded = true;
  };

  var getData = function () {
    return pins;
  };

  var isDataLoaded = function () {
    return dataLoaded;
  };

  var resetData = function () {
    pins = [];
    dataLoaded = false;
  };

  var getFiltered = function () {
    return window.filters.filterPins(getData());
  };

  window.data = {
    set: setData,
    get: getData,
    reset: resetData,
    isLoaded: isDataLoaded,
    getFiltered: getFiltered
  };
})();
