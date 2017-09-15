//index.js
//获取应用实例
Page({
    data: {
        userInfo: null,
        isAdmin: false,
        realName: '', 
    },
    onLoad: function () {
        var that = this, initTime = 0, app = getApp();
        if (!app.globalData.isRead) {
            //限制20次访问 （10秒）
            if (initTime <= 20) {
                setTimeout(that.onLoad, 500);
                initTime++;
                return;
            } else {
                wx.hideToast();
                wx.showModal({
                    title: '登录时间过长！',
                    content: '是否重新登录',
                    success: function (res) {
                        if (res.confirm) {
                            app.onLogin(that.onLoad);
                        }
                    }
                })
            }
        } else {
            var roles = app.globalData.roles;

            that.setData({
                userInfo: app.globalData.userInfo,
                realName: app.globalData.employeeName
            })
            var rolesInfo = require('../../utils/data.js').roleInfo();
            //查看权限
            for (var i = 0; i < roles.length; i++) {
                if (roles[i] == rolesInfo.admin) {
                    that.setData({
                        isAdmin: true
                    })
                    console.log(roles[i])
                }
            }
        }
    } ,
    //员工管理按钮
    toEmployeeManage: function () {
        var that = this
        if (that.data.isAdmin) {
            wx.navigateTo({
                url: '../employeeManage/employeeManage'
            })
        } else {
            wx.navigateTo({
                url: '../regist/regist'
            })
        }
    },
    //积分兑换按钮
    toExchange: function () {
        var that = this
        if (that.data.isAdmin) {
            wx.navigateTo({
                url: '../exchangePerson/exchangePerson'
            })
        } else {
            wx.navigateTo({
                url: '../regist/regist'
            })
        }
    },
    //参数设置
    toParamSetting: function () {
        var that = this
        if (that.data.isAdmin) {
            wx.navigateTo({
                url: '../exchangeRate/exchangeRate'
            })
        } else {
            wx.navigateTo({
                url: '../regist/regist'
            })
        }
    },
})
