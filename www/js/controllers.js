angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
.controller('SearchListCtrl', function($scope,Chats,$timeout) {
      $scope.items =  Chats.GetFeed();
      /* Chats.GetFeed().then(function(items){
        $scope.items = items;
      });*/
      $scope.doRefresh = function() {
        $scope.items = Chats.GetFeed();
        $scope.$broadcast('scroll.refreshComplete');
      }
      //更多
      $scope.doRefresh1 = function() {
        //这里使用定时器是为了缓存一下加载过程，防止加载过快
        $timeout(function() {
          $scope.items =  $scope.items.concat(Chats.GetNewUser());
          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.infiniteScrollComplete');
        },500);
      };
})
.controller('SearchDetailCtrl', function($scope,$stateParams,Chats) {
  $scope.item = Chats.get($stateParams.id);
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
})
.controller('BrowseCtrl', function($scope, browseService) {
      browseService.events().success(function(data, status, headers) {
            $scope.data1 = data;
          });
})
    .controller('ReorderCtrl', function($scope) {
        $scope.items = [1, 2, 3, 4];
        $scope.moveItem = function(item, fromIndex, toIndex) {
            //Move the item in the array
            $scope.items.splice(fromIndex, 1);
            $scope.items.splice(toIndex, 0, item);
        };
    })
    .controller('TabsCtrl', function($scope) {
        $scope.activeContent = "orders";
        $scope.setActiveContent = function(activeContent) {
            //Move the item in the array
            $scope.activeContent=activeContent;
        };
    })
    .controller('CameraCtrl', function($scope,$cordovaCamera) {

     /*   document.addEventListener("deviceready", function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $scope.cameraClick=function(){
               return $cordovaCamera.getPicture(options).then(function(imageData) {
                    var image = document.getElementById('myImage');
                    image.src = "data:image/jpeg;base64," + imageData;
                }, function(err) {
                    alert(err);
                });
            };
        }, false);*/
    })
;
