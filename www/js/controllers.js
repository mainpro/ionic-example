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
        $scope.ceshi="ni hao ";
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
    .controller('QinjiaCtrl', function($scope) {
        $scope.username="1504221351419754";
        $scope.appKey="f84e559a-d811-4407-9c0b-50c15cf436f8";
        $scope.toUsername="1504300034132144";
        $scope.loginQinjia=function(appKey,username,password){
            // 绑定 AppKey
            IM.bind("f84e559a-d811-4407-9c0b-50c15cf436f8");
            //连接成功
            IM.onConnect(function() {
                //warn('Client has connected to the server!');
            });
            //断开连接
            IM.onDisconnect(function() {
                //warn('Client has disconnect to the server!');
            });
            // 帐号在其它地方登陆
            IM.onForceLogout(function() {
                //warn('login in other places');
            });
            //接收消息
            IM.onMsg([ IM_CONSTANT.CHAT_TYPE.USER ], function(msg) {
                //$("#targetId").val(msg.senderAccount);
                //onMsgLog('用户[' + msg.receiverId + '] ' + '收到消息: ' + CHAT_TYPE_TXT[msg.chatType] + ' [' + msg.senderAccount + '] say : [' + TYPE_TXT[msg.msgType] + '] ' + msg.content);
            });
            //登陆用户
            IM.login(username, password, function(status) {
                if (status == IM_STATUS.SUCCESS) {
                    //warn('login success!');
                } else if (status == IM_STATUS.LOGIN.RE_LOGIN_ERROR) {
                    //warn('has login!');
                }
                var sd = new Date() * 1;
                IM.res.getChatSessions(function(chatSessions) {
                    for ( var i = 0, session; session = chatSessions[i++];) {
                        if (session.chatType == IM_CONSTANT.CHAT_TYPE.USER) {
                            //info("会话:from user[" + session.account + "], 未读消息数:" + session.msgNumber + ", 最后对话时间:" + session.lastChatTime);
                            var data = {
                                "senderAccount" : username,
                                "receiverType" : IM_CONSTANT.CHAT_TYPE.USER,
                                "receiverId" : session.account,
                                "index" : 0,
                                "count" : 2
                            };
                            // 拉用户消息记录
                            IM.res.getMsgs(data, function(msgList) {
                                for ( var i = 0, msg; msg = msgList[i++];) {
                                    //info("getMsgs:发送者帐号:" + msg.senderAccount + ", 接收类型:" + msg.receiverType + ", 接收id:" + msg.receiverId + ", 消息类型:" + msg.msgType + ", 发送时间(秒):" + msg.sendTime
                                        //+ ", 发送时间(豪秒):" + msg.sendTimeMs + ", 消息内容:" + msg.content);
                                }
                                var ed = new Date() * 1;
                                //info("total time:" + (ed - sd) / 1000);
                            });
                            if (session.msgNumber > 0) {
                                var data = {
                                    "targetId" : session.account,
                                    "chatType" : IM_CONSTANT.CHAT_TYPE.USER,
                                    "count" : session.msgNumber
                                }
                                IM.res.getOfflineMsgs(data, function(msgList) {
                                    for ( var i = 0, msg; msg = msgList[i++];) {
                                        //info("用户离线消息----:发送者帐号:" + msg.senderAccount + ", 接收类型:" + msg.receiverType + ", 接收id:" + msg.receiverId + ", 消息类型:" + msg.msgType + ", 发送时间(秒):" + msg.sendTime
                                            //+ ", 发送时间(豪秒):" + msg.sendTimeMs + ", 消息内容:" + msg.content);
                                    }
                                });
                            }
                        }
                    }
                }, function(s) {
                    alert(s)
                });

            }, function(status) {
                //warn('login fail!');
            });
        }
        $scope.sendMessage=function(targetId,message,chatType){
            $scope.toUsername="wo ca";
            var opts = {
                "chatType" : chatType,
                "receiverId" : targetId,
                "content" : message
            };
            IM.sendText(opts, function(status) {
                //sendMsgLog('发送消息： ' + CHAT_TYPE_TXT[chatType] + '[' + targetId + '] : [' + TYPE_TXT[msgType] + '] ' + message);
                $scope.toUsername="wo ca1";
            }, function(status) {
                $scope.toUsername='发送失败';
            });
        }
    })
    .controller('MingpianCtrl', function($scope, $ionicPopup) {
        // Triggered on a button click, or some other target
        $scope.showPopup = function() {
            var myPopup = $ionicPopup.show({
                cssClass:'er-popup',
                templateUrl: 'templates/er_modal.html',
                scope: $scope
            });
            myPopup.then(function(res) {

            });
        };
            /*$scope.data = {}
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="data.wifi">',
                title: 'Enter Wi-Fi Password',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.wifi) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.data.wifi;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);
            });
            $timeout(function() {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };*/
        // A confirm dialog
        $scope.showConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Consume Ice Cream',
                template: 'Are you sure you want to eat this ice cream?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        };

        // An alert dialog
        $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Don\'t eat that!',
                template: 'It might taste good'
            });
            alertPopup.then(function(res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };
    })

;
