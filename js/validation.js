'use strict';

(function () {
  var InvalidFieldStyles = {
    VALIDITY: 'outline',
    INVALID: '3px dashed red',
    VALID: 'none'
  };
  var TitleFieldValidationData = {
    LENGTH: {
      MIN: 30,
      MAX: 100
    },
    INVALID_TEXT: 'Не меньше 30 и не больше 100 символов.'
  };
  var PriceFieldValidationData = {
    MAX_VALUE: 1000000,
    INVALID_TEXT: {
      MAX: 'Не больше 1 000 000.',
      MIN: 'Не меньше '
    }
  };
  var TypeFieldValidationData = {
    'bungalo': {
      MIN_PRICE: 0
    },
    'flat': {
      MIN_PRICE: 1000
    },
    'house': {
      MIN_PRICE: 5000
    },
    'palace': {
      MIN_PRICE: 10000
    },
  };
  var RoomCountValidationData = {
    '100': {
      CORRECT_VALUES: ['0'],
      INVALID_TEXT: 'Для выбранного числа комнат допустимо только значение "Не для гостей".'
    },
    '3': {
      CORRECT_VALUES: ['3', '2', '1'],
      INVALID_TEXT: 'Для выбранного числа комнат допустимы значения "Количество мест: для 1, 2, 3 гостей".'
    },
    '2': {
      CORRECT_VALUES: ['2', '1'],
      INVALID_TEXT: 'Для выбранного числа комнат допустимы значения "Количество мест: для 1, 2 гостей".'
    },
    '1': {
      CORRECT_VALUES: ['1'],
      INVALID_TEXT: 'Для выбранного числа комнат допустимы значения "Количество мест: для одного гостя".'
    }
  };

  var adFormEl = document.querySelector('.ad-form');
  var titleEl = adFormEl.querySelector('#title');
  var typeEl = adFormEl.querySelector('#type');
  var priceEl = adFormEl.querySelector('#price');
  var timeinEl = adFormEl.querySelector('#timein');
  var timeoutEl = adFormEl.querySelector('#timeout');
  var roomCountEl = adFormEl.querySelector('#room_number');
  var capacityEl = adFormEl.querySelector('#capacity');

  var setFieldStyle = function (fieldEl, isValid) {
    fieldEl.style[InvalidFieldStyles.VALIDITY] = isValid ? InvalidFieldStyles.VALID : InvalidFieldStyles.INVALID;
  };

  var isTitleFieldValid = function (titleFieldEl) {
    var currentLength = titleFieldEl.value.length;
    return currentLength >= TitleFieldValidationData.LENGTH.MIN && currentLength <= TitleFieldValidationData.LENGTH.MAX;
  };

  var setTitleFieldState = function (titleFieldEl, isValid) {
    setFieldStyle(titleFieldEl, isValid);
    return isValid ? titleFieldEl.setCustomValidity('') : titleFieldEl.setCustomValidity(TitleFieldValidationData.INVALID_TEXT);
  };

  var validateTitleField = function () {
    var result = isTitleFieldValid(titleEl);
    setTitleFieldState(titleEl, result);
    return result;
  };

  var isPriceFieldValid = function (priceField) {
    var minPrice = TypeFieldValidationData[typeEl.value].MIN_PRICE;
    return priceField.value > minPrice && priceField.value <= PriceFieldValidationData.MAX_VALUE;
  };

  var setPriceFieldState = function (priceField, isValid) {
    setFieldStyle(priceField, isValid);
    if (isValid) {
      return priceField.setCustomValidity('');
    }

    var minPrice = TypeFieldValidationData[typeEl.value].MIN_PRICE;
    var invalidText = '';
    if (minPrice) {
      invalidText = PriceFieldValidationData.INVALID_TEXT.MIN + minPrice + '. ';
    }
    invalidText += PriceFieldValidationData.INVALID_TEXT.MAX;
    return priceField.setCustomValidity(invalidText);
  };

  var validatePriceField = function () {
    var result = isPriceFieldValid(priceEl);
    setPriceFieldState(priceEl, result);
    return result;
  };

  var onTypeFieldChange = function () {
    priceEl.placeholder = TypeFieldValidationData[typeEl.value].MIN_PRICE;
    // так как параметры типа апартаментов изменились, надо вручную проверить, что поле цены валидно
    validatePriceField();
  };

  var onTimeinFieldChange = function () {
    timeoutEl.selectedIndex = timeinEl.selectedIndex;
  };

  var onTimeoutFieldChange = function () {
    timeinEl.selectedIndex = timeoutEl.selectedIndex;
  };

  var isCapacityFieldValid = function () {
    return RoomCountValidationData[roomCountEl.value].CORRECT_VALUES.some(function (it) {
      return it === capacityEl.value;
    });
  };

  var setCapacityFieldState = function (capacityField, isValid) {
    setFieldStyle(capacityField, isValid);
    return isValid ? capacityField.setCustomValidity('') : capacityField.setCustomValidity(RoomCountValidationData[roomCountEl.value].INVALID_TEXT);
  };

  var onAccomodationChange = function () {
    var result = isCapacityFieldValid();
    setCapacityFieldState(capacityEl, result);
    return result;
  };

  var validateForm = function () {
    return (validateTitleField() && validatePriceField());
  };

  var initialFormValidation = function () {
    // для поля числа комнат в разметке указано несоответствующее числу гостей значение,
    // а без их изменения не происходит валидации, поэтому вручную вызову валидацию на инициализации
    onAccomodationChange();
    // для указанного в разметке типа апартаментов плейсхолдер цены неправильный, поэтому вручную вызову валидацию на инициализации
    onTypeFieldChange();
  };

  var onTitleFieldInput = function () {
    validateTitleField();
  };

  var onPriceFieldInput = function () {
    validatePriceField();
  };


  titleEl.addEventListener('input', onTitleFieldInput);
  priceEl.addEventListener('input', onPriceFieldInput);

  typeEl.addEventListener('change', onTypeFieldChange);
  timeinEl.addEventListener('change', onTimeinFieldChange);
  timeoutEl.addEventListener('change', onTimeoutFieldChange);
  capacityEl.addEventListener('change', onAccomodationChange);
  roomCountEl.addEventListener('change', onAccomodationChange);

  window.validation = {
    init: initialFormValidation,
    form: validateForm
  };
})();
