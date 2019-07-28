'use strict';

(function () {
  var FiltersMap = {
    'housing-type': {
      'any': function () {
        return true;
      },
      'palace': function (it) {
        return it.offer.type === 'palace';
      },
      'flat': function (it) {
        return it.offer.type === 'flat';
      },
      'house': function (it) {
        return it.offer.type === 'house';
      },
      'bungalo': function (it) {
        return it.offer.type === 'bungalo';
      }
    },
    'housing-price': {
      // TODO Убрать магические числа из этого раздела фильтров
      'any': function () {
        return true;
      },
      'middle': function (it) {
        return it.offer.price >= 10000 && it.offer.price <= 50000;
      },
      'low': function (it) {
        return it.offer.price < 10000;
      },
      'high': function (it) {
        return it.offer.price > 50000;
      }
    },
    'housing-rooms': {
      'any': function () {
        return true;
      },
      '1': function (it) {
        return it.offer.rooms === 1;
      },
      '2': function (it) {
        return it.offer.rooms === 2;
      },
      '3': function (it) {
        return it.offer.rooms === 3;
      }
    },
    'housing-guests': {
      'any': function () {
        return true;
      },
      '1': function (it) {
        return it.offer.guests === 1;
      },
      '2': function (it) {
        return it.offer.guests === 2;
      },
      '0': function (it) {
        return it.offer.guests === 0;
      }
    }
    // TODO прикрутить сюда еще фильтр по чекбоксам и проверить, после отрисовки карточек, что все работает верно
  };

  var filtersFormEl = document.querySelector('.map__filters');

  var getFilteredPins = function () {
    var filteredPins = window.data.getData();

    for (var key in FiltersMap) {
      if (FiltersMap.hasOwnProperty(key)) {
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
    // var filteredPins = window.data.getData().filter(FiltersMap[evt.target.id][evt.target.value]);
    window.map.renderMapPins(getFilteredPins());
  };

  var onFiltersFormChangeDebounced = window.util.debounce(onFiltersFormChange);

  filtersFormEl.addEventListener('change', onFiltersFormChangeDebounced);

  window.filters = {
    getFilteredPins: getFilteredPins
  };
})();
