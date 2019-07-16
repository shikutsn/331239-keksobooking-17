'use strict';

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';


  var onLoadingError = function (errorMessage) {
    // посмотреть, возможно, тут другая верстка сообщения о сетевой ошибке
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.padding = '20px';
    node.style.width = '100%';
    node.style.left = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var onLoadingSuccess = function (pins) {
    window.data.pins = pins;

    // отладка в левом верхнем углу
    // console.log(window.data.pins);
    window.data.pins[0].location.x = 1;
    window.data.pins[0].location.y = 130;
    // console.log(window.data.pins);
    // ---------------


    // window.data.discussedPhotos = [];
    window.map.renderMapPins(pins);
    // window.filters.showFiltersForm();

    // временно для 4-го задания
    // document.querySelector('.map').classList.remove('map--faded');
    // document.querySelector('.map--faded .map__filters').opacity = 1;
    // ------------------

    // после загрузки делаем карту активной
    // но пока что не делаем
    // window.map.setMapActive();
    // TODO: сделать трали-вали
  };

  // window.data.getMockData(onLoadingSuccess);

  // данные загружать, но не рисовать до клика по главному пину что ли?
  window.backend.load(DOWNLOAD_URL, onLoadingSuccess, onLoadingError);
  window.map.setMapInactive();
})();
