// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
//'ngCordova'
angular.module('starter', ['ionic','routeStyles', 'starter.controllers','starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
   /* cache:false,*/
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: 'SearchListCtrl',
        css: 'css/style1.css'
      }
    }
  })
  .state('app.search-detail', {
    url: "/search/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/searchDetail.html",
        controller: 'SearchDetailCtrl'
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html",
        controller:"BrowseCtrl"
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  })
  .state('app.reorder', {
    url: "/reorder",
    views: {
      'menuContent': {
        templateUrl: "templates/ionReorderButtonDemo.html",
        controller: 'ReorderCtrl'
      }
    }
  })
.state('app.tabs', {
  url: "/tabs",
  views: {
    'menuContent': {
      templateUrl: "templates/tabs.html",
      controller: 'TabsCtrl'
    }
  }
})
      .state('app.qinjia', {
        url: "/qinjia",
        views: {
          'menuContent': {
            templateUrl: "templates/qinjia.html",
            controller: 'QinjiaCtrl'
          }
        }
      })
      .state('app.mingpian', {
        url: "/mingpian",
        views: {
          'menuContent': {
            templateUrl: "templates/mingpian.html",
            controller: 'MingpianCtrl',
            css:["css/mingpian.css",'css/er.css']
          }
        }
      })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/search');
});
