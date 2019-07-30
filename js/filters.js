'use strict';

(function () {
  // FIXME подобные перечисления таки должны начинаться с маленькой буквы?
  var SelectFiltersMap = {
    // TODO Убрать магические числа из этого раздела фильтров
    // Мб хранить не сразу фильтрующие функции для каждого возможного значения селекта,
    // а хранить что где и на что проверять. Типа:
    // 'housing-type': {
    //   'key': 'type', // в массиве offer, то есть currentPin.offer.type
    //   'values': {
    //     'any': 'any', // с any подумать - либо вручную обрабатывать либо как-то упростить
    //     'palace': 'palace', // и тд
    //
    //     'middle': {
    //       'min': 5000,
    //       'max': 10000  // и если это объект, то запускать логику мин-макс
    //     }
    //   }
    // }
    'housing-type': {
      'any': function () {
        return true;
      },
      'palace': function (currentPin) {
        return currentPin.offer.type === 'palace';
      },
      'flat': function (currentPin) {
        return currentPin.offer.type === 'flat';
      },
      'house': function (currentPin) {
        return currentPin.offer.type === 'house';
      },
      'bungalo': function (currentPin) {
        return currentPin.offer.type === 'bungalo';
      }
    },
    'housing-price': {
      'any': function () {
        return true;
      },
      'middle': function (currentPin) {
        return currentPin.offer.price >= 10000 && currentPin.offer.price <= 50000;
      },
      'low': function (currentPin) {
        return currentPin.offer.price < 10000;
      },
      'high': function (currentPin) {
        return currentPin.offer.price > 50000;
      }
    },
    'housing-rooms': {
      'any': function () {
        return true;
      },
      '1': function (currentPin) {
        return currentPin.offer.rooms === 1;
      },
      '2': function (currentPin) {
        return currentPin.offer.rooms === 2;
      },
      '3': function (currentPin) {
        return currentPin.offer.rooms === 3;
      }
    },
    'housing-guests': {
      'any': function () {
        return true;
      },
      '1': function (currentPin) {
        return currentPin.offer.guests === 1;
      },
      '2': function (currentPin) {
        return currentPin.offer.guests === 2;
      },
      '0': function (currentPin) {
        return currentPin.offer.guests === 0;
      }
    }
  };
  // TODO переименовать в BooleanFilters!
  var CheckboxFiltersMap = {
    // для масштабируемости. Так то можно было вообще ограничиться массивом и для поиска инпута добавлять спереди 'filter-'
    // ставит в соответствие айди инпута и элемент в массиве offer.features
    'filter-wifi': 'wifi',
    'filter-dishwasher': 'dishwasher',
    'filter-parking': 'parking',
    'filter-washer': 'washer',
    'filter-elevator': 'elevator',
    'filter-conditioner': 'conditioner'
  };

  var filtersFormEl = document.querySelector('.map__filters');

  var getFilteredPins = function () {
    // TODO: это - плохая функция. Она и наружу торчит и перефильтровывает все по вызову, а не хранит где-нибудь в глобальной для модуля переменной
    var filteredPins = window.data.get();

    // TODO мб разделить на две функции - одна фильтрует по селектам, другая по чекбоксам. Или усложнить структуру данных для того, чтобы в одном цикле все обрабатывать?
    for (var currentSelect in SelectFiltersMap) {
      if (SelectFiltersMap.hasOwnProperty(currentSelect)) {
        var currentSelectEl = filtersFormEl.querySelector('#' + currentSelect);
        filteredPins = filteredPins.filter(SelectFiltersMap[currentSelect][currentSelectEl.value]);
      }
    }

    for (var currentCheckbox in CheckboxFiltersMap) {
      if (CheckboxFiltersMap.hasOwnProperty(currentCheckbox)) {
        var currentCheckboxEl = filtersFormEl.querySelector('#' + currentCheckbox);
        if (currentCheckboxEl.checked) {
          filteredPins = filteredPins.filter(function (currentPin) {
            return currentPin.offer.features.some(function (currentFeature) {
              return currentFeature === CheckboxFiltersMap[currentCheckbox];
            });
          });
        }
      }
    }
    return filteredPins;
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
