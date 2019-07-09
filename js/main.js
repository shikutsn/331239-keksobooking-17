'use strict';

(function () {


  var onLoadingSuccess = function (pins) {
    window.data.pins = pins;

    // отладка в левом верхнем углу
    console.log(window.data.pins);
    window.data.pins[0].location.x = 1;
    window.data.pins[0].location.y = 130;
    // ---------------


    // window.data.discussedPhotos = [];
    window.map.renderMapPins(pins);
    // window.filters.showFiltersForm();

    // временно для 4-го задания
    document.querySelector('.map').classList.remove('map--faded');
    // ------------------

  };

  window.data.getMockData(onLoadingSuccess);

})();
