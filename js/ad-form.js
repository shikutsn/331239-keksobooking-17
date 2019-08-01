'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
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

  var resetUploadedImages = function () {
    avatarImageEl.src = AVATAR_DEFAULT_SRC;

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
  };

  var resetPage = function () {
    adFormEl.reset();
    filtersFormEl.reset();
    resetUploadedImages();
    window.card.remove();
    window.map.clearCurrentPins();
    window.map.resetMainPin();
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

  var showErrorPopup = function () {
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
      window.backend.upload(uploadData, uploadSuccess, showErrorPopup);
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
    if (!photoContainerEl.querySelector('.ad-form__photo img')) {
      photoEl.remove();
    }

    var imageEl = createImage();
    loadImgFromDisc(photoFileEl, imageEl);
    var newImageEl = photoEl.cloneNode(true);
    newImageEl.insertAdjacentElement('afterbegin', imageEl);
    photoContainerEl.insertAdjacentElement('beforeend', newImageEl);
  });

  window.adForm = {
    showErrorPopup: showErrorPopup
  };
})();
