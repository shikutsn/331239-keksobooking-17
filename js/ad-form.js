'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MAIN_PIN_DEFAULT_STYLE = 'left: 570px; top: 375px;';
  var AVATAR_DEFAULT_SRC = 'img/muffin-grey.svg';
  var ApartmentImageData = {
    ALT_TEXT: 'Фотография жилья',
    WIDTH: '70',
    HEIGHT: '70'
  };

  var adFormEl = document.querySelector('.ad-form');
  var filtersFormEl = document.querySelector('.map__filters');
  var resetBtnEl = adFormEl.querySelector('.ad-form__reset');

  var mainEl = document.querySelector('main');
  var successTemplateEl = document.querySelector('#success').content.querySelector('.success');
  var errorTemplateEl = document.querySelector('#error').content.querySelector('.error');

  var avatarFileEl = adFormEl.querySelector('#avatar');
  var avatarImageEl = adFormEl.querySelector('.ad-form-header__preview img');
  var photoContainerEl = adFormEl.querySelector('.ad-form__photo-container');
  var photoFileEl = photoContainerEl.querySelector('#images');
  var photoEl = photoContainerEl.querySelector('.ad-form__photo');

  var resetPage = function () {
    // TODO: как-то тут вызываются функции отовсюду =(
    // TODO: возможно, сделать одну функцию, которая вызывает методы сброса форм объявления и фильтров, если она еще где-нибудь понадобится
    // TODO А вообще, наверное, эту функцию стоит объединить с setMapActive, ведь по сути делают они все только вместе - вкл/выкл страницу
    adFormEl.reset();
    filtersFormEl.reset();

    // TODO выделить в отдельную функцию
    // очистка аватарки
    avatarImageEl.src = AVATAR_DEFAULT_SRC;
    // очистка фоток
    var uploadedPhotos = adFormEl.querySelectorAll('.ad-form__photo');
    uploadedPhotos.forEach(function (currentPhoto, index) {
      if (!index) {
        var imgEl = currentPhoto.querySelector('img');
        if (imgEl) {
          imgEl.remove();
        }
      } else {
        currentPhoto.remove();
      }
    });

    window.map.clearCurrentPins();
    window.card.remove();

    var mainPinEl = document.querySelector('.map__pin--main');
    mainPinEl.style = MAIN_PIN_DEFAULT_STYLE;
    // FIXME убрать эту константу (перемещая функцию fillAddress)
    // FIXME или сделать функцию в модуле map типа resetMainPin()
    var MainPinPointerOffset = {
      X: -31,
      Y: -84 // проверить 80 или 84. Думаю, что 84 (картинка 62 и стрелка еще 22)
    };
    window.map.fillAddress(mainPinEl, MainPinPointerOffset);
    window.map.setActive(false);
  };

  var onResetBtnClick = function () {
    resetPage();
  };

  resetBtnEl.addEventListener('click', onResetBtnClick);

  var uploadSuccess = function () {
    resetPage();

    var successPopupEl = successTemplateEl.cloneNode(true);
    mainEl.appendChild(successPopupEl);

    var removeSuccessPopup = function () {
      successPopupEl.remove();
      document.removeEventListener('click', onSuccessPopupClick);
      document.removeEventListener('keydown', onSuccessPopupEscPress);
    };

    var onSuccessPopupClick = function () {
      removeSuccessPopup();
    };

    var onSuccessPopupEscPress = function (evt) {
      if (window.util.isEscPressed(evt)) {
        removeSuccessPopup();
      }
    };

    document.addEventListener('click', onSuccessPopupClick);
    document.addEventListener('keydown', onSuccessPopupEscPress);
  };

  var uploadError = function () {
    var errorPopupEl = errorTemplateEl.cloneNode(true);
    mainEl.appendChild(errorPopupEl);

    var errorPopupCloseBtnEl = errorPopupEl.querySelector('.error__button');

    var removeErrorPopup = function () {
      errorPopupEl.remove();
      document.removeEventListener('click', onErrorPopupClick);
      document.removeEventListener('keydown', onErrorPopupEscPress);
    };

    var onErrorPopupClick = function () {
      removeErrorPopup();
    };

    var onErrorPopupEscPress = function (evt) {
      if (window.util.isEscPressed(evt)) {
        removeErrorPopup();
      }
    };

    var onErrorPopupCloseBtnClick = function () {
      removeErrorPopup();
    };

    errorPopupCloseBtnEl.addEventListener('click', onErrorPopupCloseBtnClick);
    document.addEventListener('click', onErrorPopupClick);
    document.addEventListener('keydown', onErrorPopupEscPress);
  };

  adFormEl.addEventListener('submit', function (evt) {
    if (window.validation.form()) {
      var uploadData = new FormData(adFormEl);
      evt.preventDefault();
      window.backend.upload(uploadData, uploadSuccess, uploadError);
    }
  });

  // TODO Возможно, выделить в отдельный модуль все манипуляции с файлами в форме (аватарки, перетаскивания и тд)
  var loadImgFromDisc = function (fileEl, imageEl) {
    var file = fileEl.files[0];
    if (file) {
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          imageEl.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    }
  };

  avatarFileEl.addEventListener('change', function () {
    loadImgFromDisc(avatarFileEl, avatarImageEl);
  });

  var createImage = function () {
    var imageEl = document.createElement('img');

    imageEl.alt = ApartmentImageData.ALT_TEXT;
    imageEl.width = ApartmentImageData.WIDTH;
    imageEl.height = ApartmentImageData.HEIGHT;

    return imageEl;
  };

  photoFileEl.addEventListener('change', function () {
    // TODO реализовать просмотр полноэкранных фоток и их упорядочивание перетаскиванием
    // TODO на самом деле перетаскивание тоже пока что не поддерживается
    // TODO да и аватарку перетащить нельзя
    if (!photoContainerEl.querySelector('.ad-form__photo img')) {
      photoEl.remove();
    }

    var imageEl = createImage();
    loadImgFromDisc(photoFileEl, imageEl);
    var newImageEl = photoEl.cloneNode(true);
    newImageEl.insertAdjacentElement('afterbegin', imageEl);
    photoContainerEl.insertAdjacentElement('beforeend', newImageEl);
  });

})();
