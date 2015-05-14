 angular.module('starter.services', [])

        .factory('Chats', function () {
            // Might use a resource here that returns a JSON array
            // Some fake testing data
            var chats = [{
                id: 0,
                album: 'Ben Sparrow',
                artist: 'You on your way?',
                image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
            }, {
                id: 1,
                album: 'Max Lynx',
                artist: 'Hey, it\'s me',
                image: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
            }, {
                id: 2,
                album: 'Andrew Jostlin',
                artist: 'Did you get the ice cream?',
                image: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
            }, {
                id: 3,
                album: 'Adam Bradleyson',
                artist: 'I should buy a boat',
                image: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
            }, {
                id: 4,
                album: 'Perry Governor',
                artist: 'Look at my mukluks!',
                image: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
            }];

            return {
                all: function () {
                    return chats;
                },
                GetFeed: function(){
                    return chats;
                },
                GetNewUser: function(){
                    return [{
                        id: 1,
                        album: 'Max Lynx',
                        artist: 'Hey, it\'s me',
                        image: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
                    }];
                },
                get: function (chatId) {
                    for (var i = 0; i < chats.length; i++) {
                        if (chats[i].id === parseInt(chatId)) {
                            return chats[i];
                        }
                    }
                    return null;
                }
            };
        })
     .factory('browseService', ['$http', function($http) {
         //service与后台交互demo
         var doRequest = function() {
             return  $http({
                 method: 'post',
                 data:{},
                 url:"/dosola-app/api/jsonService"
             });
         }
         return {
             events: function() { return doRequest(); }
         };
     }]); ;

