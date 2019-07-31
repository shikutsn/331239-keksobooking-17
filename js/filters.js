'use strict';

(function () {
  var SelectFiltersMap = {
    'housing-type': {
      'type': 'equal',
      'offerKey': 'type',
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
      'offerKey': 'price',
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
      'offerKey': 'rooms',
      'values': {
        'any': 'any',
        '1': 1,
        '2': 2,
        '3': 3
      }
    },
    'housing-guests': {
      'type': 'equal',
      'offerKey': 'guests',
      'values': {
        'any': 'any',
        '1': 1,
        '2': 2,
        '0': 0
      }
    }
  };
  var CheckboxFiltersMap = {
    'filter-wifi': 'wifi',
    'filter-dishwasher': 'dishwasher',
    'filter-parking': 'parking',
    'filter-washer': 'washer',
    'filter-elevator': 'elevator',
    'filter-conditioner': 'conditioner'
  };
  var FILTER_VALUE_ANY = 'any';
  var FILTER_CHECK_TYPE_EQUAL = 'equal';

  var filtersFormEl = document.querySelector('.map__filters');

  var getFilteredBySelects = function (pins) {
    for (var currentSelect in SelectFiltersMap) {
      if (SelectFiltersMap.hasOwnProperty(currentSelect)) {
        var currentSelectEl = filtersFormEl.querySelector('#' + currentSelect);
        var selectorValue = SelectFiltersMap[currentSelect].values[currentSelectEl.value];
        if (selectorValue !== FILTER_VALUE_ANY) {
          var checkType = SelectFiltersMap[currentSelect].type;
          pins = pins.filter(function (currentPin) {
            var offerValue = currentPin.offer[SelectFiltersMap[currentSelect].offerKey];
            if (checkType === FILTER_CHECK_TYPE_EQUAL) {
              return selectorValue === offerValue;
            }
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

  var filterPins = function (pins) {
    return getFilteredBySelects(getFilteredByCheckboxes(pins));
  };

  var onFiltersFormChange = function () {
    window.card.remove();
    window.map.clearCurrentPins();
    window.map.renderPins(window.data.getFiltered());
  };

  var onFiltersFormChangeDebounced = window.util.debounce(onFiltersFormChange);

  filtersFormEl.addEventListener('change', onFiltersFormChangeDebounced);

  window.filters = {
    filterPins: filterPins
  };
})();
