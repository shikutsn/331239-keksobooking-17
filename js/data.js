'use strict';

(function () {
  // var getRandomComment = function (quantity) {
  //   var comments = [];

  //   for (var j = 0; j < quantity; j++) {
  //     comments.push({
  //       avatar: 'img/avatar-' + window.util.getRandomNumber(1, AVATARS_COUNT + 1) + '.svg',
  //       message: window.util.getRandomArrayElement(COMMENTS),
  //       name: window.util.getRandomArrayElement(NAMES)
  //     });
  //   }

  //   return comments;
  // };

  // var getRandomPhoto = function (index) {
  //   return {
  //     url: 'photos/' + index + '.jpg',
  //     likes: window.util.getRandomNumber(LIKES_MIN_COUNT, LIKES_MAX_COUNT),
  //     comments: getRandomComment(window.util.getRandomNumber(1, COMMENTS_MAX_COUNT + 1))
  //   };
  // };

  // var getPhotos = function (quantity) {
  //   var output = [];

  //   for (var i = 1; i <= quantity; i++) {
  //     output.push(getRandomPhoto(i));
  //   }

  //   return output;
  // };

  var AnnouncementData = {
    COUNT: 8,
    ORDINATE: {
      MIN: 130,
      MAX: 630
    },
    ABSCISS: {
      MIN: 0,
      MAX: 1200
    }
  }

  var APARTMENT_TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var announcements = [];

  var generateRandomAnnouncement = function (announcementNumber) {
    return {
      author: {
        avatar: 'img/avatars/user0' + announcementNumber + '.png'
      },
      offer: {
        type: APARTMENT_TYPES[window.util.getRandomNumber(0, APARTMENT_TYPES.length)]
      },
      location: {
        x: window.util.getRandomNumber(AnnouncementData.ABSCISS.MIN, AnnouncementData.ABSCISS.MAX + 1),
        y: window.util.getRandomNumber(AnnouncementData.ORDINATE.MIN, AnnouncementData.ORDINATE.MAX + 1)
      }
    }
  };

  for (var i = 1; i <= AnnouncementData.COUNT; i++) {
    announcements.push(generateRandomAnnouncement(i));
  }

  // отладка в левом верхнем углу
  console.log(announcements);
  announcements[0].location.x = 1;
  announcements[0].location.y = 130;

  window.data = {
    announcements: announcements
    // photos: [],
    // getMockData: function (onDataLoaded) {
    //   onDataLoaded(getPhotos(PHOTOS_COUNT));
    // }
  };
})();
