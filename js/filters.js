'use strict';

(function () {
  var SelectFiltersMap = {
    'housing-type': {
      'type': 'equal',
      'key': 'type',
      'values': {
        'any': 'any',
        'palace': 'palace',
        'flat': 'flat',
        'house': 'house',
        'bungalo': 'bungalo'
      }
    },
    'housing-price': {
      'type': 'range',
      'key': 'price',
      'values': {
        'any': 'any',
        'low': {
          MIN: 0,
          MAX: 9999
        },
        'middle': {
          MIN: 10000,
          MAX: 49999
        },
        'high': {
          MIN: 50000,
          MAX: Infinity
        }
      }
    },
    'housing-rooms': {
      'type': 'equal',
      'key': 'rooms',
      'values': {
        'any': 'any',
        '1': 1,
        '2': 2,
        '3': 3
      }
    },
    'housing-guests': {
      'type': 'equal',
      'key': 'guests',
      'values': {
        'any': 'any',
        '1': 1,
        '2': 2,
        '0': 0
      }
    }
  };
  // var FilterTypeMap = {
  //   'equal': function (a, b) {
  //     return a === b;
  //   },
  //   'range': function (value, min, max) {
  //     return (value >= min && value <= max);
  //   }
  // };
  // TODO переименовать в BooleanFilters!
  var CheckboxFiltersMap = {
    'filter-wifi': 'wifi',
    'filter-dishwasher': 'dishwasher',
    'filter-parking': 'parking',
    'filter-washer': 'washer',
    'filter-elevator': 'elevator',
    'filter-conditioner': 'conditioner'
  };

  var filtersFormEl = document.querySelector('.map__filters');

  var getFilteredBySelects = function (pins) {
    for (var currentSelect in SelectFiltersMap) {
      if (SelectFiltersMap.hasOwnProperty(currentSelect)) {
        var currentSelectEl = filtersFormEl.querySelector('#' + currentSelect);
        var selectorValue = SelectFiltersMap[currentSelect].values[currentSelectEl.value];
        if (selectorValue !== 'any') {
          var checkType = SelectFiltersMap[currentSelect].type;
          pins = pins.filter(function (currentPin) {
            var offerValue = currentPin.offer[SelectFiltersMap[currentSelect].key];
            if (checkType === 'equal') {
              return selectorValue === offerValue;
            }
            // проверка checkType на range избытычна, но если бы типов проверок было 3, то ...
            return offerValue >= selectorValue.MIN && offerValue <= selectorValue.MAX;
          });
        }
      }
    }
    return pins;
  };

  var getFilteredByCheckboxes = function (pins) {
    for (var currentCheckbox in CheckboxFiltersMap) {
      if (CheckboxFiltersMap.hasOwnProperty(currentCheckbox)) {
        var currentCheckboxEl = filtersFormEl.querySelector('#' + currentCheckbox);
        if (currentCheckboxEl.checked) {
          pins = pins.filter(function (currentPin) {
            return currentPin.offer.features.some(function (currentFeature) {
              return currentFeature === CheckboxFiltersMap[currentCheckbox];
            });
          });
        }
      }
    }
    return pins;
  };

  var getFilteredPins = function () {
    // TODO: это - плохая функция. Она и наружу торчит и перефильтровывает все по вызову, а не хранит где-нибудь в глобальной для модуля переменной
    var filteredPins = window.data.get();
    return getFilteredBySelects(getFilteredByCheckboxes(filteredPins));
  };

  var onFiltersFormChange = function () {
    window.card.remove();
    window.map.clearCurrentPins();
    window.map.renderPins(getFilteredPins());
  };

  var onFiltersFormChangeDebounced = window.util.debounce(onFiltersFormChange);

  filtersFormEl.addEventListener('change', onFiltersFormChangeDebounced);

  window.filters = {
    getPins: getFilteredPins
  };
})();
