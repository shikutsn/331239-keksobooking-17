'use strict';

(function () {
  var FiltersMap = {
    'housing-type': {
      'any': function () {
        return true;
      },
      'palace': function (pins) {
        return pins.offer.type === 'palace';
      },
      'flat': function (pins) {
        return pins.offer.type === 'flat';
      },
      'house': function (pins) {
        return pins.offer.type === 'house';
      },
      'bungalo': function (pins) {
        return pins.offer.type === 'bungalo';
      }
    },
    'housing-price': {
      // TODO Убрать магические числа из этого раздела фильтров
      'any': function () {
        return true;
      },
      'middle': function (pins) {
        return pins.offer.price >= 10000 && pins.offer.price <= 50000;
      },
      'low': function (pins) {
        return pins.offer.price < 10000;
      },
      'high': function (pins) {
        return pins.offer.price > 50000;
      }
    },
    'housing-rooms': {
      'any': function () {
        return true;
      },
      '1': function (pins) {
        return pins.offer.rooms === 1;
      },
      '2': function (pins) {
        return pins.offer.rooms === 2;
      },
      '3': function (pins) {
        return pins.offer.rooms === 3;
      }
    },
    'housing-guests': {
      'any': function () {
        return true;
      },
      '1': function (pins) {
        return pins.offer.guests === 1;
      },
      '2': function (pins) {
        return pins.offer.guests === 2;
      },
      '0': function (pins) {
        return pins.offer.guests === 0;
      }
    }
    // TODO прикрутить сюда еще фильтр по чекбоксам и проверить, после отрисовки карточек, что все работает верно
  };

  var filtersFormEl = document.querySelector('.map__filters');

  var getFilteredPins = function () {
    // TODO: это - плохая функция. Она и наружу торчит и перефильтровывает все по вызову, а не хранит где-нибудь в глобальной для модуля переменной
    var filteredPins = window.data.get();

    for (var key in FiltersMap) {
      if (FiltersMap.hasOwnProperty(key)) {
        // FIXME лучше эту строчку упростить
        filteredPins = filteredPins.filter(FiltersMap[key][filtersFormEl.querySelector('#' + key).value]);
      }
    }

    return filteredPins;
  };

  var onFiltersFormChange = function () {
    // console.log('filters form change event has fired!');
    // console.log('evt.target: ', evt.target);
    // if (evt.target.value) {
    //   console.log('value: ', evt.target.value);
    // };
    // if (evt.target.checked) {
    //   console.log('checked: ', evt.target.checked);
    // }
    window.map.clearCurrentPins();
    // console.log(evt.target.id); // id для селектов
    // console.log(evt.target.value); // значение этих селектов
    // var filteredPins = window.data.get().filter(FiltersMap[evt.target.id][evt.target.value]);
    window.map.renderPins(getFilteredPins());
    // ---------------
    var tmp = document.querySelector('.map__checkbox');
    // TODO заводим мапу и value у чекнутого фильтра проверяем.
    console.log('map__checkbox: ', tmp.value);
  };

  var onFiltersFormChangeDebounced = window.util.debounce(onFiltersFormChange);

  filtersFormEl.addEventListener('change', onFiltersFormChangeDebounced);

  window.filters = {
    getPins: getFilteredPins
  };
})();
