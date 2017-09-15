//app.js
App({
    onLaunch: function () {
        var that = this;
        //调用API从本地缓存中获取数据
        var authentication = wx.getStorageSync('authentication');
        //获取不到session 进行登录
        if (authentication == null || authentication == '') {
            console.log('本地authentication为空，重新获取');
            that.onLogin(that.getRoleInfo);
        } else {
            wx.checkSession({
                success: function () {
                    console.log('authentication正常 登录状态保持中 authentication：' +
                        authentication);
                    wx.getUserInfo({
                        success: function (getUserRes) {
                            that.globalData.userInfo = getUserRes.userInfo;
                        }
                    });
                    that.getRoleInfo();
                },
                //获取到session已过期 进行登录
                fail: function () {
                    that.onLogin(that.getRoleInfo);
                }
            })
        }
    },
    //获取 session
    onLogin: function (fn, pram) {
        var that = this;
        if (that.globalData.isLock) {
            that.globalData.isLock = false;
            var serverInfo = that.globalData.xiaochengxuInfo;
            var serverPath = serverInfo.protocol + serverInfo.domin_name +
                serverInfo.pathContext + serverInfo.onLoginPath;
            wx.login({
                fail: function () {
                    that.globalData.isLock = true;
                    console.log('调用wxAPI login失败！');
                },
                success: function (loginRes) {
                    wx.getUserInfo({
                        fail: function () {
                            wx.showModal({
                                title: '',
                                content: '请授权公共信息',
                                showCancel: false
                            });
                            console.log('调用wxAPI getUserInfo失败！');
                            that.globalData.isLock = true;
                        },
                        success: function (getUserRes) {
                            console.log('登录中...');
                            wx.showToast({
                                title: '登录中...',
                                icon: 'loading',
                                mask: true
                            })
                            wx.request({
                                url: serverPath,
                                data: {
                                    code: loginRes.code,
                                    encryptedData: getUserRes.encryptedData,
                                    iv: getUserRes.iv
                                },
                                success: function (res) {
                                    //登录成功
                                    if (res.data.success) {
                                        //将 证书放进本地缓存
                                        wx.setStorageSync('authentication', res.data.content);
                                        //    that. getRoleInfo();
                                        //设置全局变量 
                                        that.globalData.userInfo = getUserRes.userInfo;
                                        wx.hideLoading();
                                        if (typeof fn == 'function') fn(pram);
                                        console.log('登录成功！authentication:' +
                                            wx.getStorageSync('authentication'));
                                    } else {
                                        wx.showModal({
                                            title: '',
                                            content: '登录失败，服务器内部错误',
                                            showCancel: false
                                        });
                                        console.log('authentication无法获取！服务器内部错误');
                                    }
                                },
                                fail: function (e) {
                                    wx.showModal({
                                        title: '',
                                        content: '连接失败，请确认网络环境',
                                        showCancel: false
                                    });
                                    console.log('服务器无响应！请检查网络连接');
                                },
                                complete: function (e) {
                                    that.globalData.isLock = true;
                                    wx.hideToast();
                                }
                            })
                        },
                    })
                }
            })
        }
    },
    //全局对象 用于存放全局变量
    globalData: {
        userInfo: null,
        xiaochengxuInfo: require('utils/data.js').configuration_info(),
        isRead: false,
        isLock: true,
        roles: [],
        employeeName: null
    },
    /**
     * 获取当前用户权限，员工姓名。存在app全局变量
     * fn：获取权限成功后执行的方法
     */
    getRoleInfo: function (fn) {
        var that = this;
        console.log("获取userinfo。。。")
        wx.showLoading({
            title: '获取用户信息...',
            mask: true,
        });
        var commonAPI = require('utils/common.js');
        var flagR = false, flagN = false;
        //获取权限
        commonAPI.getRequestSyn(
            "/mini-program/getRoles", {},
            function (res) {
                var roles = res.data.content;
                var rolesName = [];
                //查看权限，并保存到全局变量
                for (var i = 0; i < roles.length; i++) {
                    rolesName.push(roles[i].roleName);
                }
                that.globalData.roles = rolesName;
                flagR = true;
                if (flagR && flagN) {
                    that.globalData.isRead = true;
                    wx.hideLoading();
                }
                if (typeof fn == 'function') fn();
            }, that.getRoleInfo, fn)
        // 获取员工姓名
        if (that.globalData.employeeName == null) {
            commonAPI.getRequestSyn(
                "/mini-program/getName", {},
                function (res) {
                    var employeeInfo = res.data.content;
                    that.globalData.employeeName = employeeInfo ? employeeInfo.realName : null;
                    flagN = true;
                    if (flagR && flagN) {
                        that.globalData.isRead = true;
                        wx.hideLoading();
                    }
                }, that.getRoleInfo);
        }else{
            flagN = true;
            if (flagR && flagN) {
                that.globalData.isRead = true;
                wx.hideLoading();
            }
        }
    },
})
